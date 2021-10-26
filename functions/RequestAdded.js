exports = function(changeEvent) {
  /*
    A Database Trigger will always call a function with a changeEvent.
    Documentation on ChangeEvents: https://docs.mongodb.com/manual/reference/change-events/

    Access the _id of the changed document:
    const docId = changeEvent.documentKey._id;

    Access the latest version of the changed document
    (with Full Document enabled for Insert, Update, and Replace operations):
    const fullDocument = changeEvent.fullDocument;

    const updateDescription = changeEvent.updateDescription;

    See which fields were changed (if any):
    if (updateDescription) {
      const updatedFields = updateDescription.updatedFields; // A document containing updated fields
    }

    See which fields were removed (if any):
    if (updateDescription) {
      const removedFields = updateDescription.removedFields; // An array of removed fields
    }

    Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.

    Access a mongodb service:
    const collection = context.services.get("mongodb-atlas").db("Cool_Name_Here").collection("Request");
    const doc = collection.findOne({ name: "mongodb" });

    Note: In Atlas Triggers, the service name is defaulted to the cluster name.

    Call other named functions if they are defined in your application:
    const result = context.functions.execute("function_name", arg1, arg2);

    Access the default http client and execute a GET request:
    const response = context.http.get({ url: <URL> })

    Learn more about http client here: https://docs.mongodb.com/realm/functions/context/#context-http
  */
  
  const fullDocument = changeEvent.fullDocument;
  const userCollection = context.services.get("mongodb-atlas").db("Cool_Name_Here").collection("User");
  const docId = changeEvent.documentKey._id;
  
 var type = "";
 
 switch (fullDocument.type) {
   case "shift": 
     type = "shift";
     break;
   case "roleChange":
     type = "role change";
     break;
   case "invite":
     type = "invite";
     break;
   case "join":
     type = "join";
     break;
 }
  
      userCollection.findOne({ userName : fullDocument.crewMember }).then((doc) => {
                  // do something with doc
                  console.log(doc._id);
                  // userdoc = doc._id;
                  if (doc.deviceToken) {
                    console.log(`Have device token ${doc.deviceToken}`);
                 
                    
                    const message = {
                                      "to": `${doc.deviceToken}`,
                                      "notification": {
                                        "title": `New ${type} request.`,
                                        "body": "Open for details.",
                                      },
                                    };
  
                        // Send push notification
                        const gcm = context.services.get('gcm');
                        const result = gcm.send(message)
                        .then((response) => {
                              // Response is a message ID string.
                              console.log('Successfully sent message:', response);
                            })
                            .catch((error) => {
                              console.log('Error sending message:', error);
                            });
                  } else {
                    console.log(`No device token registered for user:${doc._id}`);
                  }
                
                });
  
  
  
  
  
  
  
  
  
  
  
  
  
  
};
