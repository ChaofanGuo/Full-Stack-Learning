import React, {Component, useEffect} from 'react'
import Form, {Field} from './rc-field-form'
import Input from "../components/input";

const usernameRules = {required: true, message: '请输入用户名'}
const passwordRules = {required: true, message: '请输入密码'}

export default function FormTest(props) {
  const [form] = Form.useForm()

  const handleFinish = val => {
    console.log('in handleFinish fun')
    form.setFieldValue('errMsgs', {})
  }

  const handleFinishFailed = val => {
    console.log('in handleFinishFailed fun', val)
    for(let err of val) {
      errMsgs[err.key] = err.message
      console.error(err.message)
    }
    form.setFieldValue('errMsgs', errMsgs)
  }

  useEffect(() => {
    console.log('form', form)
    form.setFieldsValue({username: 'default', errMsgs: {}})
  }, [form])

  let errMsgs
  if (form.getFieldValue('errMsgs')) {
    errMsgs = form.getFieldValue('errMsgs')
  } else {
    errMsgs = {}
  }

  return (
    <div>
      <h3>Form Test</h3>
      <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed}>
        <Field name="username" rules={[usernameRules]} errMsg={errMsgs.username}>
          <Input placeholder="Please input username"/>
        </Field>
        <Field name="password" rules={[passwordRules]} errMsg={errMsgs.password}>
          <Input placeholder="Please input password" />
        </Field>
        <Field>
          <button>Submit</button>
        </Field>
      </Form>
    </div>
  )
}
