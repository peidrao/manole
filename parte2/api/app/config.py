import os

DATABASE_URL = os.getenv(
    'DATABASE_URL',
    'postgresql+psycopg://postgres:postgres@db:5432/tasks_db',
)
JWT_SECRET = os.getenv('JWT_SECRET', 'super-secret-change-me')
JWT_ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '60'))
