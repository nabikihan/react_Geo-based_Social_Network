import React from 'react'
import { Form, Label } from 'semantic-ui-react'


// 这个会被event form使用
const TextInput = ({input, width, type, placeholder, meta: {touched, error}}) => {

    // {}这些都是 你在表单中的输入
    //error：如果field been touched（就是你开始在field中输入东西）， 并且确实有error， 则我们会display the error，改变color，什么的
    // width：
    // type：就是eventform中的type，例如 text， 还是其他的什么
    return (
        <Form.Field error={touched && !!error} width={width}>
            <input {...input} placeholder={placeholder} type={type}/>
            {touched && error && <Label basic color='red'>{error}</Label>}
        </Form.Field>
    )
}

export default TextInput