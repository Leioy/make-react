/** @jsx Didact.createElement */
import { Didact } from './Didact'
const container = document.getElementById('root')

function App (props) {
	return <h1 id="foo">hi {props.name}</h1>
}
Didact.render(<App name="foo" />,container)
