import { Component } from 'react'
import { withRouter } from 'react-router-dom'

class ScrollToTop extends Component {

    //这个function当你第一次LOAD你的data的时候，它不会被call。但是当你change STH, 这个function会被call
    //因为这个function是basedon OUR location data的（就是react router的history中的location，记录你当前的状态和linK 位置的）
    // 所以，当我们change location，也就是有页面的变化，然后就会call这个function，这样它用了window 函数令页面从00位置展示。
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0)
        }
    }

    // this.props.children是指，当前component的children是谁，也就是在总index中scrollTOTOP包裹的app就是它的children，这里就是render这个孩子
    // HOC 把这个孩子付给了SCROLLTOTOP 这样就可以打包展示了。
    render() {
        return this.props.children
    }
}

export default withRouter(ScrollToTop)