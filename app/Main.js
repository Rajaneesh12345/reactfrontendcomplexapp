const React = require('react')
const ReactDOM = require('react-dom/client')
const { CSSTransition } = require('react-transition-group')

const Axios = require('axios')

const { useEffect, Suspense } = React
const { useImmerReducer, useImmer } = require('use-immer')
const { BrowserRouter, Routes, Route } = require('react-router-dom')

const LoadingDotsIcon = require('./components/LoadingDotsIcon')
const Header = require('./components/Header')
const Profile = require('./components/Profile')
const HomeGuest = require('./components/HomeGuest')
const Home = require('./components/Home')
const Footer = require('./components/Footer')

// const CreatePost = React.lazy(() => require('./components/CreatePost'))
const CreatePost = require('./components/CreatePost')

const About = require('./components/About')
const Terms = require('./components/Terms')

// const ViewSinglePost = React.lazy(() => require('./components/ViewSinglePost'))
const ViewSinglePost = require('./components/ViewSinglePost')

const FlashMessages = require('./components/FlashMessages')
const EditPosts = require('./components/EditPosts')
const NotFound = require('./components/NotFound')
const Search = require('./components/Search')
const Chat = require('./components/Chat')

const StateContext = require('./StateContext')
const DispatchContext = require('./DispatchContext')

Axios.default.baseURL =
	process.env.BACKENDURL || 'https://backendapi-n3y9.onrender.com'

function Main() {
	const initialState = {
		loggedIn: Boolean(localStorage.getItem('complexAppToken')),
		flashMessages: [],
		user: {
			token: localStorage.getItem('complexAppToken'),
			username: localStorage.getItem('complexAppUsername'),
			avatar: localStorage.getItem('complexAppAvatar')
		},
		isSearchOpen: false,
		isChatOpen: false,
		unreadChatCount: 0
	}

	function ourReducer(draft, action) {
		switch (action.type) {
			case 'login':
				draft.loggedIn = true
				draft.user = action.data
				return
			case 'logout':
				draft.loggedIn = false
				return
			case 'flashMessage':
				draft.flashMessages.push(action.value)
				return
			case 'openSearch':
				draft.isSearchOpen = true
				return
			case 'closeSearch':
				draft.isSearchOpen = false
				return
			case 'toggleChat':
				draft.isChatOpen = !draft.isChatOpen
				return
			case 'closeChat':
				draft.isChatOpen = false
				return
			case 'incrementUnreadChatCount':
				draft.unreadChatCount++
				return
			case 'clearUnreadChatCount':
				draft.unreadChatCount = 0
				return
		}
	}

	const [state, dispatch] = useImmerReducer(ourReducer, initialState)

	useEffect(() => {
		if (state.loggedIn) {
			localStorage.setItem('complexAppToken', state.user.token)
			localStorage.setItem('complexAppUsername', state.user.username)
			localStorage.setItem('complexAppAvatar', state.user.avatar)
		} else {
			localStorage.removeItem('complexAppToken')
			localStorage.removeItem('complexAppUsername')
			localStorage.removeItem('complexAppAvatar')
		}
	}, [state.loggedIn])

	useEffect(() => {
		if (state.loggedIn) {
			const ourRequest = Axios.CancelToken.source()
			async function fetchResults() {
				if (state.searchTerm !== '') {
					const response = await Axios.post(
						'https://backendapi-n3y9.onrender.com/checkToken',
						{ token: state.user.token },
						{ cancelToken: ourRequest.token }
					)
					if (!response.data) {
						dispatch({ type: 'logout' })
						dispatch({
							type: 'flashMessage',
							value: 'Your session has expired. Please log in again.'
						})
					}
				}
			}
			fetchResults()
			return () => ourRequest.cancel() // to cancel the request
		}
	}, [])

	return (
		// Any value that is passed to the provider will be available to any component that is a child of the provider.
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				<BrowserRouter>
					<FlashMessages messages={state.flashMessages} />

					<Header />

					{/* <Suspense fallback={<LoadingDotsIcon />}> */}
					<Routes>
						<Route
							path="/"
							element={state.loggedIn ? <Home /> : <HomeGuest />}
						/>
						<Route path="profile/:username/*" element={<Profile />} />
						<Route path="/post/:id" element={<ViewSinglePost />} />
						<Route path="/post/:id/edit" element={<EditPosts />} />
						<Route path="/create-post" element={<CreatePost />} />

						<Route path="/about-us" element={<About />} />

						<Route path="/terms" element={<Terms />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
					{/* </Suspense> */}

					{state.isSearchOpen ? <Search /> : ''}
					<Chat />
					<Footer />
				</BrowserRouter>
			</DispatchContext.Provider>
		</StateContext.Provider>
	)
}

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(<Main />)

if (module.hot) {
	module.hot.accept()
}
