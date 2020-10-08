import React, { useState } from 'react'
import CreatableSelect from 'react-select'

const SelectTags = ({ setUserTags, userTags, tags, setTags }) => {

	const [inputValue, setInputValue] = useState('')

	const addNewTag = () => {

		const newTag = inputValue.startsWith('#')
			? inputValue
			: '#' + inputValue

		fetch(`http://localhost:3001/tags`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ tag: newTag }),
		})
			.then(res => {
				if (!res.ok) {
					console.log(res)
					throw Error(res.statusText)
				}
				setUserTags(userTags.concat({
					value: newTag,
					label: newTag
				}))
				setTags(tags.concat({ tag: newTag }))
				setInputValue('')

			})
			.catch((e) => {
				console.log('Failed to add tag', e)
			})
	}

	const handleChange = options => setUserTags(options)

	const handleInputChange = value => setInputValue(value)

	const handleKeyDown = event => {
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