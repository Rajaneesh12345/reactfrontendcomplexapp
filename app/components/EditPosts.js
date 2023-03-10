const React = require('react')
const { useEffect, useState, useContext } = require('react')
const Page = require('./Page')
const { useParams, useNavigate, Link } = require('react-router-dom')
const Axios = require('axios')

const NotFound = require('./NotFound')

const StateContext = require('../StateContext')
const DispatchContext = require('../DispatchContext')

const LoadingDotsIcon = require('./LoadingDotsIcon')
const { useImmerReducer } = require('use-immer')

function EditPost() {
	const originalState = {
		title: { value: '', hasErrors: false, message: '' },
		body: { value: '', hasErrors: false, message: '' },
		isFetching: true,
		isSaving: false,
		id: useParams().id,
		sendCount: 0,
		notFound: false
	}

	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)

	const navigate = useNavigate()

	function ourReducer(draft, action) {
		switch (action.type) {
			case 'fetchComplete':
				draft.title.value = action.value.title
				draft.body.value = action.value.body
				draft.isFetching = false
				return
			case 'titleChange':
				draft.title.value = action.value
				return
			case 'bodyChange':
				draft.body.value = action.value
				return
			case 'submitRequest':
				if (!draft.title.hasErrors && !draft.body.hasErrors) {
					draft.sendCount++
				}
				return
			case 'saveRequestStarted':
				draft.isSaving = true
				return
			case 'saveRequestFinished':
				draft.isSaving = false
				return
			case 'titleRules':
				if (!action.value.trim()) {
					draft.title.hasErrors = true
					draft.title.message = 'You must provide a title.'
				} else {
					draft.title.hasErrors = false
					draft.title.message = ''
				}
				return
			case 'bodyRules':
				if (!action.value.trim()) {
					draft.body.hasErrors = true
					draft.body.message = 'You must provide a body content.'
				} else {
					draft.body.hasErrors = false
					draft.body.message = ''
				}
				return
			case 'notFound':
				draft.notFound = true
		}
	}

	const [state, dispatch] = useImmerReducer(ourReducer, originalState)

	// this is getting called each time the page loads for the first time
	useEffect(() => {
		const ourRequest = Axios.CancelToken.source()

		async function fetchPost() {
			try {
				const response = await Axios.get(
					`https://backendapi-n3y9.onrender.com/post/${state.id}`,
					{
						cancelToken: ourRequest.token
					}
				)
				if (response.data) {
					dispatch({ type: 'fetchComplete', value: response.data })
					if (appState.user.username !== response.data.author.username) {
						appDispatch({
							type: 'flashMessage',
							value: {
								message:
									'You do not have permission to edit that post.',
								color: 'danger'
							}
						})
						navigate('/')
					}
				} else {
					dispatch({ type: 'notFound' })
				}
			} catch (e) {
				console.log(e)
			}
		}
		fetchPost()
		return () => {
			ourRequest.cancel()
		}
	}, [])

	useEffect(() => {
		if (state.sendCount) {
			const ourRequest = Axios.CancelToken.source()

			async function fetchPost() {
				try {
					const response = await Axios.post(
						`https://backendapi-n3y9.onrender.com/post/${state.id}/edit`,
						{
							title: state.title.value,
							body: state.body.value,
							token: appState.user.token
						},
						{
							cancelToken: ourRequest.token
						}
					)
					dispatch({ type: 'saveRequestFinished', value: response.data })
					appDispatch({
						type: 'flashMessage',
						value: {
							message: 'Post was successfully updated.',
							color: 'success'
						}
					})
					navigate(`/post/${state.id}`)
				} catch (e) {
					console.log(e)
				}
			}
			fetchPost()
			return () => {
				ourRequest.cancel()
			}
		}
	}, [state.sendCount])

	if (state.notFound) {
		return <NotFound />
	}

	if (state.isFetching) {
		return (
			<Page title="...">
				<LoadingDotsIcon />
			</Page>
		)
	}

	function handleSubmit(e) {
		e.preventDefault()
		dispatch({ type: 'titleRules', value: state.title.value })
		dispatch({ type: 'bodyChanges', value: state.body.value })

		dispatch({ type: 'submitRequest' })
	}

	return (
		<Page title="Edit post">
			<Link className="small font-weight-bold" to={`/post/${state.id}`}>
				&laquo; Back to post permalink
			</Link>
			<form className="mt-3" onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="post-title" className="text-muted mb-1">
						<small>Title</small>
					</label>
					<input
						value={state.title.value}
						onChange={e =>
							dispatch({ type: 'titleChange', value: e.target.value })
						}
						onBlur={e =>
							dispatch({ type: 'titleRules', value: e.target.value })
						}
						autoFocus
						name="title"
						id="post-title"
						className="form-control form-control-lg form-control-title"
						type="text"
						placeholder=""
						autoComplete="off"
					/>
					{state.title.hasErrors && (
						<div className="alert alert-danger small liveValidateMessage">
							{state.title.message}
						</div>
					)}
				</div>

				<div className="form-group">
					<label htmlFor="post-body" className="text-muted mb-1 d-block">
						<small>Body Content</small>
					</label>
					<textarea
						name="body"
						id="post-body"
						className="body-content tall-textarea form-control"
						type="text"
						value={state.body.value}
						onChange={e =>
							dispatch({ type: 'bodyChange', value: e.target.value })
						}
						onBlur={e =>
							dispatch({ type: 'bodyRules', value: e.target.value })
						}
					/>
					{state.body.hasErrors && (
						<div className="alert alert-danger small liveValidateMessage">
							{state.body.message}
						</div>
					)}
				</div>

				<button className="btn btn-primary" disabled={state.isSaving}>
					Save Updates
				</button>
			</form>
		</Page>
	)
}

module.exports = EditPost
