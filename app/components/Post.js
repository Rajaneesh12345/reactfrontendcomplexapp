const React = require('react')
const { useEffect } = require('react')
const { Link } = require('react-router-dom')

function Post(props) {
	const a = props.post

	const date = new Date(a.createdDate)
	const dateFormatted = `${date.getDate()}/${
		date.getMonth() + 1
	}/${date.getFullYear()}`
	return (
		<Link
			onClick={props.onClick}
			to={`/post/${a._id}`}
			className="list-group-item list-group-item-action"
		>
			<img className="avatar-tiny" src={a.author.avatar} />{' '}
			<strong>{a.title}</strong>{' '}
			<span className="text-muted small">
				{!props.noAuthor && <>by {a.author.username}</>} on {dateFormatted}
			</span>
		</Link>
	)
}

module.exports = Post
