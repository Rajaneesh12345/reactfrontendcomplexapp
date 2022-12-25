const React = require('react')
const { Tooltip: ReactTooltip } = require('react-tooltip')

const { useEffect, useState, useContext } = require('react')
const Page = require('./Page')
const { useParams, Link, useNavigate } = require('react-router-dom')
const Axios = require('axios')
const NotFound = require('./NotFound')
const StateContext = require('../StateContext')
const DispatchContext = require('../DispatchContext')

const LoadingDotsIcon = require('./LoadingDotsIcon')

function ViewSinglePost() {
	const [isLoading, setIsLoading] = useState(true)
	const [post, setPost] = useState()
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	const { id } = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source()

		async function fetchPost() {
			try {
				const response = await Axios.get(
					`https://backendapi-n3y9.onrender.com/post/${id}`,
					{
						cancelToken: ourRequest.token
					}
				)
				setPost(response.data)
				setIsLoading(false)
			} catch (e) {
				console.log(e)
			}
		}
		fetchPost()
		return () => {
			ourRequest.cancel()
		}
	}, [id])

	if (!isLoading && !post) {
		return <NotFound />
	}

	if (isLoading) {
		return (
			<Page title="...">
				<LoadingDotsIcon />
			</Page>
		)
	}

	const date = new Date(post.createdDate)
	const dateFormatted = `${date.getDate()}/${
		date.getMonth() + 1
	}/${date.getFullYear()}`

	function isOwner() {
		if (appState.loggedIn) {
			return appState.user.username === post.author.username
		}
		return false
	}

	async function handleDelete() {
		const sure = window.confirm('Are you really sure bro??')
		// console.log(sure)
		if (sure) {
			try {
				const response = await Axios.delete(
					`https://backendapi-n3y9.onrender.com/post/${id}`,
					{
						data: { token: appState.user.token }
					}
				)
				// console.log(response.data)
				if (response.data == 'Success') {
					appDispatch({
						type: 'flashMessage',
						value: 'Post was successfully deleted.'
					})
					navigate(`/profile/${appState.user.username}`)
				}
			} catch (e) {
				console.log(e)
			}
		}
	}

	return (
		<Page title={post.title}>
			<div className="d-flex justify-content-between">
				<h2>{post.title}</h2>
				{isOwner() && (
					<span className="pt-2">
						<Link
							to={`/post/${post._id}/edit`}
							className="text-primary mr-2"
							data-tip="Edit"
							id="edit"
							title="Edit"
						>
							<i className="fas fa-edit"></i>
						</Link>
						<ReactTooltip anchorId="edit" className="custom-tooltip" />{' '}
						<Link
							onClick={handleDelete}
							data-tip-content="Delete"
							id="delete"
							className="delete-post-button text-danger"
							title="Delete"
						>
							<i className="fas fa-trash"></i>
						</Link>
						<ReactTooltip anchorId="delete" className="custom-tooltip" />
					</span>
				)}
			</div>

			<p className="text-muted small mb-4">
				<Link to={`/profile/${post.author.username}`}>
					<img className="avatar-tiny" src={post.author.avatar} />
				</Link>
				Posted by{' '}
				<Link to={`/profile/${post.author.username}`}>
					{post.author.username}
				</Link>{' '}
				on {dateFormatted}
			</p>

			<div className="body-content">{post.body}</div>
		</Page>
	)
}

module.exports = ViewSinglePost
