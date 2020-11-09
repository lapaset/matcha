import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, useLoadScript } from '@react-google-maps/api';
import {api} from '../../secret.json';
import usePlacesAutocomplete, { getGeocode, getLatLng, } from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption} from "@reach/combobox"
import "@reach/combobox/styles.css";
import userService from '../../services/userService'

const containerStyle = {
	width: '400px',
	height: '400px'
};

const MyProfileMap = ({lat, lng, setLat, setLon}) => {
	const [mapCentre, setMapCentre] = useState({lat: 0, lng: 0});

	var coords = JSON.parse(window.localStorage.getItem('loggedMatchaUser'));
	console.log("Start This is from loggedmatchuser")
	console.log(coords.latitude);
	console.log("End This is from loggedmatchuser")


	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		setMapCentre({lat: coords.latitude, lng: coords.longitude});
	}, [lat, lng]);

	const dragEndHandler = (event) => {
		//setLat(event.latLng.lat());
		//setLon(event.latLng.lng());
		const lati = event.latLng.lat();
		const lngi = event.latLng.lng();
		const user_id = 1;
		console.log(lati)
		console.log(lngi);
		userService
		.updateMap({lati, lngi, user_id})
		.then(data => {
			console.log("coords updated in the database")
		})
		.catch(e => {
			//console.log('error', e.response.data)
			console.log("coords could not be updated")
		})
	};

	return (
	<div>
		<form className="text-left mt-3 col-md-6 col-sm-6 col-lg-4 col-xs-8">
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
						onDragEnd={event => dragEndHandler(event)}
					/>
				</GoogleMap>
			</LoadScript>
		</form>
	</div>
	)
};
/*
function Search(){
	const {ready, value, suggestions: { status, data }, setValue, clearSuggestions} = usePlacesAutocomplete({
		requestOptions: {
			location: {latitude: () => 60.1718784, longitude: () => 24.959385599999997 },
			radius: 100 * 1000
		}
	})
	return (
	<div>
		<Combobox onSelect= {(address) => {
			console.log(address);
		}}>
			<ComboboxInput 
			value={value} 
			onChange={(e) => {
				setValue(e.target.value);
			}}
			disabled={ready}
			placeholder="Enter an address"
			/>
			<ComboboxPopover>
				{status === "OK" &&
				data.map(({ id, description }) => (
					<ComboboxOption key={id} value={description} />
				))}
			</ComboboxPopover>
		</Combobox>
	</div>
	)
}
*/
export default MyProfileMap;