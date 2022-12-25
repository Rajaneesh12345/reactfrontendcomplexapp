const React = require('react')
const { useState, useEffect, useContext } = require('react')
const Axios = require('axios')
const { useParams, Link } = require('react-router-dom')

const LoadingDotsIcon = require('./LoadingDotsIcon')

function ProfileFollowing() {
	const [isLoading, setIsLoading] = useState(true)
	const [posts, setPosts] = useState([])
	// const appState = useContext(StateContext)
	const { username } = useParams()
	// console.log(username)
	useEffect(() => {
		async function fetchPosts() {
			try {
				const response = await Axios.get(
					`https://backendapi-n3y9.onrender.com/profile/${username}/following`
				)
				setIsLoading(false)
				setPosts(response.data)
				// console.log(response.data)
			} catch (e) {
				console.log(e)
			}
		}
		fetchPosts()
	}, [username])

	if (isLoading) {
		return <LoadingDotsIcon />
	}
	return (
		<div className="list-group">
			{posts.map((following, index) => {
				return (
					<Link
						key={index}
						to={`/post/${following.username}`}
						className="list-group-item list-group-item-action"
					>
						<img className="avatar-tiny" src={following.avatar} />
						{following.username}
					</Link>
				)
			})}
		</div>
	)
}

module.exports = ProfileFollowing
