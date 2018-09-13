
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// 这三行将给我们access TO our admin functionality so that we don't need permissions. We get the full rights to the
// applications automatically.
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const newActivity = (type, event, id) => {
    return {
        type: type,
        eventDate: event.date,
        hostedBy: event.hostedBy,
        title: event.title,
        photoURL: event.hostPhotoURL,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        hostUid: event.hostUid,
        eventId: id
    };
};


////////////////////////////////////////////////create activity////////////////////////////////////////////////////////
// 我们create一个 function，一个 event，同时我们create一个new DOC， 然后我们要extract 这个event的一些参数。
// 你console log的东西会出现在cloud functions的log中。
//与此同时我们往fire store 中加new collection activity， 把对应的event ID等也加进去
exports.createActivity = functions.firestore.document('events/{eventId}').onCreate(event => {
    let newEvent = event.data();

    console.log(newEvent);

    const activity = newActivity('newEvent', newEvent, event.id);

    console.log(activity);

    // then和ASYNC是一样的
    return admin
        .firestore()
        .collection('activity')
        .add(activity)
        .then(docRef => {
            return console.log('Activity created with id: ', docRef.id);
        })
        .catch(err => {
            return console.log('Error adding activity', err);
        });
});


////////////////////////////////////////////////cancel/update activity////////////////////////////////////////////////////////
// 所谓的update 就是 你cancel 之后 参数会有变化，例如cancel这个flag是true

exports.cancelActivity = functions.firestore.document('events/{eventId}').onUpdate((event, context) => {
    let updatedEvent = event.after.data();
    let previousEventData = event.before.data();
    console.log({ event });
    console.log({ context });
    console.log({ updatedEvent });
    console.log({ previousEventData });

    if (!updatedEvent.cancelled || updatedEvent.cancelled === previousEventData.cancelled) {
        return false;
    }

    const activity = newActivity('cancelledEvent', updatedEvent, context.params.eventId);

    console.log({ activity });

    return admin
        .firestore()
        .collection('activity')
        .add(activity)
        .then(docRef => {
            return console.log('Activity created with id: ', docRef.id);
        })
        .catch(err => {
            return console.log('Error adding activity', err);
        });
});
