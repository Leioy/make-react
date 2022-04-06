import { Didact } from './Didact'
const container = document.getElementById('root')
/** @jsx Didact.createElement */
const element = (
	<div id='foo'>
		<a>bar</a>
		<h4>title</h4>
	</div>
)
Didact.render(element, container)
