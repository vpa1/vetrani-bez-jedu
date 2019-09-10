create role wforecast;
create role wforecast_app LOGIN password 'wfapp';
create database wforecast owner wforecast;
grant connect on DATABASE wforecast to wforecast_app;
\connect wforecast

create table stage (comp_date VARCHAR,forecast_date VARCHAR,field VARCHAR,level VARCHAR,lon FLOAT,lat FLOAT,val FLOAT);
grant all on stage to wforecast_app;

create table forecast_table (forecast_date TIMESTAMP WITH TIME ZONE, lat FLOAT, lon FLOAT, startdate TIMESTAMP WITH TIME ZONE, wind_speed FLOAT,wind_direction FLOAT, PRIMARY KEY (forecast_date,lat,lon));
CREATE INDEX forecast_idx ON forecast_table (lat,lon);

grant all on forecast_table to wforecast_app;

CREATE FUNCTION fill_forecasts() RETURNS void AS $$
DECLARE
    row RECORD;
BEGIN
    delete from forecast_table where forecast_date < now() - interval '12 hours';
    FOR row IN select st1.comp_date,st1.forecast_date,st1.lat,st1.lon,st1.val uval,st2.val vval from stage st1 left join stage st2 ON (st2.forecast_date=st1.forecast_date AND st1.lat=st2.lat AND st1.lon=st2.lon AND st2.field='"VGRD"')  WHERE st1.field='"UGRD"' LOOP
        INSERT INTO forecast_table VALUES(row.forecast_date::timestamp AT TIME ZONE 'UTC',row.lat,row.lon,row.comp_date::timestamp AT TIME ZONE 'UTC',SQRT(row.uval^2+row.vval^2),ATAN2(-row.uval,-row.vval)*180/PI() )
        ON CONFLICT (forecast_date,lat,lon) DO UPDATE SET startdate=row.comp_date::timestamp AT TIME ZONE 'UTC',wind_speed=SQRT(row.uval^2+row.vval^2),wind_direction=ATAN2(-row.uval,-row.vval)*180/PI() WHERE forecast_table.forecast_date = row.forecast_date::timestamp AT TIME ZONE 'UTC' AND forecast_table.lat=row.lat AND forecast_table.lon=row.lon;
    END LOOP;
    TRUNCATE TABLE stage;
END;
$$ LANGUAGE plpgsql;
grant execute on function fill_forecasts to wforecast_app;