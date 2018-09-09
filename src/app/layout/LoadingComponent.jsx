import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'


// 用SEMANTIC UI 来实现
// inverted： 这个就是变黑色变白色
const LoadingComponent = ({inverted}) => {
    return (
        <Dimmer inverted={inverted} active={true}>
            <Loader content='Loading...'/>
        </Dimmer>
    )
}

export default LoadingComponent