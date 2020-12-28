import React from 'react'
import { Form, Col } from 'react-bootstrap'
import Togglable from '../../UI/Togglable'

const FilterForm = ({ user, requiredTag, maxDistance, minFame, minAge, maxAge }) => (
	<Togglable showText='show filters' hideText='hide filters'>
		<Form className='mb-3'>
			{user.tags
				? <Form.Group>
					<Form.Label>Tag</Form.Label>
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
						<Form.Label>Max distance</Form.Label>
						<Form.Control {...maxDistance} />
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label>Min fame</Form.Label>
						<Form.Control {...minFame} />
					</Form.Group>
				</Col>
			</Form.Row>

			<Form.Row>
				<Col>
					<Form.Group>
						<Form.Label>Min age</Form.Label>
						<Form.Control {...minAge} />
					</Form.Group>
				</Col>
				<Col>
					<Form.Group>
						<Form.Label>Max age</Form.Label>
						<Form.Control {...maxAge} />
					</Form.Group>
				</Col>
			</Form.Row>
		</Form >
	</Togglable >
)

export default FilterForm