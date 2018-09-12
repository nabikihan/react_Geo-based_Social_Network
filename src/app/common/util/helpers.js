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