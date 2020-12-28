import React, { useState } from 'react'

const Togglable = (props) => {
	const [visible, setVisible] = useState(false)

	const showWhenVisible = { display: visible ? '' : 'none' }

	return <>
		<div className='pb-1 pt-1' onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>
			{props.title && <span className='float-left font-weight-bold'>{props.title}</span>}

			<span className='float-right text-primary text-right'>
				{visible ? props.hideText || 'hide' : props.showText || 'show'}
			</span><br/>
		</div>
		<div style={showWhenVisible}>
			{props.children}
		</div>
	</>
}

export default Togglable