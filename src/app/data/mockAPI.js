import sampleData from './sampleData';


// 这里就是 promise的用法， 见笔记。
// 这里表面的意思就是，我先建立一个参数叫delay，它的ARGU是时间MS , 而settimeout这个函数它要求第一个参数是个函数，
// 而且是立刻执行，也就是当你执行到set time out的时候，你就开始执行resolve了。
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const fetchSampleData = () => {
    return delay(1000).then(() => {
        return Promise.resolve(sampleData)
    })
}