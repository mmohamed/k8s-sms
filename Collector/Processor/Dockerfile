FROM python

RUN pip install mysql.connector

COPY processor.py /var/static/server.py

CMD python /var/static/server.py