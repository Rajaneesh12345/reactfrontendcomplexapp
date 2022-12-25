const React = require('react')
const { useEffect } = require('react')
const Container = require('./Container')
function Page(props) {
	useEffect(() => {
		document.title = `${props.title} | ComplexApp`
		window.scrollTo(0, 0)
	}, [props.title])
	return <Container wide={props.wide}>{props.children}</Container>
}

module.exports = Page
