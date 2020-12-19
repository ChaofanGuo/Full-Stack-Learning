const frag = (<></>)
const FragmentSymbol = frag.type
console.log(FragmentSymbol)

function render(vnode, container) {
  console.log('vnode', vnode)

  const node = createNode(vnode)

  container.appendChild(node)
  // node instanceof Array ? node.forEach(n => container.appendChild(n)) : container.appendChild(node)
}

function isStringOrNumber(input) {
  return typeof input === 'string' || typeof input === 'number'
}

function createNode(vnode) {
  let node

  const {type} = vnode
  if (typeof type === 'string') {
    node = updateHostComponent(vnode)
  } else if (isStringOrNumber(vnode)) {
    node = updateTextComponent(vnode + '')
  } else if (typeof type === 'function') {
    node = type.prototype.isReactComponent ? updateClassComponent(vnode) : updateFunctionComponent(vnode)
  } else if (type === FragmentSymbol) {
    node = updateFragment(vnode)
  }

  return node
}

function updateHostComponent(vnode) {
  const {type, props} = vnode

  const node = document.createElement(type)
  updateNode(node, props)
  reconcileChildren(node, props.children)

  return node
}

function updateNode(node, nextVal) {
  for(let key of Object.keys(nextVal).filter(k => k !== 'children')) {
    node[key] = nextVal[key]
  }
}

function updateTextComponent(vnode) {
  const node = document.createTextNode(vnode)
  return node
}

function updateFunctionComponent(vnode) {
  const {type, props} = vnode

  const child = type(props)

  const node = createNode(child)
  return node
}

function updateClassComponent(vnode) {
  const {type, props} = vnode
  const instance = new type(props)
  const child = instance.render()
  const node = createNode(child)
  return node
}

function updateFragment(vnode) {
  const {props} = vnode
  const fragment = document.createDocumentFragment()

  for(let child of props.children) {
    const node = createNode(child)
    fragment.appendChild(node)
  }

  return fragment
}

/*
function updateFragment(vnode) {
  const {type, props} = vnode
  const nodes = []
  for(let child of props.children) {
    nodes.push(createNode(child))
  }

  return nodes
}
 */

function reconcileChildren(parentNode, children) {
  const newChildren = Array.isArray(children) ? children : [children]

  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i]
    render(child, parentNode)
  }
}

const exp = {
  render
}

export default exp
