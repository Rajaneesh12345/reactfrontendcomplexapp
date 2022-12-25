const React = require('react')
const { useEffect, useContext, useState } = require('react')
const Page = require('./Page')
const Axios = require('axios')
const ProfilePosts = require('./ProfilePosts')
const ProfileFollowers = require('./ProfileFollowers')
const ProfileFollowing = require('./ProfileFollowing')

const { useImmer } = require('use-immer')

const { useParams, NavLink, Routes, Route } = require('react-router-dom')
const StateContext = require('../StateContext')

function Profile() {
	const appState = useContext(StateContext)
	const { username } = useParams()
	const [state, setState] = useImmer({
		followActionLoading: false,
		startFollowingRequestCount: 0,
		stopFollowingRequestCount: 0,
		profileData: {
			profileUsername: '...',
			profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
			isFollowing: false,
			counts: { postCount: '', followerCount: '', followingCount: '' }
		}
	})

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source()
		async function fetchData() {
			try {
				const response = await Axios.post(
					`https://backendapi-n3y9.onrender.com/profile/${username}`,
					{
						token: appState.user.token
					}
				)
				// setProfileData(response.data)
				setState(draft => {
					draft.profileData = response.data
				})
			} catch (e) {
				console.log(e)
			}
		}

		fetchData()
		return () => ourRequest.cancel()
	}, [username])

	function startFollowing() {
		setState(draft => {
			draft.startFollowingRequestCount++
		})
	}

	useEffect(() => {
		if (state.startFollowingRequestCount) {
			setState(draft => {
				draft.followActionLoading = true
			})
			const ourRequest = Axios.CancelToken.source()
			async function fetchData() {
				try {
					const response = await Axios.post(
						`https://backendapi-n3y9.onrender.com/addFollow/${state.profileData.profileUsername}`,
						{
							token: appState.user.token
						}
					)
					setState(draft => {
						draft.profileData.isFollowing = true
						draft.profileData.counts.followerCount++
						draft.followActionLoading = false
					})
				} catch (e) {
					console.log(e)
				}
			}

			fetchData()
			return () => ourRequest.cancel()
		}
	}, [state.startFollowingRequestCount])

	function stopFollowing() {
		setState(draft => {
			draft.stopFollowingRequestCount++
		})
	}

	useEffect(() => {
		if (state.stopFollowingRequestCount) {
			setState(draft => {
				draft.followActionLoading = true
			})
			const ourRequest = Axios.CancelToken.source()
			async function fetchData() {
				try {
					const response = await Axios.post(
						`https://backendapi-n3y9.onrender.com/removeFollow/${state.profileData.profileUsername}`,
						{
							token: appState.user.token
						}
					)
					setState(draft => {
						draft.profileData.isFollowing = false
						draft.profileData.counts.followerCount--
						draft.followActionLoading = false
					})
				} catch (e) {
					console.log(e)
				}
			}

			fetchData()
			// return () => ourRequest.cancel()
		}
	}, [state.stopFollowingRequestCount])

	return (
		<Page title="Profile">
			<h2>
				<img
					className="avatar-small"
					src={state.profileData.profileAvatar}
				/>{' '}
				{state.profileData.profileUsername}
				{!state.profileData.isFollowing &&
					appState.loggedIn &&
					state.profileData.profileUsername !== appState.user.username &&
					state.profileData.profileUsername !== '...' && (
						<button
							onClick={startFollowing}
							className="btn btn-primary btn-sm ml-2"
							disabled={state.followActionLoading}
						>
							Follow <i className="fas fa-user-plus"></i>
						</button>
					)}
				{state.profileData.isFollowing &&
					appState.loggedIn &&
					state.profileData.profileUsername !== appState.user.username &&
					state.profileData.profileUsername !== '...' && (
						<button
							onClick={stopFollowing}
							className="btn btn-danger btn-sm ml-2"
							disabled={state.followActionLoading}
						>
							Stop Following <i className="fas fa-user-times"></i>
						</button>
					)}
			</h2>

			<div className="profile-nav nav nav-tabs pt-2 mb-4">
				<NavLink to="" end className="nav-item nav-link">
					Posts: {state.profileData.counts.postCount}
				</NavLink>
				<NavLink to="followers" className="nav-item nav-link">
					Followers: {state.profileData.counts.followerCount}
				</NavLink>
				<NavLink to="following" className="nav-item nav-link">
					Following: {state.profileData.counts.followingCount}
				</NavLink>
			</div>
			<Routes>
				<Route path="" element={<ProfilePosts />} />
				<Route path="followers" element={<ProfileFollowers />} />
				<Route path="following" element={<ProfileFollowing />} />
			</Routes>
		</Page>
	)
}

module.exports = Profile
