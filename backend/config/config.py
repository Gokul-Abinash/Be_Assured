import os
from dotenv import load_dotenv
from typing import List


class Configuration:
    def __init__(self, env_files: List[str]):
        for env_file in env_files:
            if not os.path.exists(env_file):
                raise RuntimeError(f"Env file not found: {env_file}")
            load_dotenv(env_file)

        self.KINDE_DOMAIN = self.get("KINDE_DOMAIN")
        self.KINDE_CLIENT_ID = self.get("KINDE_CLIENT_ID")
        self.KINDE_CLIENT_SECRET = self.get("KINDE_CLIENT_SECRET")
        self.KINDE_CALLBACK_URL = self.get("KINDE_CALLBACK_URL")
        self.SESSION_SECRET_KEY = self.get(
            "SESSION_SECRET_KEY", default="a_very_secret_key"
        )
        self.FRONTEND_URL = self.get("FRONTEND_URL", default="http://localhost:5173")

    def get(self, key: str, cast=str, default=None, required=False):
        val = os.getenv(key, default)
        if required and val is None:
            raise RuntimeError(f"Missing required env var: {key}")
        try:
            return cast(val) if val is not None else None
        except Exception:
            raise RuntimeError(f"Invalid type for env var: {key}")
