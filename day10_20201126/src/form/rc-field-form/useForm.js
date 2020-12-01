import React from 'react'

class FormStore {
  constructor() {
    this.store = {}
    this.fields = []
    this.form = null
    this.callbacks = {}
    this.rules = {}
  }

  registerField = field => {
    this.fields.push(field)

    return () => {
      this.fields = this.fields.filter(item => item !== field)
      delete this.store[field.props.name]
    }
  }

  registerCBs = (newCallbacks) => {
    this.callbacks = {
      ...this.callbacks,
      ...newCallbacks
    }
  }

  getFieldsValue = () => {
    return {...this.store}
  }

  setFieldsValue = (newStore) => {
    this.store = {
      ...this.store,
      ...newStore
    }
    Object.keys(newStore).forEach(key => {
      this.handleTriggerUpdate(key)
    })
  }

  getFieldValue = (key) => {
    return this.store[key]
  }

  setFieldValue = (key, val) => {
    this.store[key] = val
    console.log(this.store)
    this.handleTriggerUpdate(key)
  }

  handleTriggerUpdate = (target) => {
    if (target === 'errMsgs') {
      for(let key of Object.keys(this.store.errMsgs)) {
        this.triggerUpdate(key)
      }
    } else {
      this.triggerUpdate(target)
    }
  }

  triggerUpdate = (key) => {
    const field = this.fields.find(field => {
      const {name} = field.props
      return name === key
    })
    if (field) {
      field.onStoreChange()
    }
  }

  validate = () => {
    let err = []

    // todo: Validate input
    this.fields.forEach(field => {
      const {name, rules} = field.props
      const value = this.getFieldValue(name)
      if (rules) {
        rules.forEach(rule => {
          if (rule.required && (value === '' || value === null || value === undefined)) {
            err.push({key: name, message: rule.message})
          }
        })
      }
    })

    return err
  }

  submit = () => {
    const err = this.validate()
    const {onFinish, onFinishFailed} = this.callbacks
    if (err.length === 0) {
      onFinish(this.getFieldsValue())
    } else {
      onFinishFailed(err, this.getFieldsValue())
    }
  }

  getForm = () => {
    return {
      getFieldsValue: this.getFieldsValue,
      setFieldsValue: this.setFieldsValue,
      getFieldValue: this.getFieldValue,
      setFieldValue: this.setFieldValue,
      registerField: this.registerField,
      registerCBs: this.registerCBs,
      submit: this.submit
    }
  }
}

export default function useForm(form) {
  const formRef = React.useRef()
  if (!formRef.current) {
    if (form) {
      formRef.current = form
    } else {
      const formStore = new FormStore()
      formRef.current = formStore.getForm()
    }
  }
  return [formRef.current]
}

export {
  FormStore
}
