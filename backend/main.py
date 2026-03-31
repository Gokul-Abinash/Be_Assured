from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
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
    url = await oauth.login
    return RedirectResponse(url=url)


@app.get("/register")
async def register(request: Request):
    """Redirect to Kinde registration page."""
    url = await oauth.register()
    return RedirectResponse(url=url)


@app.get("/callback")
async def callback(request: Request, code: str, state: str = None):
    """Handle the OAuth callback from Kinde."""
    try:
        result = await oauth.handle_redirect(code, state)
        print(result)
        return RedirectResponse(url="/")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Authentication failed: {str(e)}")


@app.get("/logout")
async def logout(request: Request):
    """Logout the user and redirect to Kinde logout page."""
    await oauth.logout()
    return RedirectResponse(url="/")


@app.get("/user")
async def get_user(request: Request):
    """Get the current user's information."""
    if not await oauth.is_authenticated(request):
        url = await oauth.login()
        return RedirectResponse(url=url)
    return await oauth.get_user_info(request)


@app.post("/callback")
async def callback_debug(request: Request):
    return "OK"


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
