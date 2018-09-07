import React from 'react'
import { Form, Label } from 'semantic-ui-react'


//同理，这个是eventform用来handle textarea error的。
const TextArea = ({input, rows, width, type, placeholder, meta: {touched, error}}) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
            <textarea {...input} placeholder={placeholder} rows={rows}></textarea>
            {touched && error && <Label basic color='red'>{error}</Label>}
        </Form.Field>
    )
}

export default TextArea