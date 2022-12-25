const React = require('react')
const { useEffect } = require('react')

function FlashMessages(props) {
	return (
		<div className="floating-alerts">
			{props.messages.map((msg, index) => {
				return (
					<div
						key={index}
						className="alert alert-success text-center floating-alert shadow-sm"
					>
						{msg}
					</div>
				)
			})}
		</div>
	)
}

module.exports = FlashMessages
