FROM debian:buster-slim
COPY wgrib2 download.sh /opt/icon/
RUN apt-get update && apt-get -y install cron libgfortran4 libgomp1 curl postgresql-client
RUN useradd icon -d /opt/icon && \
    echo 'postgres:5432:wforecast:wforecast_app:wfapp' > /opt/icon/.pgpass &&\
    chown -R icon:icon /opt/icon/ && \
    chmod u+x /opt/icon/wgrib2 /opt/icon/download.sh &&\
    echo '47 0,3,6,9,12,15,18,21 * * *       /opt/icon/download.sh >> /tmp/cronlog'|crontab -u icon - 
USER root
WORKDIR /opt/icon
CMD ["/usr/sbin/cron", "-f", "-L","8"]

