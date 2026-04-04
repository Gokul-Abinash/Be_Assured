#!/usr/bin/env python3
"""Quick migration to fix pan_number column type"""
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

# Connect using your DATABASE_URL or individual params
db_url = os.getenv("DATABASE_URL")

if db_url:
    conn = psycopg2.connect(db_url)
else:
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )

cur = conn.cursor()
cur.execute("ALTER TABLE workers ALTER COLUMN pan_number TYPE TEXT;")
conn.commit()
cur.close()
conn.close()

print("✅ Fixed: pan_number column changed to TEXT type")
