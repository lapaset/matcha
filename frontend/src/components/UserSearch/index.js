import React, { useState, useEffect } from 'react'
import { useFilter } from '../../hooks/index'
import ListOfUsers from './ListOfUsers'
import SortForm from './SortForm'
import FilterForm from './FilterForm'
import blockService from '../../services/blockService'

const UserSearch = ({ user }) => {

	const [resultsToShow, setResultsToShow] = useState([])

	const maxDistance = useFilter('matchaMaxDistance', 100, 'number')
	const minAge = useFilter('matchaMinAge', 20, 'number')
	const maxAge = useFilter('matchaMaxAge', 120, 'number')
	const minFame = useFilter('matchaMinFame', 100, 'number')
	const requiredTag = useFilter('matchaRequiredTag', '', 'text')

	const sortFormProps = ({ user, resultsToShow, setResultsToShow })
	const filterFormProps = ({ user, requiredTag, maxDistance, minFame, minAge, maxAge })

	const requiredTagFound = tags => tags && requiredTag.value
		? tags.split('#').includes(requiredTag.value)
		: true

	const filterResults = () => resultsToShow
		? resultsToShow
			.filter(r => r.distance <= maxDistance.value &&
				r.age.years >= minAge.value && r.age.years <= maxAge.value
				&& r.fame >= minFame.value && requiredTagFound(r.tags))
		: []

	const [unblockedUser, setUnblockedUser] = useState([]);
	useEffect(() => {
		var coords = JSON.parse(window.localStorage.getItem('loggedMatchaUser'));
		var from_user_id = coords.user_id;

		var res = filterResults();
		//console.log(res);
		setUnblockedUser([]);
		res.map((r) => {
			var to_user_id = r.user_id;
			blockService.blockedUser({ from_user_id, to_user_id })
			.then(res => {
                //If this row exist in the table it returns 1 otherwise 0
                if (res.value === 0)
                {
                    setUnblockedUser((prevState) => [...prevState, r])
                }
            })
            .catch(e => {
                console.log(("Error: couldn't get block info"))
            })
		})
	}, [])
	//console.log(unblockedUser)
	return <>

		<SortForm {...sortFormProps} />

		<FilterForm {...filterFormProps} />

		<ListOfUsers users={unblockedUser} />

	</>
}

export default UserSearch