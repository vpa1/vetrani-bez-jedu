import psycopg2 
from psycopg2 import pool
import logging
class Dbget:
  def __init__(self):
    try:
        self.postgreSQL_pool = psycopg2.pool.ThreadedConnectionPool(1, 20,user = "wforecast_app",
                                              password = "wfapp",
                                              host = "db",
                                              port = "5432",
                                              database = "wforecast")
        if(self.postgreSQL_pool):
            logging.debug("Connection pool created successfully")
    except (Exception, psycopg2.DatabaseError) :
        logging.exception("Error while connecting to PostgreSQL")
      #closing database connection.
      # use closeall method to close all the active connection if you want to turn of the application
        if (self.postgreSQL_pool):
            self.postgreSQL_pool.closeall
        logging.info("PostgreSQL connection pool is closed")
  def getWeatherData(self,lat,lon):
    lat=float(lat)
    lon=float(lon)
    lat=lat//0.0625*0.0625
    lon=lon//0.0625*0.0625
    try: 
      ps_connection = self.postgreSQL_pool.getconn()
      if(ps_connection):
        curr = ps_connection.cursor()
        curr.execute("SELECT to_json(max(startdate))FROM forecast_table where lat=%s AND lon=%s",[lat,lon])
        stdaterec=curr.fetchone()
        curr.execute("SELECT to_json(forecast_date),wind_speed,wind_direction from forecast_table where lat=%s AND lon=%s ORDER BY forecast_date",[lat,lon])
        records = curr.fetchall()
        outrecs = {"speed":[],"direction":[]}
        firstrec = True
        for i in records:
          if (firstrec):
            outrecs["refdate"]=i[0]
            firstrec=False
          outrecs.get("speed").append(i[1])
          outrecs.get("direction").append(i[2])
        outrecs["latestforecast"]=stdaterec[0]
        return outrecs

    except (Exception):
      logging.exception("Database query failed")
    finally:
      self.postgreSQL_pool.putconn(ps_connection)
    



  