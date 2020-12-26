const geoIP = require('geoip-lite');
const axios = require('axios');

const validateCoordinate = coordinate => {
	const coordFloat = coordinate;
	return !isNaN(coordFloat) && coordFloat >= -180 && coordFloat <= 180;
}

const getLoginCoordinates = async (req, userData) => {
	// Check if valid coordinates are provided through browser geolocation and just return them
	if (validateCoordinate(req.body.latitude) && validateCoordinate(req.body.longitude))
		return {'latitude': req.body.latitude, 'longitude': req.body.longitude};

	const lookup = geoIP.lookup(req.ip);

	// Couldn't geolocate IP, falling back to previous location data
	
	if (!lookup || !lookup.ll)
	{
		var location = await axios.get('https://ipinfo.io/geo')
		var locs = location.data.loc.split(',');

		return { latitude: locs[0], longitude: locs[1] }
	}

	// Return data from successful lookup
	return {'latitude': lookup.ll[0], 'longitude': lookup.ll[1]};
};

module.exports = {
	validateCoordinate,
	getLoginCoordinates
}
