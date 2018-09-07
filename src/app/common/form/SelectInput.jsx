import React from 'react'
import { Form, Label, Select } from 'semantic-ui-react'


// 这个是drop down 菜单的。
const SelectInput = ({input, type, placeholder, multiple, options, meta: {touched, error}}) => {

    //value：我们需要override the input。因为它是个select，它不是你直接输入的。如果直接输入的那种，你输入的话，value就是你输入的string，
    //       如果你不输入，则value为空，但是因为这里是个下拉选项，你如果不选，那么程序不知道该怎么做，就会产生error，所以你要规定
    //       要么是input的value，也就是选择的项目，要么是NULL ，就是不选时如何处理。

    //onchange：E 为event，data就是input value，也就是说我们时刻给onchange更新input value
    //multiple：是个boolean，就是让你可以选择多个选项，你需要在event form设置它是true or false
    // options：为有多少选项，和event category挂钩，见event form
    return (
        <Form.Field error={touched && !!error}>
            <Select
                value={input.value || null}
                onChange={(e, data) => input.onChange(data.value)}
                placeholder={placeholder}
                options={options}
                multiple={multiple}
            />
            {touched && error && <Label basic color='red'>{error}</Label>}
        </Form.Field>
    )
}

export default SelectInput