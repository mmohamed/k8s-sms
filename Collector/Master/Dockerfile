FROM python

RUN pip install mysql.connector

COPY master.py /var/static/server.py

CMD python /var/static/server.py