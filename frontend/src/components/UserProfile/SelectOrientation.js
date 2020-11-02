import React from 'react'
import Select from 'react-select'
import { Controller } from 'react-hook-form'

const SelectOrientation = ({ orientation, control, errors }) => {

	const orientationFromDb = () => {
		const o = []

		if (!orientation)
			return o
		if (orientation.includes('f'))
			o.push({ value: 'female', label: 'female' })
		if (orientation.includes('m'))
			o.push({ value: 'male', label: 'male' })
		if (orientation.includes('o'))
			o.push({ value: 'other', label: 'other' })
		return o
	}

	const options = [
		{ value: 'female', label: 'female' },
		{ value: 'male', label: 'male' },
		{ value: 'other', label: 'other' }
	]

	const defVal = () => orientation ? orientationFromDb() : ""

	return 	<div className="form-group">
				<label>looking for</label>
				{errors.orientation && errors.orientation.type === 'required' && (<span className="text-danger"> *</span>)}<br />

				<Controller
					class="form-control"
					name="orientation"
					as={Select}
					options={options}
					value={orientationFromDb()}
					defaultValue={defVal()}
					control={control}
					rules={{ required: true }}
					isMulti />
			</div>
}

export default SelectOrientation
