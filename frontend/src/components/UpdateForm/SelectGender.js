import React from 'react'
import Select from 'react-select'

const SelectGender = ({ setGender, gender }) => {

	const onChange = option => setGender(option)

	const options = [
		{ value: 'female', label: 'female' },
		{ value: 'male', label: 'male' },
		{ value: 'other', label: 'other' }
	]

	return 	<div>
				gender
				<Select options={options} value={gender} onChange={onChange} />
			</div>
}

export default SelectGender