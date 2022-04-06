/** @jsx Didact.createElement */
import { Didact } from './Didact'
const container = document.getElementById('root')
const updateValue = (e) => {
	reRender(e.target.value)
}
const reRender = (value) => {
	const element = (
		<div id="foo">
			<input type='text' onInput={updateValue} value={value} />
			<h2>hello {value}</h2>
		</div>
	)
	Didact.render(element, container)
}
reRender('world')
