from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse, Response
from starlette.middleware.sessions import SessionMiddleware
from kinde_sdk.auth.oauth import OAuth
from config import configuration as config

from users.controller import app as users_router
from auth.controller import app as auth_router

app = FastAPI(title="Be Assured API", version="1.0.0")
app.add_middleware(SessionMiddleware, secret_key=config.SESSION_SECRET_KEY)

app.include_router(users_router, prefix="/users")
app.include_router(auth_router, prefix="/auth")


oauth = OAuth(
    framework="fastapi",
    app=app,
    client_id=config.KINDE_CLIENT_ID,
    client_secret=config.KINDE_CLIENT_SECRET,
    host=config.KINDE_DOMAIN,
    redirect_uri=config.KINDE_CALLBACK_URL,
)


@app.get("/login")
async def login(request: Request):
    """Redirect to Kinde login page."""
    url = await oauth.login()
    print(f'[GET /login] Redirecting to: {url}',flush=True)
    return RedirectResponse(url=url)


@app.get("/register")
async def register(request: Request):
    """Redirect to Kinde registration page."""
    url = await oauth.register()
    print(f'[GET /register] Redirecting to: {url}')
    return RedirectResponse(url=url)


@app.get("/callback")
async def callback(request: Request, code: str, state: str = None):
    try:
        response = await oauth.handle_redirect(code, state)

        # If SDK already returns a response (redirect), just return it
        if isinstance(response, Response):
            print(f'[POST /callback] SDK returned response: {response}')    
            return response

        # Otherwise store user
        request.session["user"] = response
        print(f'[POST /callback] User stored in session: {request.session["user"]}') 

        return RedirectResponse("http://localhost:3000/onboarding")

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/logout")
async def logout(request: Request):
    """Logout the user and redirect to Kinde logout page."""
    await oauth.logout()
    return RedirectResponse(url="http://localhost:3000/")


@app.get("/user")
async def get_user(request: Request):
    """Get the current user's information."""
    if not await oauth.is_authenticated(request):
        url = await oauth.login()
        print(f'[GET /user] Redirecting to login: {url}')
        return RedirectResponse(url=url)
    return await oauth.get_user_info(request)


# @app.post("/callback")
# async def callback_debug(request: Request):
#     return RedirectResponse(url="http://localhost:3000/onboarding")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
