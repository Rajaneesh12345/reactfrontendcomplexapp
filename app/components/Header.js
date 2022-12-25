const React = require('react')
const { Link } = require('react-router-dom')
const { useState, useContext } = require('react')

const StateContext = require('../StateContext')

const HeaderLoggedOut = require('./HeaderLoggedOut')
const HeaderLoggedIn = require('./HeaderLoggedIn')

const Header = props => {
	const appState = useContext(StateContext)
	// const { addFlashMessage, setLoggedIn } = useContext(ExampleContext)
	return (
		<header className="header-bar bg-primary mb-3">
			<div className="container d-flex flex-column flex-md-row align-items-center p-3">
				<h4 className="my-0 mr-md-auto font-weight-normal">
					<Link to="/" className="text-white">
						{' '}
						ComplexApp{' '}
					</Link>
				</h4>
				{appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
			</div>
		</header>
	)
}

module.exports = Header
