FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client curl && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY alembic ./alembic
COPY alembic.ini ./alembic.ini
COPY start.sh ./start.sh
COPY create-user.sh /usr/local/bin/create-user
RUN chmod +x ./start.sh /usr/local/bin/create-user

EXPOSE 8000

ENTRYPOINT ["./start.sh"]
CMD ["run-server"]
