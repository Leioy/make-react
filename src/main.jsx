/** @jsx Didact.createElement */
import { Didact } from './Didact'
const container = document.getElementById('root')

function Counter() {
	const [count, setCount] = Didact.useState(0)
	return (	
		<div>
			<button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
		</div>
	)
}
Didact.render(<Counter />, container)
