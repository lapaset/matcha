import React from 'react'

const InputField = ({ label, field, current }) => (
	<div>
		<label>{label}: {current}</label><br />
		<input {...field} />
	</div>
)

export default InputField