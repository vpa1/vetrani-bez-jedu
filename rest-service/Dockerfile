FROM debian:buster-slim
RUN apt-get -y update && apt-get install -y python python-flask python-psycopg2 gunicorn 
COPY python/src/static/* /opt/weather-rest/static/
COPY python/src/static/css/* /opt/weather-rest/static/css/
COPY python/src/static/js/* /opt/weather-rest/static/js/
COPY python/src/static/json/* /opt/weather-rest/static/json/
COPY python/src/static/webfonts/* /opt/weather-rest/static/webfonts/
COPY python/webapp.py /opt/weather-rest/
COPY python/src/weatherDAO.py python/src/__init__.py /opt/weather-rest/src/ 
COPY python/src/templates/index.html /opt/weather-rest/templates/
RUN mkdir -p /opt/weather-rest &&\
    useradd rest -d /opt/weather-rest && chown -R rest:rest /opt/weather-rest

WORKDIR /opt/weather-rest
USER rest
#CMD ["python","/opt/weather-rest/webapp.py"]
CMD ["gunicorn","-b","0.0.0.0:6000","webapp:application"]