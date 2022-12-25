const React = require('react')
const { useEffect, useState, useContext } = require('react')
const Axios = require('axios')

const DispatchContext = require('../DispatchContext')

function HeaderLoggedOut(props) {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const appDispatch = useContext(DispatchContext)

	async function handleSubmit(e) {
		e.preventDefault()
		try {
			const result = await Axios.post(
				'https://backendapi-n3y9.onrender.com/login',
				{
					username,
					password
				}
			)
			if (result.data) {
				appDispatch({ type: 'login', data: result.data })
				appDispatch({
					type: 'flashMessage',
					value: 'You have successfully logged in.'
				})
			} else {
				appDispatch({
					type: 'flashMessage',
					value: 'Incorrect username / password.'
				})
			}
		} catch (err) {
			console.log('There was a problem.', err)
		}
	}
	return (
		<>
			<form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
				<div className="row align-items-center">
					<div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
						<input
							onChange={e => {
								setUsername(e.target.value)
							}}
							name="username"
							className="form-control form-control-sm input-dark"
							type="text"
							placeholder="Username"
							autoComplete="off"
						/>
					</div>
					<div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
						<input
							onChange={e => {
								setPassword(e.target.value)
							}}
							name="password"
							className="form-control form-control-sm input-dark"
							type="password"
							placeholder="Password"
						/>
					</div>
					<div className="col-md-auto">
						<button className="btn btn-success btn-sm">Sign In</button>
					</div>
				</div>
			</form>
		</>
	)
}

module.exports = HeaderLoggedOut
