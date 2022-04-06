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

function commitRoot () {
	commitWork(wipRoot.child)
	wipRoot = null
}

function commitWork (fiber) {
	if (!fiber) return
	const domParent = fiber.parent.dom
	domParent.appendChild(fiber.dom)
	commitWork(fiber.child)
	commitWork(fiber.sibling)
}

// 渲染函数
function render(element, container) {
	wipRoot = {
		dom: container,
		props: {
			children: [element],
		},
	}
	nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null
let wipRoot = null

function workLoop(deadline) {
	let shouldYield = false
	while (nextUnitOfWork && !shouldYield) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
		shouldYield = deadline.timeRemaining() < 1
	}
	if (!nextUnitOfWork && wipRoot){
		commitRoot()
	}
	// 申请下个时间切片
	requestIdleCallback(workLoop)
}
//  https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
// 注册任务，告诉浏览器如果存在空闲时间，就执行我们的任务
requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
	console.log('fiber',fiber);
	if (!fiber.dom) {
		fiber.dom = createDom(fiber)
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
