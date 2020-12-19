const frag = (<></>)
const FragmentSymbol = frag.type
// console.log(FragmentSymbol)

let wipRoot = null

function render(vnode, container) {
  /*
  console.log('vnode', vnode)

  const node = createNode(vnode)

  container.appendChild(node)
  // node instanceof Array ? node.forEach(n => container.appendChild(n)) : container.appendChild(node)
  */

  wipRoot = {
    type: 'div',
    props: {
      children: {...vnode}
    },
    stateNode: container
  }

  nextUnitOfWork = wipRoot
}

function isStringOrNumber(input) {
  return typeof input === 'string' || typeof input === 'number'
}

function createNode(workInProgress) {
  /*
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
  */

  const {type, props} = workInProgress
  const node = document.createElement(type)
  updateNode(node, props)
  return node
}

function updateHostComponent(workInProgress) {
  /*
  const {type, props} = vnode

  const node = document.createElement(type)
  updateNode(node, props)
  reconcileChildren(node, props.children)

  return node
  */

  if (!workInProgress.stateNode) {
    workInProgress.stateNode = createNode(workInProgress)
  }

  reconcileChildren(workInProgress, workInProgress.props.children)
}

function updateNode(node, nextVal) {
  for (let key of Object.keys(nextVal)/*.filter(k => k !== 'children')*/) {
    if (key === 'children') {
      if (isStringOrNumber(nextVal[key])) {
        node.textContent = nextVal[key].toString()
      }
    } else {
      node[key] = nextVal[key]
    }
  }
}

function updateTextComponent(vnode) {
  const node = document.createTextNode(vnode)
  return node
}

function updateFunctionComponent(workInProgress) {
  /*
  const {type, props} = vnode
  const child = type(props)

  const node = createNode(child)
  return node
  */

  const {type, props} = workInProgress
  const child = type(props)

  reconcileChildren(workInProgress, child)
}

function updateClassComponent(workInProgress) {
  /*
  const {type, props} = vnode
  const instance = new type(props)
  const child = instance.render()
  const node = createNode(child)
  return node
  */
  const {type, props} = workInProgress
  const instance = new type(props)
  const child = instance.render()
  reconcileChildren(workInProgress, child)
}

function updateFragment(workInProgress) {
  /*
  const {props} = vnode
  const fragment = document.createDocumentFragment()

  for (let child of props.children) {
    const node = createNode(child)
    fragment.appendChild(node)
  }

  return fragment
  */
  reconcileChildren(workInProgress, workInProgress.props.children)
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

function performUnitOfWork(workInProgress) {
  const {type} = workInProgress
  if (typeof type === 'string') {
    updateHostComponent(workInProgress)
  } else if (typeof type === 'function') {
    type.prototype.isReactComponent ? updateClassComponent(workInProgress) : updateFunctionComponent(workInProgress)
  } else if (type === FragmentSymbol) {
    updateFragment(workInProgress)
  }

  if (workInProgress.child) {
    return workInProgress.child
  }

  let nextFiber = workInProgress
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.return
  }
}

let nextUnitOfWork = null

function workLoop(IdleDeadline) {
  while (nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    // console.log(nextUnitOfWork)
  }

  window.requestIdleCallback(workLoop)

  if (!nextUnitOfWork && wipRoot) {
    // todo: append vnode to dom node
    commitRoot()
  }
}

function commitRoot() {
  commitWorker(wipRoot.child)
  wipRoot = null
}

function commitWorker(workInProgress) {
  if (!workInProgress) {
    return
  }

  let parentFiber = workInProgress.return
  while(!parentFiber.stateNode) {
    parentFiber = parentFiber.return
  }

  let parentNode = parentFiber.stateNode
  if (workInProgress.stateNode) {
    parentNode.appendChild(workInProgress.stateNode)
  }

  commitWorker(workInProgress.child)
  commitWorker(workInProgress.sibling)
}

window.requestIdleCallback(workLoop)

function reconcileChildren(workInProgress, children) {
  /*
  const newChildren = Array.isArray(children) ? children : [children]

  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i]
    render(child, parentNode)
  }
  */

  if (isStringOrNumber(children)) {
    return
  }

  const newChildren = Array.isArray(children) ? children : [children]

  let prevFiber
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i]

    let newFiber = {
      type: child.type,
      props: {...child.props},
      child: null,
      sibling: null,
      return: workInProgress,
      stateNode: null,
    }

    if (i === 0) {
      workInProgress.child = newFiber
    } else {
      prevFiber.sibling = newFiber
    }
    prevFiber = newFiber
  }
}

const exp = {
  render
}

export default exp
