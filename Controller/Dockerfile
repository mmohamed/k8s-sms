FROM python:3

RUN mkdir /var/static

COPY annotations.py /var/static
COPY controller.py /var/static

RUN pip install kubernetes

CMD python /var/static/controller.py
