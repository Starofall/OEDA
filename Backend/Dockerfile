FROM python:2.7
RUN apt-get update && \
    pip install pdfkit && \
    pip install boto && \
    pip install tqdm && \
    pip install decorator && \
    pip install ez_setup && \
    pip install cherrypy && \
    pip install minio && \
    pip install cherrypy-cors
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y openssl build-essential xorg libssl-dev
COPY ./ /app
EXPOSE 8080
WORKDIR /app/
CMD python /app/run.py
