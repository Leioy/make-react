export const Didact = {
	createElement,
	render,
}

// 创建节点
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

// 渲染函数
function render(element, container) {
	nextUnitOfWork = {
		dom: container,
		props: {
			children: [element],
		},
	}
}

let nextUnitOfWork = null

function workLoop(deadline) {
	let shouldYield = false
	while (nextUnitOfWork && !shouldYield) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
		shouldYield = deadline.timeRemaining() < 1
	}
	// 申请下个时间切片
	requestIdleCallback(workLoop)
}
//  https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
// 注册任务，告诉浏览器如果存在空闲时间，就执行我们的任务
requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
	console.log('fiber',fiber);
	debugger
	if (!fiber.dom) {
		fiber.dom = createDom(fiber)
	}
	if (fiber.parent) {
		fiber.parent.dom.appendChild(fiber.dom)
	}
	const elements = fiber.props.children
	let index = 0
	let prevSiblings = null
	while (index < elements.length) {
		const element = elements[index]
		const newFiber = {
			type: element.type,
			props: element.props,
			parent: fiber,
			dom: null,
		}
		if (index === 0) {
			fiber.child = newFiber
		} else {
			prevSiblings.sibling = newFiber
		}
		prevSiblings = newFiber
		index++
	}
	if (fiber.child) {
		return fiber.child
	}
	let nextFiber = fiber
	while (nextFiber) {
		if (nextFiber.sibling) {
			return nextFiber.sibling
		}
		nextFiber = nextFiber.parent
	}
}

function createDom(fiber) {
	const dom =
		fiber.type === 'TEXT_ELEMENT'
			? document.createTextNode('')
			: document.createElement(fiber.type)
	const isProperty = (key) => key !== 'children'
	Object.keys(fiber.props)
		.filter(isProperty)
		.forEach((name) => {
			dom[name] = fiber.props[name]
		})
	return dom
}
