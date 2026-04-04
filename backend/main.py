import uuid
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from kinde_sdk.auth.oauth import OAuth
from config import configuration as config

from users.controller import app as users_router
from auth.controller import app as auth_router

# Simple in-memory store: { token: user_data }
# Bypasses the broken SDK session middleware conflicts entirely
AUTH_STORE: dict = {}

app = FastAPI(title="Be Assured API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
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

# app=app lets SDK register FrameworkMiddleware for PKCE session handling
oauth = OAuth(
    framework="fastapi",
    app=app,
    client_id=config.KINDE_CLIENT_ID,
    client_secret=config.KINDE_CLIENT_SECRET,
    host=config.KINDE_DOMAIN,
    redirect_uri="http://127.0.0.1:8000/api/callback",
)

app.include_router(users_router, prefix="/api/users")
app.include_router(auth_router, prefix="/api/auth")


@app.get("/api/login")
async def login(request: Request):
    # Clear stale device session keys to prevent cookie bloat (>4KB truncation)
    stale_keys = [k for k in request.session.keys() if k.startswith("device:")]
    for k in stale_keys:
        del request.session[k]
    url = await oauth.login()
    print(f"[login] → {url}", flush=True)
    return RedirectResponse(url=url)


@app.get("/api/register")
async def register(request: Request):
    # Clear stale device session keys to prevent cookie bloat (>4KB truncation)
    stale_keys = [k for k in request.session.keys() if k.startswith("device:")]
    for k in stale_keys:
        del request.session[k]
    url = await oauth.register()
    print(f"[register] → {url}", flush=True)
    return RedirectResponse(url=url)


@app.get("/api/callback")
async def callback(request: Request, code: str, state: str = None):
    try:
        print(f"[callback] code={code[:10]}... state={state}", flush=True)

        # Extract device_id from the session key (device:<uuid>:state)
        device_id = None
        for key in request.session.keys():
            if key.endswith(":state"):
                device_id = key.split(":")[1]
                break

        if not device_id:
            raise HTTPException(status_code=400, detail="No device session found")

        print(f"[callback] device_id={device_id}", flush=True)

        # Correct call: handle_redirect(code, user_id, state)
        result = await oauth.handle_redirect(code, device_id, state)

        # Extract user from result
        user_data = result.get("user", {}) if isinstance(result, dict) else {}
        print(f"[callback] user={user_data}", flush=True)

        # Store user in our own token store (bypasses broken session middleware)
        token = str(uuid.uuid4())
        AUTH_STORE[token] = user_data

        # Redirect to frontend and set a plain auth cookie
        response = RedirectResponse("http://127.0.0.1:5173/onboarding")
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
        del AUTH_STORE[token]
    response = RedirectResponse(url="http://127.0.0.1:5173/")
    response.delete_cookie("ba_auth")
    return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
