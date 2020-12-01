import React from 'react'
import FieldContext from './fieldContext'
import useForm from "./useForm";

export default function Form({children, form, onFinish, onFinishFailed}) {
  const [formInstance] = useForm(form)

  formInstance.registerCBs({onFinish, onFinishFailed})

  const handleFormClick = (e) => {
    e.preventDefault()
    if (e.target.tagName === 'BUTTON') {
      formInstance.submit()
    }
  }
  return (
    <form onClick={handleFormClick}>
      <FieldContext.Provider value={formInstance}>
        {children}
      </FieldContext.Provider>
    </form>
  )
}
