import moment from 'moment'

// for event detail page，从 fire store 取数据
// 在event list item中，关于attendee的code，我们只check了 object values。没有KEY ，这里我用了ENTRIES，
// 既得到了KEY 也得到了value。e[0]为KEY, e[1]为value。
export const objectToArray = (object) => {
    if (object) {
        return Object.entries(object).map(e => Object.assign(e[1], {id: e[0]}))
    }
}



// for event actions，向 fire store 放数据
export const createNewEvent = (user, photoURL, event) => {

    // 通过moment 把DATE转化为JavaScript date。
    event.date = moment(event.date).toDate();
    return {
        ...event,
        hostUid: user.uid,
        hostedBy: user.displayName,
        hostPhotoURL: photoURL || '/assets/user.png',
        created: Date.now(),

        //这个形式是因为我们在建立attendee in fire store的时候，它是个nested array。你要先明确它的ID
        // userID 因为是你当前login的账户，所以你自己是host，那只需取出你自己的userID即可。
        attendees: {
            [user.uid]: {
                going: true,
                joinDate: Date.now(),
                photoURL: photoURL || '/assets/user.png',
                displayName: user.displayName,
                host: true
            }
        }
    }
}

///////////////////////////////////for chatting////////////////////////////////////////////////
// 用来handle reply的位置
// 目前firebase中的数据是个flat array，就是这里的 input dataset，
// 然后我们对于array里面的每一个元素都赋予一个ID，然后加一个空array用来放childID，类似哈希map的initialize
// 我们开始建立data tree：如果元素有个parentID，我们就把该元素放到parentID的child array里面； 如果没有parentID ,则就是把该元素放进datatree里面
// 这样我们的data tree就放入的parentID的节点，然后他对应的array就存入了他的孩子。
export const createDataTree = dataset => {
    let hashTable = Object.create(null);
    dataset.forEach(a => hashTable[a.id] = {...a, childNodes: []});
    let dataTree = [];
    dataset.forEach(a => {
        if (a.parentId) hashTable[a.parentId].childNodes.push(hashTable[a.id]);
        else dataTree.push(hashTable[a.id])
    });
    return dataTree
};