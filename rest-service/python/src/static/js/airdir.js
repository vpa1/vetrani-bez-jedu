var airdir=function() {
    $("#mapa").on("touchmove",function(event) {
            event.preventDefault();
    })
var sourceList = [
    {lat:18.277,lon:49.858,dist:3800,color:"red",label:"Koksovna Svoboda",body:"Provozovatel: OKK Koksovny, a. s.<br>\
    Kapacita: 840 tis. t. CKS/rok<br>\
    Benzo(a)pyren, benzen, PAU, PM10, PM2.5, As, HCN<br>\
    <a href=\"https://www.ceskatelevize.cz/ivysilani/1095913550-nedej-se/418235100161012-jedy-z-koksaren\">Dokument ČT Jedy z koksáren</a><br>\
    <a href=\"http://portal.chmi.cz/files/portal/docs/uoco/web_generator/plants/CZ080/713760061_CZ.html\">EMIS</a><br>\
    <a href=\"https://www.msk.cz/assets/temata/ippc/files/okk-koksovny---koksovna-svoboda.pdf\">Integrované povolení</a>"},
    {lat:18.325,lon:49.795,dist:3800,color:"red",label:"Koksovna Liberty Steel (KB1+2)",body:"Provozovatel: Liberty Ostrava, a. s.<br>\
    Kapacita: 756 tis. t CKS/rok<br>\
    Benzo(a)pyren, benzen, PAU, PM10, PM2.5, As, HCN, zápach<br>\
    <a href=\"https://ct24.ceskatelevize.cz/domaci/2782736-ostrava-nebo-otrava-bydlite-v-radvanicich-no-tak-co-chcete-rekl-lekar-zene-s\">TV reportáž</a><br>\
    <a href=\"http://portal.chmi.cz/files/portal/docs/uoco/web_generator/plants/CZ080/714220261_CZ.html\">EMIS</a><br>\
    <a href=\"https://www.msk.cz/assets/temata/ippc/files/amo---zavod-10---koksovna.pdf\">Integrované povolení</a>"},
    {lat:18.329,lon:49.788,dist:3800,color:"red",label:"Koksovna Liberty Steel (VKB11)",body:"Provozovatel: Liberty Ostrava, a. s.<br>\
    Kapacita: 775 tis. t CKS/rok<br>\
    Benzo(a)pyren, benzen, PAU, PM10, PM2.5, As, HCN, zápach<br>\
    <a href=\"https://ct24.ceskatelevize.cz/domaci/2782736-ostrava-nebo-otrava-bydlite-v-radvanicich-no-tak-co-chcete-rekl-lekar-zene-s\">TV reportáž</a><br>\
    <a href=\"http://portal.chmi.cz/files/portal/docs/uoco/web_generator/plants/CZ080/714220261_CZ.html\">EMIS</a><br>\
    <a href=\"https://www.msk.cz/assets/temata/ippc/files/amo---zavod-10---koksovna.pdf\">Integrované povolení</a>"},
    {lat:18.2372514,lon:49.8470731,dist:2000,color:"orange",label:"BC-MCHZ - výroba velkoobjemových chemikálií",body:"Provozovatel: BorsodChem MCHZ‚ s.r.o.<br>\
    Kapacita: 165 tis. t anilinu/rok<br>\
    Benzen, VOC, NO<sub>x</sub>, TZL, NH<sub>3</sub>, zápach<br>\
    <a href=\"https://mrak.pirati.cz/s/z43AT4swp8goLFi\">Zpráva ČHMÚ o zdrojích benzenu v Ostravě</a><br>\
    <a href=\"http://portal.chmi.cz/files/portal/docs/uoco/web_generator/plants/CZ080/713830731_CZ.html\">EMIS</a><br>\
    <a href=\"https://www.msk.cz/assets/temata/ippc/files/borsodchem---zarizeni-na-vyrobu-velkoobjemovych-chem.pdf\">Integrované povolení</a>"},
    {lat:18.2522781,lon:49.8408575,dist:2000,color:"orange",label:"Laguny Ostramo",body:"\
    VOC, benzen<br>\
    <a href=\"https://mrak.pirati.cz/s/z43AT4swp8goLFi\">Zpráva ČHMÚ o zdrojích benzenu v Ostravě</a><br>\
    <a href=\"https://www.msk.cz/assets/temata/ippc/files/ave-cz---napravna-opatreni-_-laguny-ostramo.pdf\">Integrované povolení</a>"}
]
var currentWindData={};
var mapa,vrstva,znacky,selectorSlider,timedisplay;
var drawSourceMarker = function(coords,title,header,body,footer,znacky) {
    var card = new SMap.Card();
    card.setSize(200, 300);
    var options = { 
        "title": title
    };
    var marker = new SMap.Marker(coords,"",options)
    card.getHeader().innerHTML=header
    card.getBody().innerHTML=body
    card.getFooter().innerHTML=footer
    marker.decorate(SMap.Marker.Feature.Card, card);
    znacky.addMarker(marker)
}
var getForecastPoints = function() {
    var mappedSources={}
    for (i in sourceList) {
        var roundLat= Math.round(sourceList[i].lat/0.0625)*0.0625;
        var roundLon= Math.round(sourceList[i].lon/0.0625)*0.0625;
        mappedSources[roundLat+";"+roundLon]={"lat":roundLat,"lon":roundLon};
    }
    return mappedSources;
    //ask for forecast on all node points and fill them in cacheable structure
    //applyforecastdata then should apply structure and draw all the sources
}
var getForecastData = function (forecastHour) {
    if (!$.isEmptyObject(cacheddata)) {
        forecastRefDate=new Date(cacheddata.latestforecast)
        var dateDif = new Date()-forecastRefDate;
    }
    if (dateDif>(7*3600*1000) || $.isEmptyObject(cacheddata)) {

        var forecastPoints=getForecastPoints();
        var forecastKeys = Object.keys(forecastPoints);
        var dataobj={}
        var defereds=[]
        for (i in forecastKeys) {
            (function () {
            var ctx=forecastKeys[i];
            defereds.push(jQuery.getJSON("data?lat="+forecastPoints[forecastKeys[i]].lat+"&lon="+forecastPoints[forecastKeys[i]].lon).then(function (data){
                dataobj[ctx]=data;
                dataobj["latestforecast"]=data["latestforecast"]
                dataobj["refdate"]=data["refdate"]
            }));
             })()
        };
        jQuery.when.apply($,defereds).then(function() {//When everything downloaded, we can apply
            applyForecastData(dataobj,forecastHour)
            cacheddata=dataobj
        })
    }
    else {
            applyForecastData(cacheddata,forecastHour);

    }
}
var drawSource = function (coords,range,bearing,speed,arcAngle,color) {
    var ctx = vrstva.getContext();
    ctx.beginPath();
    if (speed<0.5) {
        range=1800;
        arcAngle=45;
    }
    var pixel = coords.toPixel(mapa);
    var x = pixel.x+ctx.canvas.width/2
    var y = pixel.y+ctx.canvas.height/2
    var metric = new SMap.Pixel(1,0).toCoords(mapa).distance(mapa.getCenter())
    var length = range/metric;
    ctx.arc(x,y,length,2*Math.PI/360*(bearing+90-arcAngle/2),2*Math.PI/360*(bearing+90+arcAngle/2));
    ctx.lineTo(x,y) 
    
    var grad = ctx.createRadialGradient(x, y, 0, x, y, length)
    grad.addColorStop(0,color)
    grad.addColorStop(1,"rgba(255,0,0,0)")
    ctx.fillStyle=grad;
    ctx.fill();
}
var getCurrentWindParams = function(lat,lon) {
    var roundLat= Math.round(lat/0.0625)*0.0625;
    var roundLon= Math.round(lon/0.0625)*0.0625;
    return currentWindData[roundLat+";"+roundLon];
}
var redrawfunc=function(full){
    var ctx = vrstva.getContext()
    vrstva.removeAll()
    //49.7880272N, 18.3290719E
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if(ctx.canvas.offsetParent!=null) {
        ctx.canvas.style.left=(-parseInt(ctx.canvas.offsetParent.style.left))+"px"
        ctx.canvas.style.top=(-parseInt(ctx.canvas.offsetParent.style.top))+"px"
    }
    //49.8583478N, 18.2769303E
    for (i in sourceList) {
        source=sourceList[i];
        var windParams=getCurrentWindParams(source.lat,source.lon);
        if (windParams!==undefined) {
            drawSource(SMap.Coords.fromWGS84(source.lat,source.lon),source.dist,windParams.direction,windParams.speed,15,source.color)
        }
    }
    //49.7153828N, 18.2905747E
    /*drawSource(source,3800,winddir,windspeed,15,"red");
    drawSource(source2,3800,winddir,windspeed,15,"red");
    drawSource(source4,3800,winddir,windspeed,15,"red");
    drawSource(source5,2000,winddir,windspeed,15,"orange");
    drawSource(source6,2000,winddir,windspeed,15,"orange");*/
    //drawSource(source3,10000,189,15,"orange");
}
var loadContent = function(filename) {
    jQuery.get("static/"+filename).then(function(data){
        converter = new showdown.Converter()
        $("#content-div").html(converter.makeHtml(data));
        $("#content-container").show();
    })
}
var closeContent=function() {
    $("#content-container").hide();
}
$(window).on("orientationchange",function() {
    $(window).resize()
})
$(window).resize(function() {
    $('#mapa').height(window.innerHeight)
    $('#mapa').width(window.innerWidth)
    $('#mapa').empty()
    if (typeof mapa != "undefined") {
        stred = mapa.getCenter()
    }
    else {
        $("#wrapper").append($('<div class="time-control"><input id="time-selector" type="range" min="0" max="78" value="0"></div>')[0])
        stred = SMap.Coords.fromWGS84(18.29, 49.83);
    }
        mapa = new SMap(JAK.gel("mapa"), stred, 12);
		mapa.addDefaultLayer(SMap.DEF_TURIST).enable();
		mapa.addDefaultControls();	     
        vrstva = new SMap.Layer.Canvas(0,0);
        znacky = new SMap.Layer.Marker(); 
        for (i in sourceList) {
            source=sourceList[i];
            drawSourceMarker(SMap.Coords.fromWGS84(source.lat,source.lon),source.label,"<b>"+source.label+"</b>",source.body,"",znacky)
        }
        mapa.addLayer(znacky)
        mapa.addLayer(vrstva);                      /* Přidat ji do mapy */
        timedisplay=$("#time-display")
        selectorSlider = $('#time-selector');
        selectorSlider.on('input',function(event) {
            getForecastData(parseInt(selectorSlider.val()));
        })
        vrstva.enable(); 
        vrstva.redraw=redrawfunc;
        znacky.enable();
        getForecastData();
        vrstva.redraw()
    
    
})
$(document).on('touchmove', function(event) {
        vrstva.redraw()
        event = event.originalEvent || event;
        if (event.scale != 1 || event.touches.length>1) {
           event.preventDefault();
        }
    });
$(document).on('touchend',function() {
    window.setTimeout(function() {vrstva.redraw()},500)
})
$("#back-button").click(function() {
    getForecastData(null);
})
$("#content-buttons a").click(function(e) {
    if ($(e.delegateTarget).data("content") !== undefined) {
        loadContent($(e.delegateTarget).data("content"))
    }
})
$("#content-close a").click(function() {
    closeContent()
})
        window.scroll(0,1)
      
        var windspeed;
        var forecastRefDate;
        var cacheddata={};
        var getDayStr = function(forecastDate) {
          var now = new Date();
		  var todayStart = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0);
          if ((forecastDate.getTime()-todayStart.getTime()<0) && (forecastDate.getTime()-todayStart.getTime()>-24*3600000)) {
            daystr="Včera";
          }
          else if ((forecastDate.getTime()-todayStart.getTime()<24*3600000)) {
            daystr="Dnes";
          }
          else if ((forecastDate.getTime()-todayStart.getTime()<48*3600000)) {
            daystr="Zítra";
          }
          else {
            daystr = forecastDate.getDate()+". "+(forecastDate.getMonth()+1)+".";
          }
          return daystr;
        }
        var applyForecastData = function(data,forecastHour) {
                forecastRefDate=new Date(data.refdate)
                if (forecastHour==null) {
                    var dateDif = new Date()-forecastRefDate;
                    var currentForecastHour = Math.floor(dateDif/60000/60);
                    Object.keys(data).forEach(function(key) {
                        if (key=="latestforecast"){return;}
                        if (key=="refdate"){return;}
                        var value=data[key]
                        var winddir=value.direction[currentForecastHour]
                        var windspeed=value.speed[currentForecastHour]
                        currentWindData[key]={"speed":windspeed,"direction":winddir}
                    })
                   
                    selectorSlider.val(currentForecastHour);
                    forecastHour=currentForecastHour;
                }
                Object.keys(data).forEach(function(key) {
                        if (key=="latestforecast"){return;}
                        if (key=="refdate"){return;}
                    var value=data[key]
                    var winddir=value.direction[forecastHour]
                    var windspeed=value.speed[forecastHour]
                    currentWindData[key]={"speed":windspeed,"direction":winddir}
                    selectorSlider.attr("max",value.speed.length-1)
                })
                var forecastDate=new Date(forecastRefDate);
                forecastDate.setHours(forecastRefDate.getHours()+forecastHour)
		        var daystr=getDayStr(forecastDate);
		        timedisplay.html(daystr+"<br> "+forecastDate.getHours()+ ":00");
                vrstva.redraw()
        }
$(window).resize();
     
        
}