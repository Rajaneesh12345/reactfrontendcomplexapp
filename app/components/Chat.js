const React = require('react')
const { useEffect, useContext, useRef } = require('react')
const { useImmer } = require('use-immer')
const { Link } = require('react-router-dom')

const StateContext = require('../StateContext')
const DispatchContext = require('../DispatchContext')

const io = require('socket.io-client')
const socket = io(
	process.env.BACKENDURL || 'https://backendapi-n3y9.onrender.com'
)

function Chat() {
	const chatField = useRef(null)
	const chatLog = useRef(null)

	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)

	const [state, setState] = useImmer({
		fieldValue: '',
		chatMessages: []
	})

	// 1) To focus on the chat field when the chat is opened
	useEffect(() => {
		if (appState.isChatOpen) {
			chatField.current.focus()
			appDispatch({ type: 'clearUnreadChatCount' })
		}
	}, [appState.isChatOpen])

	// 2) To listen to the chatFromServer event
	useEffect(() => {
		socket.on('chatFromServer', message => {
			setState(draft => {
				draft.chatMessages.push(message)
			})
		})
	}, [])

	// 3) To scroll to the bottom of the chat log when a new message is received
	useEffect(() => {
		chatLog.current.scrollTop = chatLog.current.scrollHeight
		if (state.chatMessages.length && !appState.isChatOpen) {
			appDispatch({ type: 'incrementUnreadChatCount' })
		}
	}, [state.chatMessages])

	function handleFieldChange(e) {
		const value = e.target.value
		setState(draft => {
			draft.fieldValue = value
		})
	}

	function handleSubmit(e) {
		e.preventDefault()
		if (state.fieldValue.trim() !== '') {
			socket.emit('chatFromBrowser', {
				message: state.fieldValue,
				token: appState.user.token
			})

			setState(draft => {
				// Add the message to the state collection
				draft.chatMessages.push({
					message: draft.fieldValue,
					username: appState.user.username,
					avatar: appState.user.avatar
				})
				draft.fieldValue = ''
			})
		}
	}

	return (
		<div
			id="chat-wrapper"
			className={
				'chat-wrapper shadow border-top border-left border-right' +
				` ${appState.isChatOpen ? 'chat-wrapper--is-visible' : ''}`
			}
		>
			<div className="chat-title-bar bg-primary">
				Chat
				<span
					onClick={() => appDispatch({ type: 'closeChat' })}
					className="chat-title-bar-close"
				>
					<i className="fas fa-times-circle"></i>
				</span>
			</div>

			<div id="chat" ref={chatLog} className="chat-log">
				{state.chatMessages.map((message, index) => {
					if (message.username == appState.user.username) {
						return (
							<div key={index} className="chat-self">
								<div className="chat-message">
									<div className="chat-message-inner">
										{message.message}
									</div>
								</div>
								<img
									className="chat-avatar avatar-tiny"
									src={message.avatar}
								/>
							</div>
						)
					} else {
						return (
							<div key={index} className="chat-other">
								<Link to={`/profile${message.username}`}>
									<img className="avatar-tiny" src={message.avatar} />
								</Link>
								<div className="chat-message">
									<div className="chat-message-inner">
										<Link to={`/profile${message.username}`}>
											<strong>{message.username}:</strong>{' '}
										</Link>
										{message.message}
									</div>
								</div>
							</div>
						)
					}
				})}
			</div>

			<form
				onSubmit={handleSubmit}
				id="chatForm"
				className="chat-form border-top"
			>
				<input
					onChange={handleFieldChange}
					value={state.fieldValue}
					ref={chatField}
					type="text"
					className="chat-field"
					id="chatField"
					placeholder="Type a message…"
					autoComplete="off"
				/>
			</form>
		</div>
	)
}

module.exports = Chat
