FROM python:3

RUN mkdir /var/static
RUN pip install Flask mysql.connector

COPY master.py /var/static/server.py

EXPOSE 5000

CMD python /var/static/server.py
