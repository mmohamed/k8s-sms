FROM python:3

RUN mkdir /var/static
RUN pip install Flask flask-jwt-extended flask_cors mysql.connector

COPY api-server.py /var/static/server.py

EXPOSE 5000

CMD python /var/static/server.py
