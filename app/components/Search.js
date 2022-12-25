const React = require('react')
const { useContext, useEffect } = require('react')
const { Link } = require('react-router-dom')
const { useImmer } = require('use-immer')
const Axios = require('axios')

const Post = require('./Post')

const DispatchContext = require('../DispatchContext')

function Search() {
	const [state, setState] = useImmer({
		// properties can be anything
		searchTerm: '',
		results: [],
		show: 'neither',
		requestCount: 0
	})

	const appDispatch = React.useContext(DispatchContext)

	useEffect(() => {
		document.addEventListener('keyup', searchKeyPressHandler)

		// to remove a listener, we need to return a function in useEffect
		return () => document.removeEventListener('keyup', searchKeyPressHandler)
	}, [])

	useEffect(() => {
		if (state.searchTerm.trim()) {
			setState(draft => {
				draft.show = 'loading'
			})
			const delay = setTimeout(() => {
				setState(draft => {
					draft.requestCount++
				})
			}, 700)
			return () => clearTimeout(delay)
		} else {
			setState(draft => {
				draft.show = 'neither'
			})
		}
	}, [state.searchTerm])

	useEffect(() => {
		if (state.requestCount) {
			const ourRequest = Axios.CancelToken.source() // to cancel the request
			async function fetchResults() {
				if (state.searchTerm !== '') {
					const response = await Axios.post(
						'https://backendapi-n3y9.onrender.com/search',
						{ searchTerm: state.searchTerm },
						{ cancelToken: ourRequest.token }
					)
					setState(draft => {
						draft.results = response.data // response.data is an array of posts
						draft.show = 'results'
					})
					// console.log(response.data)
				}
			}
			fetchResults()
			return () => ourRequest.cancel() // to cancel the request
		}
	}, [state.requestCount])

	function searchKeyPressHandler(e) {
		if (e.keyCode == 27) {
			appDispatch({ type: 'closeSearch' })
		}
	}

	function handleInput(e) {
		const value = e.target.value
		setState(draft => {
			draft.searchTerm = value
			// draft.show = 'loading'
			// draft.requestCount++
		})
	}

	return (
		<div className="search-overlay">
			<div className="search-overlay-top shadow-sm">
				<div className="container container--narrow">
					<label
						htmlFor="live-search-field"
						className="search-overlay-icon"
					>
						<i className="fas fa-search"></i>
					</label>
					<input
						onChange={handleInput}
						autoFocus
						type="text"
						autoComplete="off"
						id="live-search-field"
						className="live-search-field"
						placeholder="What are you interested in?"
					/>
					<span
						onClick={e => appDispatch({ type: 'closeSearch' })}
						className="close-live-search"
					>
						<i className="fas fa-times-circle"></i>
					</span>
				</div>
			</div>

			<div className="search-overlay-bottom">
				<div className="container container--narrow py-3">
					<div
						className={
							'circle-loader ' +
							(state.show === 'loading' ? 'circle-loader--visible' : '')
						}
					></div>
					<div
						className={
							'live-search-results ' +
							(state.show === 'results'
								? 'live-search-results--visible'
								: '')
						}
					>
						<div className="list-group shadow-sm">
							<div className="list-group-item active">
								<strong>Search Results</strong> ({state.results.length}{' '}
								items found)
							</div>
							{state.results.map(search => {
								return (
									<Post
										post={search}
										key={search._id}
										onClick={() =>
											appDispatch({ type: 'closeSearch' })
										}
									/>
								)
								// const date = new Date(a.createdDate)
								// const dateFormatted = `${date.getDate()}/${
								// 	date.getMonth() + 1
								// }/${date.getFullYear()}`
								// return (
								// 	<Link
								// 		onClick={() =>
								// 			appDispatch({ type: 'closeSearch' })
								// 		}
								// 		key={a._id}
								// 		to={`/post/${a._id}`}
								// 		className="list-group-item list-group-item-action"
								// 	>
								// 		<img
								// 			className="avatar-tiny"
								// 			src={a.author.avatar}
								// 		/>{' '}
								// 		<strong>{a.title}</strong>{' '}
								// 		<span className="text-muted small">
								// 			by {a.author.username} on {dateFormatted}
								// 		</span>
								// 	</Link>
								// )
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

module.exports = Search
