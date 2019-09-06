#!/bin/bash
DATE=`date +%Y%m%d`
TIME=`date +%H%M`
POSTGRES_HOSTNAME=db
OUTDIR=`mktemp -d`
die() { echo "$*" 1>&2 ; exit 1; }
#calculate the closest complete run
echo $TIME
if [ "$TIME" -lt "0345" ]; then 
    REFDATE=`date +%Y%m%d -d yesterday`
    REFTIME="18"
elif [ "$TIME" -lt "0945" ]; then
    REFDATE=$DATE
    REFTIME="00"
elif [ "$TIME" -lt "1545" ]; then
    REFDATE=$DATE
    REFTIME="06"
elif [ "$TIME" -lt "2145" ]; then
    REFDATE=$DATE
    REFTIME="12"
else 
    REFDATE=$DATE
    REFTIME="18"
fi


#download the latest run datum
#Download and process all the requested data into csv
for i in {0..78}; do 
    printf -v TIMEPOS "%03d" $i
    CSVU=$OUTDIR/$REFDATE$REFTIME\_$TIMEPOS\_U_10M.csv
    CSVV=$OUTDIR/$REFDATE$REFTIME\_$TIMEPOS\_V_10M.csv
    (curl https://opendata.dwd.de/weather/nwp/icon-eu/grib/$REFTIME/u_10m/icon-eu_europe_regular-lat-lon_single-level_$REFDATE$REFTIME\_$TIMEPOS\_U_10M.grib2.bz2 | bunzip2 > $OUTDIR/$REFDATE$REFTIME\_$TIMEPOS\_U_10M.grib2 && 
    ./wgrib2 $OUTDIR/$REFDATE$REFTIME\_$TIMEPOS\_U_10M.grib2 -s -undefine out-box 11.8606258:19.1775203 48.5031603:51.11666 -csv $OUTDIR/$REFDATE$REFTIME\_$TIMEPOS\_U_10M.csv &&
    psql -c "\copy stage from '$CSVU' delimiter ','" -h $POSTGRES_HOSTNAME -U wforecast_app  wforecast &&
    curl https://opendata.dwd.de/weather/nwp/icon-eu/grib/$REFTIME/v_10m/icon-eu_europe_regular-lat-lon_single-level_$REFDATE$REFTIME\_$TIMEPOS\_V_10M.grib2.bz2 | bunzip2 > $OUTDIR/$REFDATE$REFTIME\_$TIMEPOS\_V_10M.grib2 &&
    ./wgrib2 $OUTDIR/$REFDATE$REFTIME\_$TIMEPOS\_V_10M.grib2 -s -undefine out-box 11.8606258:19.1775203 48.5031603:51.11666 -csv $OUTDIR/$REFDATE$REFTIME\_$TIMEPOS\_V_10M.csv &&
    psql -c "\copy stage from '$CSVV' delimiter ','" -h $POSTGRES_HOSTNAME -U wforecast_app  wforecast ) || die "Download or stage load failed."
    rm $OUTDIR/$REFDATE$REFTIME\_$TIMEPOS\_U_10M.grib2 $OUTDIR/$REFDATE$REFTIME\_$TIMEPOS\_V_10M.grib2
    rm $OUTDIR/$REFDATE$REFTIME\_$TIMEPOS\_U_10M.csv
    rm $OUTDIR/$REFDATE$REFTIME\_$TIMEPOS\_V_10M.csv
done
rm -fR $OUTDIR

# run processing sql to load data into primary table to be available to the WS
(psql -c "SELECT fill_forecasts()" -h $POSTGRES_HOSTNAME -U wforecast_app  wforecast ) || die "Exec stored procedure failed."
