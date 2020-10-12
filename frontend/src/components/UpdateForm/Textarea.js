import React from 'react'

const Textarea = ({ value, setValue, label, name }) => 
	<div>
		<label>{label}</label><br />
		<textarea name={name} value={value} onChange={ e => setValue(e.target.value) } />
	</div>

export default Textarea