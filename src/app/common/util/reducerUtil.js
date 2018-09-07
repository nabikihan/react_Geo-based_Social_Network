export const createReducer = (initialState, fnMap) => {
    return (state = initialState, {type, payload}) => {
        const handler = fnMap[type];

        return handler ? handler(state, payload): state
    }
}

//这个用来替代reducer中的switch， 因为当你有很多switch的时候，code很不好看
// 当我们使用这个function的时候，reducer会把 initial state 和 FNMAP 传进来。FNMAP中【type】就是 action constan， 而handler就是type所对应的function。
//例如 EVENT REDUCER中的，各个CONST 的callback。
// handler ? handler(state, payload): state 就相当与原来switch中 的type， 如果是这个type（如果是这个handler）， 则运行handler的对应function，否则返回
// default state