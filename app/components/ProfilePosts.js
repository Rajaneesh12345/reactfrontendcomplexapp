const React = require('react')
const { useState, useEffect, useContext } = require('react')
const Axios = require('axios')
const { useParams, Link } = require('react-router-dom')

const LoadingDotsIcon = require('./LoadingDotsIcon')
const Post = require('./Post')

function ProfilePosts() {
	const [isLoading, setIsLoading] = useState(true)
	const [posts, setPosts] = useState([])
	// const appState = useContext(StateContext)
	const { username } = useParams()
	// console.log(username)
	useEffect(() => {
		async function fetchPosts() {
			try {
				const response = await Axios.get(
					`https://backendapi-n3y9.onrender.com/profile/${username}/posts`
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
			{posts.map(a => {
				return <Post noAuthor={true} post={a} key={a._id} />
			})}
		</div>
	)
}

module.exports = ProfilePosts
