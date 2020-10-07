import React from 'react'
import Select from 'react-select'

const SelectOrientation = ({ setOrientation, orientation }) => {

	const onChange = options => setOrientation(options)

	const options = [
		{ value: 'female', label: 'female' },
		{ value: 'male', label: 'male' },
		{ value: 'other', label: 'other' }
	]

	return 	<div>
				looking for
				<Select options={options} value={orientation} onChange={onChange} isMulti />
			</div>
}

export default SelectOrientation