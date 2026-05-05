FROM python:3.11-slim
# Install the Docker tool so this container can restart others
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://get.docker.com | sh \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "agents/health_agent.py"]