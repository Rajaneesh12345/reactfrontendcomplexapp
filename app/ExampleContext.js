// context allows us to send the state to any layer deep in the component tree
const { createContext } = require('react')
// context provider
const ExampleContext = createContext()

module.exports = ExampleContext
