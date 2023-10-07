FROM python:3.11-slim

WORKDIR /app

COPY ./ /app

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Make port 8001 available to the world outside the container
EXPOSE 8001

# Define environment variable for FastAPI to run on 0.0.0.0
ENV HOST=0.0.0.0

# Run app.py when the container launches
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]
