import uuid
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session
from kinde_sdk.auth.oauth import OAuth
from config import configuration as config
from config.database import SessionLocal
from users.modules import user_service

from users.controller import app as users_router
from auth.controller import app as auth_router


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Simple in-memory store: { token: user_data }
# Bypasses the broken SDK session middleware conflicts entirely
AUTH_STORE: dict = {}

app = FastAPI(title="Be Assured API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        config.FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=config.SESSION_SECRET_KEY,
    same_site="lax",
    https_only=False,
)

# Connect OAuth to the app for proper session management
oauth = OAuth(
    framework="fastapi",
    client_id=config.KINDE_CLIENT_ID,
    client_secret=config.KINDE_CLIENT_SECRET,
    host=config.KINDE_DOMAIN,
    redirect_uri=config.KINDE_CALLBACK_URL,
    app=app,  # This is crucial for state management
)

app.include_router(users_router, prefix="/api/users")
app.include_router(auth_router, prefix="/api/auth")


@app.get("/api/login")
async def login(request: Request):
    # Wipe the session to keep cookie size minimal
    request.session.clear()
    request.session["auth_flow"] = "login"

    url = await oauth.login()

    # Capture the device_id the SDK just generated
    request.session["current_device_id"] = oauth._framework.get_name()
    print(
        f"[login] device_id={request.session['current_device_id']} → {url}", flush=True
    )
    return RedirectResponse(url=url)


@app.get("/api/register")
async def register(request: Request):
    # Wipe the session to keep cookie size minimal
    request.session.clear()
    request.session["auth_flow"] = "register"

    url = await oauth.register()

    # Capture the device_id the SDK just generated
    request.session["current_device_id"] = oauth._framework.get_name()
    print(
        f"[register] device_id={request.session['current_device_id']} → {url}",
        flush=True,
    )
    return RedirectResponse(url=url)


@app.get("/api/callback")
async def callback(
    request: Request, code: str, state: str = None, db: Session = Depends(get_db)
):
    try:
        print(f"[callback] code={code[:10]}... state={state}", flush=True)
        print(f"[callback] session keys: {list(request.session.keys())}", flush=True)

        # Let the SDK handle the state validation automatically
        result = await oauth.handle_redirect(code, state)

        # Extract user from result
        user_data = result.get("user", {}) if isinstance(result, dict) else {}
        print(f"[callback] user={user_data}", flush=True)

        # Ensure user is in our local DB
        db_user = user_service.get_or_create_user(db, user_data)

        # Add local DB ID to the session user data
        user_data["user_id"] = str(db_user.user_id)
        user_data["role"] = db_user.role

        # Store user in our own token store (bypasses broken session middleware)
        token = str(uuid.uuid4())
        AUTH_STORE[token] = user_data

        # Determine redirect based on auth flow
        auth_flow = request.session.get("auth_flow", "login")
        if auth_flow == "register":
            redirect_url = config.FRONTEND_URL + "/onboarding"  # new user
        else:
            redirect_url = config.FRONTEND_URL + "/dashboard"  # returning user
        print(f"[callback] flow={auth_flow} → {redirect_url}", flush=True)

        response = RedirectResponse(redirect_url)
        response.set_cookie(
            key="ba_auth",
            value=token,
            httponly=True,
            samesite="lax",
            max_age=86400,  # 1 day
        )
        print(f"[callback] auth token set: {token}", flush=True)
        return response

    except HTTPException:
        raise
    except Exception as e:
        print(f"[callback] ERROR: {e}", flush=True)
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/user")
async def get_user(request: Request):
    token = request.cookies.get("ba_auth")
    print(f"[user] ba_auth cookie: {token}", flush=True)

    if token and token in AUTH_STORE:
        return JSONResponse(content=AUTH_STORE[token])

    return JSONResponse(status_code=401, content={"error": "Not authenticated"})


@app.get("/api/logout")
async def logout(request: Request):
    token = request.cookies.get("ba_auth")
    if token and token in AUTH_STORE:
        AUTH_STORE.pop(token)

    # Get Kinde logout URL (clears SSO session)
    logout_url = await oauth.logout(
        logout_options={"post_logout_redirect_uri": config.FRONTEND_URL}
    )

    # Create the redirect to Kinde
    response = RedirectResponse(url=logout_url)

    # Clear local session state attached to this response
    response.delete_cookie("ba_auth")
    request.session.clear()

    return response


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
