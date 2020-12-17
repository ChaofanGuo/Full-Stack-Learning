function render(vnode, container) {
  // console.log('vnode', vnode)

  const node = createNode(vnode)

  container.appendChild(node)
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
  }

  return node
  */

  const {type, props} = workInProgress
  const node = document.createElement(type)
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
  for(let key of Object.keys(nextVal)/*.filter(k => k !== 'children')*/) {
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

  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i]

    let prevFiber = null
    let newFiber = {
      type: child.type,
      props: {...child.props},
      child: null,
      sibling: null,
      return: workInProgress,
      stateNode: null
    }

    if (i === 0) {
      workInProgress.child = newFiber
    } else {
      prevFiber.sibling = newFiber
    }

    prevFiber = newFiber
  }
}

let nextUnitOfWork = null

function performUnitOfWork(workInProgress) {

  if (workInProgress.child) {
    return workInProgress.child
  }

  let nextFiber = workInProgress
  while(nextFiber) {

    if (nextFiber.sibling) {
      return nextFiber.sibling
    }

    nextFiber = nextFiber.return
  }
}

function workLoop(IdleDeadline) {

  while(nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
}

requestIdleCallback(workLoop)

const exp = {
  render
}

export default exp
