import flask
from flask import jsonify,request,render_template
from src import weatherDAO 
application = flask.Flask(__name__)
application.config["DEBUG"] = False
dbget = weatherDAO.Dbget()

@application.route('/data', methods=['GET'])
def data():
    lat=0
    lon=0
    if request.args.has_key('lat'): 
        lat = request.args.get('lat')
    if request.args.has_key('lon'): 
        lon = request.args.get('lon')
    resp = flask.make_response(jsonify(dbget.getWeatherData(lat,lon)))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp
@application.route('/pollution', methods=['GET'])
def pollution():
    station=0
    pollutant=0
    if request.args.has_key('station'): 
        station = request.args.get('station')
    if request.args.has_key('pollutant'): 
        pollutant = request.args.get('pollutant')
    resp = flask.make_response(jsonify(dbget.getIskoData(station,pollutant)))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@application.route('/pollution_map', methods=['GET'])
def pollutionmap():
    station=0
    pollutant=0
    if request.args.has_key('pollutant'): 
        pollutant = request.args.get('pollutant')
    resp = flask.make_response(jsonify(dbget.getIskoMapData2(pollutant)))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp
@application.route('/',methods=['GET'])
def home():
    return render_template('/index.html')
if __name__ == '__main__':
    application.run(host='0.0.0.0')
