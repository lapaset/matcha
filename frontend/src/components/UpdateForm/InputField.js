import React from 'react'

const InputField = ({ label, field, current }) => (
	<div>
		<label>{label}: {current}</label><br />
		<input id={label} {...field} />
	</div>
)

export default InputField