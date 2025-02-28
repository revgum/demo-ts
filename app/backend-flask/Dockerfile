# Run
FROM localhost/microservice-python-build
WORKDIR /app
COPY requirements.txt /app
RUN pip install -r requirements.txt
COPY /src /app/src
COPY /migrations /app/migrations
EXPOSE 3003
CMD [ "gunicorn", "-b", "0.0.0.0:3003", "-w", "4", "'app:app'" ]
