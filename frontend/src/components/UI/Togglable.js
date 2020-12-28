import React, { useState } from 'react'

const Togglable = (props) => {
	const [visible, setVisible] = useState(false)

	const showWhenVisible = { display: visible ? '' : 'none' }

	return <>
		<div className='mb-3 mt-3'>
			{props.title && <span className='float-left font-weight-bold'>{props.title}</span>}

			<span className='float-right text-info text-right' onClick={() => setVisible(!visible)}>
				{visible ? 'hide' : 'show'}
			</span><br/>
		</div>
		<div style={showWhenVisible}>
			{props.children}
		</div>
	</>
}

export default Togglable