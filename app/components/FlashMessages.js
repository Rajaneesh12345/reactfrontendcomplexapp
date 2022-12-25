const React = require('react')

function FlashMessages(props) {
	return (
		<div className="floating-alerts">
			{props.messages.map((msg, index) => {
				return (
					<div
						key={index}
						className={
							'alert text-center floating-alert shadow-sm ' +
							('alert-' + `${msg.color}`)
						}
					>
						{msg.message}
					</div>
				)
			})}
		</div>
	)
}

module.exports = FlashMessages
