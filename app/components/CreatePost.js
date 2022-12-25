const React = require('react')
const { useState, useContext } = require('react')
// useContext allows us to use the context we created in app\ExampleContext.js

const { useNavigate } = require('react-router-dom')
const Page = require('./Page')
const Axios = require('axios')

const DispatchContext = require('../DispatchContext')
const StateContext = require('../StateContext')

function ComponentName(props) {
	const [title, setTitle] = useState()
	const [body, setBody] = useState()
	const navigate = useNavigate()
	const appDispatch = useContext(DispatchContext)
	const appState = useContext(StateContext)

	async function handleSubmit(e) {
		e.preventDefault()
		try {
			const response = await Axios.post('localhost:8080/create-post', {
				title,
				body,
				token: appState.user.token
			})
			appDispatch({
				type: 'flashMessage',
				value: 'Congrats, you successfully created a post.'
			})
			// addFlashMessage('Congrats, you successfully created a post.')
			navigate('/post/' + response.data)
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<Page title="Create new post">
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="post-title" className="text-muted mb-1">
						<small>Title</small>
					</label>
					<input
						onChange={e => setTitle(e.target.value)}
						autoFocus
						name="title"
						id="post-title"
						className="form-control form-control-lg form-control-title"
						type="text"
						placeholder=""
						autoComplete="off"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="post-body" className="text-muted mb-1 d-block">
						<small>Body Content</small>
					</label>
					<textarea
						onChange={e => setBody(e.target.value)}
						name="body"
						id="post-body"
						className="body-content tall-textarea form-control"
						type="text"
					></textarea>
				</div>

				<button className="btn btn-primary">Save New Post</button>
			</form>
		</Page>
	)
}

module.exports = ComponentName
