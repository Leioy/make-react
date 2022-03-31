const container = document.getElementById('root')
const Didact = {
	createElement,
	render,
}

function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props,
			children: children.map((child) =>
				typeof child === 'object' ? child : createTextElement(child)
			),
		},
	}
}

// 创建文本节点
function createTextElement(text) {
	return {
		type: 'TEXT_ELEMENT',
		props: {
			nodeValue: text,
			children: [],
		},
	}
}

function render(element, container) {
	console.log('container', element)
	const dom =
		element.type === 'TEXT_ELEMENT'
			? document.createTextNode('')
			: document.createElement(element.type)
	const isProperty = (key) => key !== 'children'
	Object.keys(element.props)
		.filter(isProperty)
		.forEach((name) => {
			dom[name] = element.props[name]
		})
	container.appendChild(dom)
	element.props.children.forEach((child) => render(child, dom))
}

/** @jsx Didact.createElement */
const element = (
	<div id='foo'>
		<a>bar</a>
		<b />
	</div>
)
Didact.render(element, container)
