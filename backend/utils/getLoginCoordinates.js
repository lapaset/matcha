const express = require('express');
var geoIP = require('geoip-lite');

const validateCoordinate = coordinate => {
	const coordFloat = parseFloat(coordinate);
	return !isNaN(coordFloat) && coordFloat >= -180 && coordFloat <= 180;
};

const getLoginCoordinates = (req, userData) => {
	// Check if valid coordinates are provided through browser geolocation and just return them
	if (validateCoordinate(req.body.latitude) && validateCoordinate(req.body.longitude))
		return {'latitude': parseFloat(req.body.latitude), 'longitude': parseFloat(req.body.longitude)};

	const lookup = geoIP.lookup(req.ip);

	// Couldn't geolocate IP, falling back to previous location data
	if (!lookup || !lookup.ll)
		if (userData.latitude === null || userData.longitude === null)
			return {'latitude': 0, 'longitude': 0};
		else
			return {'latitude': userData.latitude, 'longitude': userData.longitude};
	
	// Return data from successful lookup
	return {'latitude': lookup.ll[0], 'longitude': lookup.ll[1]};
};

module.exports = {
	validateCoordinate,
	getLoginCoordinates
}