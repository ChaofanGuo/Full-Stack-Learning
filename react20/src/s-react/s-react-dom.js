function render(vnode, container) {
  // console.log('vnode', vnode)

  const node = createNode(vnode)

  container.appendChild(node)
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
