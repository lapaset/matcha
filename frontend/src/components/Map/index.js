import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {api} from '../../secret.json';

const containerStyle = {
	width: '400px',
	height: '400px'
};

const MyProfileMap = () => {
	const [mapCentre, setMapCentre] = useState({lat: 0, lng: 0});
	var coords = JSON.parse(window.localStorage.getItem('loggedMatchaUser'));
	console.log("Start This is from loggedmatchuser")
	console.log(coords.latitude);
	console.log("End This is from loggedmatchuser")


	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		setMapCentre({lat: coords.latitude, lng: coords.longitude});
	}, []);


	return (
		<LoadScript
			googleMapsApiKey={api}
		>
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={mapCentre}
				zoom={6}
			>
				<Marker
					draggable={true}
					position={mapCentre}
				/>
			</GoogleMap>
		</LoadScript>
	)
};

export default MyProfileMap;