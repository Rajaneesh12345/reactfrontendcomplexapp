const React = require('react')
const { useEffect } = require('react')
const { useImmer } = require('use-immer')
const { Link } = require('react-router-dom')
const Page = require('./Page')
const StateContext = require('../StateContext')

const LoadingDotsIcon = require('./LoadingDotsIcon')
const Post = require('./Post')

const Axios = require('axios')

function Home() {
	const appState = React.useContext(StateContext)
	const [state, setState] = useImmer({
		isLoading: true,
		feed: []
	})

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source()
		async function fetchData() {
			try {
				const response = await Axios.post(
					`https://backendapi-n3y9.onrender.com/getHomeFeed`,
					{
						token: appState.user.token
					}
				)
				setState(draft => {
					draft.isLoading = false
					draft.feed = response.data
				})
			} catch (e) {
				console.log(e)
			}
		}

		fetchData()
		return () => ourRequest.cancel()
	}, [])

	if (state.isLoading) {
		return <LoadingDotsIcon />
	}

	return (
		<Page title="Your Feed">
			{state.feed.length > 0 && (
				<>
					<h2 className="test-center mb-4">
						The Latest from those you follow{' '}
					</h2>
					<div className="list-group">
						{state.feed.map(post => {
							return <Post post={post} key={post._id} />
						})}
					</div>
				</>
			)}
			{state.feed.length === 0 && (
				<>
					<h2 className="text-center">
						Hello <strong>{appState.user.username}</strong>, your feed is
						empty.
					</h2>
					<p className="lead text-muted text-center">
						Your feed displays the latest posts from the people you
						follow. If you don&rsquo;t have any friends to follow
						that&rsquo;s okay; you can use the &ldquo;Search&rdquo;
						feature in the top menu bar to find content written by people
						with similar interests and then follow them.
					</p>
				</>
			)}
		</Page>
	)
}

module.exports = Home
