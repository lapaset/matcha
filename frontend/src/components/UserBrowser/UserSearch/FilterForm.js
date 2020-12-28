import React from 'react'
import { Form, Col } from 'react-bootstrap'
import Togglable from '../../UI/Togglable'

const FilterForm = ({ user, requiredTag, maxDistance, minFame, minAge, maxAge }) => (
	<Togglable showText='show filters' hideText='hide filters'>
		<Form className='mb-3'>
			{user.tags
				? <Form.Group>
					<Form.Label htmlFor=''>Tag</Form.Label>
					<Form.Control as="select" {...requiredTag} >
						{user.tags
							.split('#')
							.map(t => <option key={t} value={t}>{t}</option>)}
					</Form.Control>
				</Form.Group>
				: null
			}

			<Form.Row>
				<Col>
					<Form.Group>
						<Form.Label htmlFor='max-distance-field'>Max distance</Form.Label>
						<Form.Control id='max-distance-field' {...maxDistance} />
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label htmlFor='min-fame-field'>Min fame</Form.Label>
						<Form.Control id='min-fame-field' {...minFame} />
					</Form.Group>
				</Col>
			</Form.Row>

			<Form.Row>
				<Col>
					<Form.Group>
						<Form.Label htmlFor='min-age-field'>Min age</Form.Label>
						<Form.Control id='min-age-field' {...minAge} />
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label htmlFor='max-age-field'>Max age</Form.Label>
						<Form.Control id='max-age-field' {...maxAge} />
					</Form.Group>
				</Col>
			</Form.Row>
		</Form >
	</Togglable >
)

export default FilterForm