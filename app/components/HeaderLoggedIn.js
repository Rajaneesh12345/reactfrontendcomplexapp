const React = require('react')
const { useEffect, useContext } = require('react')
const { Link } = require('react-router-dom')

const DispatchContext = require('../DispatchContext')
const StateContext = require('../StateContext')

function HeaderLoggedIn(props) {
	const appDispatch = useContext(DispatchContext)
	const appState = useContext(StateContext)

	function handleSearchIcon(e) {
		e.preventDefault()
		appDispatch({ type: 'openSearch' })
	}

	function handleLogOut() {
		appDispatch({ type: 'logout' })
		appDispatch({
			type: 'flashMessage',
			value: {
				message: 'You have successfully logged out.',
				color: 'success'
			}
		})
	}
	return (
		<div className="flex-row my-3 my-md-0">
			<a
				onClick={handleSearchIcon}
				href="#"
				className="text-white mr-2 header-search-icon"
			>
				<i className="fas fa-search"></i>
			</a>
			<span
				onClick={e => appDispatch({ type: 'toggleChat' })}
				className={
					'mr-2 header-chat-icon ' +
					(appState.unreadChatCount ? 'text-danger' : 'text-white')
				}
			>
				<i className="fas fa-comment"></i>
				{appState.unreadChatCount ? (
					<span className="chat-count-badge text-white">
						{' '}
						{appState.unreadChatCount < 10
							? appState.unreadChatCount
							: '9+'}
					</span>
				) : (
					''
				)}
			</span>
			<Link to={`/profile/${appState.user.username}`} className="mr-2">
				<img className="small-header-avatar" src={appState.user.avatar} />
			</Link>
			<Link className="btn btn-sm btn-success mr-2" to="/create-post">
				Create Post
			</Link>
			<button onClick={handleLogOut} className="btn btn-sm btn-secondary">
				Sign Out
			</button>
		</div>
	)
}

module.exports = HeaderLoggedIn
