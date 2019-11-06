import requests,psycopg2,logging
try: 
    aqdata=requests.get('http://portal.chmi.cz/files/portal/docs/uoco/web_generator/aqindex_cze.json').json()
    conn = psycopg2.connect(user = "wforecast_app", password = "wfapp",
                                              host = "db",
                                              port = "5432",
                                              database = "wforecast")
                                            

    curr = conn.cursor()
    hour = aqdata["States"][0]["DateToUTC"]
    for station in aqdata["States"][0]["Regions"][13]["Stations"]:
        statcode = station["Code"]
        for component in station["Components"]: 
            pollutant = component["Code"]
            interval = component.get("Int")
            val = component.get("Val")
            if (val!=None and val!=''):
                curr.execute("insert into isko.isko_data (observation_hour,station,pollutant,interval,val) VALUES(date_trunc('hour',%s::timestamp),%s,%s,%s,%s)",[hour,statcode,pollutant,interval,val.replace(' ','')])
    conn.commit()            
    conn.close()
    logging.info("ISKO download successful")
except(Exception):
    logging.exception("Download failed with exception ")