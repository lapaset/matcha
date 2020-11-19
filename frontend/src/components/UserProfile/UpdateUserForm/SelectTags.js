import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import CreatableSelect from 'react-select'
import tagService from '../../../services/tagService'

const SelectTags = ({ state, setState }) => {

	const [options, setOptions] = useState([])

	const handleChange = value => {
		setState({ value })
	}

	const handleInputChange = (inputValue) => {
		setState({ inputValue, value })
	}

	const createOption = label => ({ label, value: label })

	const handleKeyDown = (event) => {
		const { inputValue, value } = state;

		if (!inputValue) return;
		switch (event.key) {
			case 'Enter':
			case 'Tab':
				event.preventDefault();

				const newTag = inputValue.startsWith('#')
					? inputValue
					: '#' + inputValue

				if (value.find(o => o.label === newTag) !== undefined) {
					setState({
						inputValue: '',
						value
					})
					return
				}
				else if (options.find(o => o.label === newTag) !== undefined) {

					setState({
						inputValue: '',
						value: [...value, createOption(newTag)]
					})

					setOptions(options.filter(o => o.label !== newTag))
					return
				}

				tagService
					.addTag({ tag: newTag })
					.then(() => {

						setState({
							inputValue: '',
							value: [...value, createOption(newTag)]
						})

						setOptions(options.concat(createOption(newTag)))

					})
					.catch((e) => {
						console.log('Failed to add tag', e.response.data)
					})
				break
			default:
				return
		}
	}

	useEffect(() => {
		tagService
			.getTags()
			.then(data => {
				setOptions(data.map(t => createOption(t.tag)))
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])

	const { value } = state

	return <Form.Group className="text-left">
		<Form.Label>tags</Form.Label>
		<CreatableSelect
			inputValue={state.inputValue}
			isClearable
			isMulti
			onChange={handleChange}
			onInputChange={handleInputChange}
			onKeyDown={handleKeyDown}
			value={value}
			options={options}
			name="tags"
		/>
	</Form.Group>
}

export default SelectTags