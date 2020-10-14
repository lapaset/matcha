import React from 'react'

const InputField = ({ label, field, current }) => (
	<div>
		<label>{label}: {current}</label><br />
		<input className="form-control" {...field} />
	</div>
)

export default InputField