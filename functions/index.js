const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { getToken } = require('./utils');
const { updateGraphNode } = require('./graphNodeHelpers');
const { getDataAndWriteToDB } = require('./latestNodeHelpers');
admin.initializeApp();

const DEVICE_LIST = ['SN000-045', 'SN000-046', 'SN000-049', 'SN000-062', 'SN000-067', 'SN000-072', 'SN000-114'];


/*************** FIREBASE CLOUD FUNCTIONS ***********************/
/**
 * This function iterates through each serial number in DEVICE_LIST and updates
 * its data in the Firebase Realtime Database with the most recent data from
 * Quant-AQ. This function can be manually triggered through its https endpoint.
 */
exports.fetchQuantAQ = functions.https.onRequest((request, response) => {
  getToken()
    .then(token => {
      for (sn of DEVICE_LIST) {
        getDataAndWriteToDB(token, sn);
      }
      return null;
    }).catch(e => console.log(e));
  response.send("Fetch is running asynchronously! The data will be in the database when it's done.");
})

/**
 * A scheduled version of fetchQuantAQ() which runs every 10 minutes.
 */
exports.fetchQuantAQScheduled = functions.pubsub.schedule('every 10 minutes').onRun((context) => {
  console.log("Fetching data from QuantAQ and writing to DB");
  getToken()
    .then(token => {
      for (sn of DEVICE_LIST) {
        getDataAndWriteToDB(token, sn);
      }
      return null;
    }).catch(e => console.log(e));
  return null;
})

/**
 * This function iterates through each serial number in DEVICE_LIST and updates
 * its graph node in the Firebase Realtime Database with the data point stored in its
 * latest node. It also removes any old data points in the graph node. This function
 * can be manually triggered through its https endpoint.
 */
exports.updateGraphNodes = functions.https.onRequest((request, response) => {
  getToken()
    .then(token => {
      for (sn of DEVICE_LIST) {
        updateGraphNode(token, sn);
      }
      return null;
    }).catch(e => console.log(e));
  response.send("Graph nodes updating asynchronously. See logs for progress.");
})

/**
 * Listen to updates to the latest field of each device and trigger updatedGraphNode()
 */
exports.updateGraphNodeListener = functions.database.ref('{sn}/latest')
  .onUpdate((change, context) => {
    const sn = context.params.sn;
    return getToken()
      .then(token => updateGraphNode(token, sn))
      .catch(e => console.log(e));
  })
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('messages').add({original: original});
    // Send back a message that we've successfully written the message
    res.json({result: `Message with ID: ${writeResult.id} added.`});
  });

  // Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
.onCreate((snap, context) => {
  // Grab the current value of what was written to Firestore.
  const original = snap.data().original;

  // Access the parameter `{documentId}` with `context.params`
  functions.logger.log('Uppercasing', context.params.documentId, original);
  
  const uppercase = original.toUpperCase();
  
  // You must return a Promise when performing asynchronous tasks inside a Functions such as
  // writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return snap.ref.set({uppercase}, {merge: true});
});