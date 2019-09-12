var airdir=function() {
    $("#mapa").on("touchmove",function(event) {
        console.re.log(event.originalEvent.currentTarget.className)
            event.preventDefault();
    })
var source = SMap.Coords.fromWGS84(18.277, 49.858);
    //49.7953294N, 18.3249392E
var source2 = SMap.Coords.fromWGS84(18.325, 49.795);
var source3 = SMap.Coords.fromWGS84(18.2905, 49.715);
var source4 = SMap.Coords.fromWGS84(18.329, 49.788);
var source5 = SMap.Coords.fromWGS84(18.2372514, 49.8470731);
var source6 = SMap.Coords.fromWGS84(18.2522781, 49.8408575);
var mapa,vrstva,winddir,windspeed,znacky,selectorSlider,timedisplay;
var drawSourceMarker = function(coords,title,header,body,footer) {
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
var getForecastData = function (forecastHour) {
    if (!$.isEmptyObject(cacheddata)) {
        forecastRefDate=new Date(cacheddata.latestforecast)
        var dateDif = new Date()-forecastRefDate;
    }
    if (dateDif>(7*3600*1000) || $.isEmptyObject(cacheddata)) {
        jQuery.getJSON("data?lat=49.8313933&lon=18.2738400").then(function (data) {
            cacheddata=data;
            applyForecastData(data,forecastHour);
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
    //49.7153828N, 18.2905747E
    drawSource(source,3800,winddir,windspeed,15,"red");
    drawSource(source2,3800,winddir,windspeed,15,"red");
    drawSource(source4,3800,winddir,windspeed,15,"red");
    drawSource(source5,2000,winddir,windspeed,15,"orange");
    drawSource(source6,2000,winddir,windspeed,15,"orange");
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
		mapa.addDefaultLayer(SMap.DEF_BASE).enable();
		mapa.addDefaultControls();	     
        vrstva = new SMap.Layer.Canvas(0,0);
        znacky = new SMap.Layer.Marker();
        drawSourceMarker(source,"Koksovna Svoboda","<b>Koksovna Svoboda</b>","Provozovatel: OKK Koksovny, a. s.<br>\
        Kapacita: 840 tis. t. CKS/rok<br>\
        Benzo(a)pyren, benzen, PAU, PM10, PM2.5, As, HCN<br>\
        <a href=\"https://www.ceskatelevize.cz/ivysilani/1095913550-nedej-se/418235100161012-jedy-z-koksaren\">Dokument ČT Jedy z koksáren</a><br>\
        <a href=\"http://portal.chmi.cz/files/portal/docs/uoco/web_generator/plants/CZ080/713760061_CZ.html\">EMIS</a><br>\
        <a href=\"https://www.msk.cz/assets/temata/ippc/files/okk-koksovny---koksovna-svoboda.pdf\">Integrované povolení</a>","")

        drawSourceMarker(source2,"Koksovna Liberty Steel (KB1+2)","<b>Koksovna Liberty Ostrava (KB1+2)</b>","Provozovatel: Liberty Ostrava, a. s.<br>\
        Kapacita: 756 tis. t CKS/rok<br>\
        Benzo(a)pyren, benzen, PAU, PM10, PM2.5, As, HCN, zápach<br>\
        <a href=\"https://ct24.ceskatelevize.cz/domaci/2782736-ostrava-nebo-otrava-bydlite-v-radvanicich-no-tak-co-chcete-rekl-lekar-zene-s\">TV reportáž</a><br>\
        <a href=\"http://portal.chmi.cz/files/portal/docs/uoco/web_generator/plants/CZ080/714220261_CZ.html\">EMIS</a><br>\
        <a href=\"https://www.msk.cz/assets/temata/ippc/files/amo---zavod-10---koksovna.pdf\">Integrované povolení</a>","")

        drawSourceMarker(source4,"Koksovna Liberty Steel (VKB11)","<b>Koksovna Liberty Ostrava (VKB11)</b>","Provozovatel: Liberty Ostrava, a. s.<br>\
        Kapacita: 775 tis. t CKS/rok<br>\
        Benzo(a)pyren, benzen, PAU, PM10, PM2.5, As, HCN, zápach<br>\
        <a href=\"https://ct24.ceskatelevize.cz/domaci/2782736-ostrava-nebo-otrava-bydlite-v-radvanicich-no-tak-co-chcete-rekl-lekar-zene-s\">TV reportáž</a><br>\
        <a href=\"http://portal.chmi.cz/files/portal/docs/uoco/web_generator/plants/CZ080/714220261_CZ.html\">EMIS</a><br>\
        <a href=\"https://www.msk.cz/assets/temata/ippc/files/amo---zavod-10---koksovna.pdf\">Integrované povolení</a>","")

        drawSourceMarker(source5,"BC-MCHZ - výroba velkoobjemových chemikálií","<b>BC-MCHZ - výroba velkoobjemových chemikálií</b>","Provozovatel: BorsodChem MCHZ‚ s.r.o.<br>\
        Kapacita: 165 tis. t anilinu/rok<br>\
        Benzen, VOC, NO<sub>x</sub>, TZL, NH<sub>3</sub>, zápach<br>\
        <a href=\"https://mrak.pirati.cz/s/z43AT4swp8goLFi\">Zpráva ČHMÚ o zdrojích benzenu v Ostravě</a><br>\
        <a href=\"http://portal.chmi.cz/files/portal/docs/uoco/web_generator/plants/CZ080/713830731_CZ.html\">EMIS</a><br>\
        <a href=\"https://www.msk.cz/assets/temata/ippc/files/borsodchem---zarizeni-na-vyrobu-velkoobjemovych-chem.pdf\">Integrované povolení</a>","")

        drawSourceMarker(source6,"Laguny Ostramo","<b>Laguny Ostramo</b>","\
        VOC, benzen<br>\
        <a href=\"https://mrak.pirati.cz/s/z43AT4swp8goLFi\">Zpráva ČHMÚ o zdrojích benzenu v Ostravě</a><br>\
        <a href=\"https://www.msk.cz/assets/temata/ippc/files/ave-cz---napravna-opatreni-_-laguny-ostramo.pdf\">Integrované povolení</a>","")
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
    
    
    console.re.log("resize logged w="+window.innerWidth+" h="+window.innerHeight)
})
$(window).resize();
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
    loadContent($(e.delegateTarget).data("content"))
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
          if ((forecastDate.getTime()-todayStart.getTime()<0)) {
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
                    winddir=data.direction[currentForecastHour]
                    windspeed=data.speed[currentForecastHour]
                    selectorSlider.val(currentForecastHour);
                    forecastHour=currentForecastHour;
                }
                winddir=data.direction[forecastHour]
                windspeed=data.speed[forecastHour]
                selectorSlider.attr("max",data.speed.length-1)
                var forecastDate=new Date(forecastRefDate);
                forecastDate.setHours(forecastRefDate.getHours()+forecastHour)
		        var daystr=getDayStr(forecastDate);
		        timedisplay.html(daystr+"<br> "+forecastDate.getHours()+ ":00");
                vrstva.redraw()
        }
     
        
}