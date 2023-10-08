FROM python:3.11-slim

WORKDIR /app

COPY ./ /app

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Run app.py when the container launches
CMD ["python", "client.py"]
