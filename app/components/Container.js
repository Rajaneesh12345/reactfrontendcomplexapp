const React = require('react')
const { useEffect } = require('react')

function Container(props) {
	return (
		<>
			<div className={`container ${props.wide ? ' ' : 'container--narrow'} py-md-5 `}>{props.children}</div>
		</>
	)
}

module.exports = Container
