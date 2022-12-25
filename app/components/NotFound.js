const React = require('react')
const Page = require('./Page')
const { Link } = require('react-router-dom')

function NotFound() {
	return (
		<Page title="Not Found">
			<div className="text-center">
				<h2>Whoops, we cannot find that page.</h2>
				<p className="lead text-muted">
					You can always visit the <Link to="/">homepage</Link> to get a
					fresh start.
				</p>
			</div>
		</Page>
	)
}

module.exports = NotFound
