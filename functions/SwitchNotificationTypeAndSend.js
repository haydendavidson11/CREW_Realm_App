exports = function(changeEvent, companyAdmins, companyAdminsAndManagers){
  /*
    Accessing application's values:
    var x = context.values.get("value_name");

    Accessing a mongodb service:
    var collection = context.services.get("mongodb-atlas").db("dbname").collection("coll_name");
    collection.findOne({ owner_id: context.user.id }).then((doc) => {
      // do something with doc
    });

    To call other named functions:
    var result = context.functions.execute("function_name", arg1, arg2);

    Try running in the console below.
  */
  // return {arg: arg};
  
  const fullDocument = changeEvent.fullDocument;
  
  switch (changeEvent.operationType) {
    // new request was made
    case "insert":
                // on fulldoc.type
                switch (fullDocument.type) {
                 case "shift": 
                   
                   break;
                 case "roleChange":
                   // new Role change request for company.
                   
                   
                   break;
                 case "invite":
                  // new invite request for company 
                   
                   
                   break;
                 case "join":
                  //  new join request for company
                  
                      switch (fullDocument.status) {
                           case "pending":
                             if (companyAdmins.length > 0) {
                               for (const admin of companyAdmins) {
                                 const message = {
                                                    "to": `${admin}`,
                                                    "notification": {
                                                      "title": `New ${type} request.`,
                                                      "body": `${fullDocument.sender} wants to join your bussiness.`,
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
                               }
                             }
                         }
                       
                       break;
               }
     
    break;
                
    // existing request has been updated
    case "update" :
      console.log("updating request doc");
            switch (fullDocument.type) {
               case "shift": 
                 console.log("request type is shift");
                 // shift request has been updated
                 
                       switch (fullDocument.status) {
                         case "accepted":
                           console.log("request status is accepted");
                            if (companyAdminsAndManagers.length > 0) {
                                for (const person of companyAdminsAndManagers) {
                                  const message = {
                                                      "to": `${person}`,
                                                      "notification": {
                                                        "title": `Shift accepted!`,
                                                        "body": `${fullDocument.recipient} accepted their shift request!`,
                                                      },
                                                    };
                  
                                        // Send push notification
                                        const gcm = context.services.get('gcm')
                                        .catch((error) => {
                                              console.log('Error getting gcm:', error);
                                            });
                                        const result = gcm.send(message)
                                        .then((response) => {
                                              // Response is a message ID string.
                                              console.log('Successfully sent message:', response);
                                            })
                                            .catch((error) => {
                                              console.log('Error sending message:', error);
                                            });
                                }
                            } else {
                              console.log("No compnay admins or managers");
                            }
                            break;
                            case "denied":
                              if (companyAdminsAndManagers.length > 0) {
                                for (const person of companyAdminsAndManagers) {
                                  const message = {
                                                      "to": `${person}`,
                                                      "notification": {
                                                        "title": `Shift declined!`,
                                                        "body": `${fullDocument.recipient} declined their shift request!`,
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
                                }
                            }
                            break;
                       }
                 
                 
                 break;
               case "roleChange":
                 // role chnage request has been updated 
                       switch (fullDocument.status) {
                         case "accepted":
                           if (companyAdmins.length > 0) {
                             for (const admin of companyAdmins) {
                               const message = {
                                                  "to": `${admin}`,
                                                  "notification": {
                                                    "title": `New crew member role change`,
                                                    "body": `${fullDocument.recipient} accepted their new role`,
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
                             }
                           }
                          case "denied":
                            if (companyAdmins.length > 0) {
                             for (const admin of companyAdmins) {
                               const message = {
                                                  "to": `${admin}`,
                                                  "notification": {
                                                    "title": `New crew member role change`,
                                                    "body": `${fullDocument.recipient} declined their new role`,
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
                             }
                           }
                       }
                 
                 
                 break;
               case "invite":
                // invite request has been updated
                switch (fullDocument.status) {
                  case "accepted":
                    if (companyAdminsAndManagers.length > 0) {
                      for (const person of companyAdminsAndManagers) {
                        const message = {
                                            "to": `${person}`,
                                            "notification": {
                                              "title": `Your have a new Crew Member!`,
                                              "body": `${fullDocument.recipient} joined your bussiness!`,
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
                      }
                    }
                    
                }
                 
                 break;
               case "join":
                 // Join request has been updated 
                 
                 
                 
                 break;
            }
      
                break;
                
                
    // existing requets has been deleted.
    case "delete" :
  }
};