import React, { useState } from 'react'
import CreatableSelect from 'react-select'
import tagService from '../../services/tags'

const SelectTags = ({ setUserTags, userTags, tags, setTags }) => {

	const [inputValue, setInputValue] = useState('')

	const addNewTag = () => {

		const newTag = inputValue.startsWith('#')
			? inputValue
			: '#' + inputValue

		tagService
			.addTag({ tag: newTag })
			.then(res => {
				setUserTags(userTags.concat({
					value: res,
					label: res
				}))
				setTags(tags.concat({ tag: res }))
				setInputValue('')
			})
			.catch((e) => {
				console.log('Failed to add tag', e.response.data)
			})
	}

	const handleChange = options => setUserTags(options)

	const handleInputChange = value => setInputValue(value)

	const handleKeyDown = event => {

		//todo: can enter pick the tag if it already exists
		// and should it close after enter
		if (!inputValue) return
		switch (event.key) {
			case 'Enter':
			case 'Tab':
				event.preventDefault()
				addNewTag()
				break
			default:
				return
		}
	}

	const getOptions = () => tags.map(t => {
		return { value: t.tag, label: t.tag }
	})

	//console.log('user tags:', userTags)
	//console.log('tags:', tags)

	return tags
		? <div>
			tags
			<CreatableSelect
				options={getOptions()}
				value={userTags}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				onInputChange={handleInputChange}
				inputValue={inputValue}
				isMulti
				isClearable />
		</div>
		: null
}

export default SelectTags