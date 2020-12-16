import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {api} from '../../../secret.json';
import mapService from '../../../services/mapService'

const containerStyle = {
	width: '90vw',
	height: '90vw',
	maxWidth: '400px',
	maxHeight: '400px',
	margin: '2em auto'
};

const MyProfileMap = () => {
	const [mapCentre, setMapCentre] = useState({lat: 0, lng: 0});
	var coords = JSON.parse(window.localStorage.getItem('loggedMatchaUser'));
	//console.log(coords.latitude);

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		setMapCentre({lat: coords.latitude, lng: coords.longitude});
	}, []);

	const dragEndHandler= (e) => {
		const latitude = e.latLng.lat();
		const longitude = e.latLng.lng();
		const user_id = coords.user_id;
		const userObject = {
			latitude,
			longitude,
			user_id
		}

		mapService.updateMap(userObject)
		.then(res => {
			console.log(res);
		})
	}

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
					onDragEnd= {event => dragEndHandler(event)}
				/>
			</GoogleMap>
		</LoadScript>
	)
};

export default MyProfileMap;