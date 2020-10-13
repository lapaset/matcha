import React from 'react'

const Textarea = ({ value, setValue, label, name }) => (
	<div>
		<label>{label}</label><br />
		<textarea name={name} value={value} onChange={ e => setValue(e.target.value) } maxLength="1000" />
	</div>
)
export default Textarea