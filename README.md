# 实现一个简单的react



#### 参考

[带你从0到1实现一个 mini 版本的 react](https://juejin.cn/post/6939443536651616293#heading-9)

[200行代码实现简版React](https://blog.fundebug.com/2018/12/22/implement-react-with-200-lines-code/)



```html
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=
	, initial-scale=1.0">
	<title>Document</title>
</head>

<body>
	<div id="app"></div>
</body>
<script>
	const render = (element, rootDom) => {
		const instance = createInstance(element)
		reconcile(instance, rootDom)
	}

	const reconcile = (instance, rootDom, oldNode) => {
		count = 0

		if (oldNode) {
			rootDom.removeChild(oldNode)
		}
		rootDom.appendChild(instance.dom)
		if (instance.children) {
			instance.children.forEach(element => {
				reconcile(element, instance.dom)
			});
		}
	}

	const createElement = (type, props, ...children) => {

		props.children = children

		return {
			type,
			props
		}
	}

	const createInstance = (element) => {
		let dom, children
		currentElement = element
		if (typeof element === 'string') {
			dom = document.createTextNode(element)
			children = []
		} else {
			const { type, props = {} } = element
			if (typeof type === 'string') {
				dom = document.createElement(type)
				updateDomProperties(dom, {}, props)
				children = props.children.map(el => createInstance(el))
			} else {
				let childrenElement = type(props)
				let instance = createInstance(childrenElement)
				element.__instance = instance
				element.childrenElement = childrenElement
				return instance
			}

		}


		return {
			dom,
			element,
			children
		}
	}

	const updateDomProperties = (dom, preProps = {}, nextProps) => {
		const isEvent = name => name.startsWith('on')
		const isAttribute = name => !isEvent(name) && (name !== 'children')
		const eventType = event => event.substring(2).toLowerCase()
		Object.keys(preProps).filter(name => isAttribute(name)).forEach(key => dom[key] = null)
		Object.keys(preProps).filter(name => isEvent(name)).forEach(event => document.removeEventListener(eventType(event)))
		Object.keys(nextProps).filter(name => isAttribute(name)).forEach(key => dom[key] = nextProps[key])
		Object.keys(nextProps).filter(name => isEvent(name)).forEach(event => dom.addEventListener(eventType(event), nextProps[event]))
	}

	let currentElement = null
	let count = 0
	const useState = (initState) => {
		let currentValue = {
			state: currentElement.hooks && currentElement.hooks[count]?.state || initState
		}
		let element = currentElement

		let currentCount = count
		let instance
		if (!element.hooks) {
			element.hooks = []
		}
		const getState = () => {
			return currentValue
		}
		const setState = (newState) => {
			currentElement = element

			currentElement.hooks[currentCount].state = newState
			let parentNode = element.__instance.dom.parentNode
			let oldNode = element.__instance.dom

			instance = createInstance(element)

			console.log(element, instance, parentNode);

			let rootDom = document.getElementById('app')

			reconcile(instance, parentNode, oldNode)
		}


		if (!element.hooks[count]) {
			element.hooks.push(currentValue)

		}
		count++

		return [currentValue.state, setState]
	}

	const App = () => {
		const [state, setState] = useState(1)
		const [state1, setState1] = useState(2)
		const handleClick = () => {
			setState(state + 1)
			setState1(state1 + 2)
		}

		return (
			createElement('div', {
				onClick: handleClick
			}, createElement(
				'span',
				{

				},
				state + '',
				state1 + ''
			))
		)
	}

	render(createElement(App, {}, []), document.getElementById('app'))

</script>

</html>

```
