// exports = function(arg){
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
// };

exports = function(changeEvent) {
  
  const fullDocument = changeEvent.fullDocument;
  const docId = changeEvent.documentKey._id;
  
  const userCollection = context.services.get("mongodb-atlas").db("Cool_Name_Here").collection("User");
  const userDoc = userCollection.findOne({ userName : fullDocument.crewMember });
  
  const companyCollection = context.services.get("mongodb-atlas").db("Cool_Name_Here").collection("Company");
  const companyDoc = companyCollection.findOne({ _id : fullDocument.company });
  
  const companyAdmins = [];
  const companyManagers = [];
  const companyAdminsAndManagers = [];
  
  //  get text friendly version of fullDocument.type and assign it to variable  
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
  
  // check to ensure we have a company doc and user doc from the change event.
  // if (companyDoc && userDoc) {
    console.log("Have company and user docs");
    
    // get everybody from the admins except the user and create a recipient list for notifications
    console.log("Going through admins");
    
    // companyCollection.findOne({ _id : fullDocument.company }).then((doc) => {
    //                         console.log(`found company ${doc._id}`);
    
   
    //           for (const admin in doc.admins) {
    //             console.log(`admin ${admin}`);
    //             if (admin != userDoc._id ) {
                  
    //               userCollection.findOne({ _id : admin }).then((userdoc) => {
    //                         console.log(`found user ${userdoc._id}`);
    //                         // get device token from the user if they have one and add it to the recipient list.
    //                         if (userdoc.deviceToken) {
    //                           console.log(`Have device token ${userdoc.deviceToken}`);
                              
    //                           // add to company admins
    //                           companyAdmins.push(userdoc.deviceToken);
    //                           // add to compnay admins and managers
    //                           companyAdminsAndManagers.push(userdoc.deviceToken);
                           
    //                         } else {
    //                           console.log(`No device token registered for user:${userdoc._id}`);
    //                         }
    //               })
    //               .catch((error) => {
    //                 console.log(`could not find user doc for admin: ${admin}:`, error);
    //               });
    //             }
    //           }
    //           console.log(`companyAdmins ${companyAdmins.legnth}`);
              
    //           // get everybody from the mangers execpt the user and create a recipient list for notifications
    //           console.log("Going through managers");
    //           for (const manager in doc.managers) {
    //             console.log(`manger: ${manager}`);
    //             if (manager!= userDoc._id) {
                  // userCollection.findOne({ _id : manager }).then((udoc) => {
                  //           console.log(`found user ${udoc._id}`);
                  //           // get device token from the user if they have one and add it to the recipient list.
                  //           if (udoc.deviceToken) {
                  //             console.log(`Have device token ${udoc.deviceToken}`);
                              
                  //           // add to company mangers
                  //             companyManagers.push(udoc.deviceToken);
                  //             // add to compnay admins and managers
                  //             companyAdminsAndManagers.push(udoc.deviceToken);
                           
                  //           } else {
                  //             console.log(`No device token registered for user:${udoc._id}`);
                  //           }
                  // })
                  // .catch((error) => {
                  //   console.log(`could not find user doc for manager:${manager}:`, error);
                  // });
    //             }
    //           }
    //   })
    //   .catch((error) => {
    //                 console.log('could not find company doc:', error);
    //               });
    
    
    userCollection.findOne({ userName : fullDocument.crewMember }).then((userDoc) => {
    
     companyCollection.findOne({ _id : fullDocument.company }).then((companyDoc) => {
                            console.log(`found company ${companyDoc._id}`);
    
   
                for (const admin of companyDoc.admins) {
                  console.log(`admin ${admin}`);
                  if (admin != userDoc._id ) {
                    userCollection.findOne({ _id : admin }).then((udoc) => {
                            console.log(`found user ${udoc._id}`);
                            // get device token from the user if they have one and add it to the recipient list.
                            if (udoc.deviceToken) {
                              console.log(`Have device token ${udoc.deviceToken}`);
                              
                            // add to company mangers
                              companyAdmins.push(udoc.deviceToken);
                              // add to compnay admins and managers
                              companyAdminsAndManagers.push(udoc.deviceToken);
                              console.log(`company Admins ${companyAdmins.length}`);
                              console.log(`manager and admins ${companyAdminsAndManagers.length}`);
                            
                            } else {
                              console.log(`No device token registered for user:${udoc._id}`);
                            }
                        })
                        .catch((error) => {
                          console.log(`could not find user doc for admin:${admin}:`, error);
                        });
                  
                }
              }
              console.log(`companyAdmins ${companyAdmins.legnth}`);
              
              // get everybody from the mangers execpt the user and create a recipient list for notifications
              console.log("Going through managers");
              for (const manager of companyDoc.managers) {
                console.log(`manager: ${manager}`);
                if (manager!= userDoc._id) {
                  
                  userCollection.findOne({ _id : manager }).then((managerdoc) => {
                            console.log(`found user ${managerdoc._id}`);
                            // get device token from the user if they have one and add it to the recipient list.
                            if (managerdoc.deviceToken) {
                              console.log(`Have device token ${managerdoc.deviceToken}`);
                              
                            // add to company mangers
                              companyManagers.push(managerdoc.deviceToken);
                              // add to compnay admins and managers
                              companyAdminsAndManagers.push(managerdoc.deviceToken);
                              console.log(`company Managers ${companyManagers.length}`);
                              console.log(`manager and admins ${companyAdminsAndManagers.length}`);
                           
                            } else {
                              console.log(`No device token registered for user:${managerdoc._id}`);
                            }
                          })
                          .catch((error) => {
                            console.log(`could not find user doc for manager:${manager}:`, error);
                          });
                }
              }
              
              //Starts Here
  //             switch (changeEvent.operationType) {
  //   // new request was made
  //   case "insert":
  //               // on fulldoc.type
  //               switch (fullDocument.type) {
  //               case "shift": 
                   
  //                 break;
  //               case "roleChange":
  //                 // new Role change request for company.
                   
                   
  //                 break;
  //               case "invite":
  //                 // new invite request for company 
                   
                   
  //                 break;
  //               case "join":
  //                 //  new join request for company
                  
  //                     switch (fullDocument.status) {
  //                         case "pending":
  //                           if (companyAdmins.length > 0) {
  //                             for (const admin of companyAdmins) {
  //                               const message = {
  //                                                   "to": `${admin}`,
  //                                                   "notification": {
  //                                                     "title": `New ${type} request.`,
  //                                                     "body": `${fullDocument.sender} wants to join your bussiness.`,
  //                                                   },
  //                                                 };
                
  //                                     // Send push notification
  //                                     const gcm = context.services.get('gcm');
  //                                     const result = gcm.send(message)
  //                                     .then((response) => {
  //                                           // Response is a message ID string.
  //                                           console.log('Successfully sent message:', response);
  //                                         })
  //                                         .catch((error) => {
  //                                           console.log('Error sending message:', error);
  //                                         });
  //                             }
  //                           }
  //                       }
                       
  //                     break;
  //             }
     
  //   break;
                
  //   // existing request has been updated
  //   case "update" :
  //     console.log("updating request doc");
  //           switch (fullDocument.type) {
  //             case "shift": 
  //               console.log("request type is shift");
  //               // shift request has been updated
                 
  //                     switch (fullDocument.status) {
  //                       case "accepted":
  //                         console.log("request status is accepted");
  //                           // if (companyAdminsAndManagers.length > 0) {
  //                               for (const person of companyAdminsAndManagers) {
  //                                 const message = {
  //                                                     "to": `${person}`,
  //                                                     "notification": {
  //                                                       "title": `Shift accepted!`,
  //                                                       "body": `${fullDocument.recipient} accepted their shift request!`,
  //                                                     },
  //                                                   };
                  
  //                                       // Send push notification
  //                                       const gcm = context.services.get('gcm')
  //                                       .catch((error) => {
  //                                             console.log('Error getting gcm:', error);
  //                                           });
  //                                       const result = gcm.send(message)
  //                                       .then((response) => {
  //                                             // Response is a message ID string.
  //                                             console.log('Successfully sent message:', response);
  //                                           })
  //                                           .catch((error) => {
  //                                             console.log('Error sending message:', error);
  //                                           });
  //                               }
  //                           // } else {
  //                           //   console.log("No compnay admins or managers");
  //                           // }
  //                           break;
  //                           case "denied":
  //                             // if (companyAdminsAndManagers.length > 0) {
  //                               for (const person of companyAdminsAndManagers) {
  //                                 const message = {
  //                                                     "to": `${person}`,
  //                                                     "notification": {
  //                                                       "title": `Shift declined!`,
  //                                                       "body": `${fullDocument.recipient} declined their shift request!`,
  //                                                     },
  //                                                   };
                  
  //                                       // Send push notification
  //                                       const gcm = context.services.get('gcm');
  //                                       const result = gcm.send(message)
  //                                       .then((response) => {
  //                                             // Response is a message ID string.
  //                                             console.log('Successfully sent message:', response);
  //                                           })
  //                                           .catch((error) => {
  //                                             console.log('Error sending message:', error);
  //                                           });
  //                               }
  //                           // }
  //                           break;
  //                     }
                 
                 
  //               break;
  //             case "roleChange":
  //               // role chnage request has been updated 
  //                     switch (fullDocument.status) {
  //                       case "accepted":
  //                         if (companyAdmins.length > 0) {
  //                           for (const admin of companyAdmins) {
  //                             const message = {
  //                                                 "to": `${admin}`,
  //                                                 "notification": {
  //                                                   "title": `New crew member role change`,
  //                                                   "body": `${fullDocument.recipient} accepted their new role`,
  //                                                 },
  //                                               };
              
  //                                   // Send push notification
  //                                   const gcm = context.services.get('gcm');
  //                                   const result = gcm.send(message)
  //                                   .then((response) => {
  //                                         // Response is a message ID string.
  //                                         console.log('Successfully sent message:', response);
  //                                       })
  //                                       .catch((error) => {
  //                                         console.log('Error sending message:', error);
  //                                       });
  //                           }
  //                         }
  //                         case "denied":
  //                           if (companyAdmins.length > 0) {
  //                           for (const admin of companyAdmins) {
  //                             const message = {
  //                                                 "to": `${admin}`,
  //                                                 "notification": {
  //                                                   "title": `New crew member role change`,
  //                                                   "body": `${fullDocument.recipient} declined their new role`,
  //                                                 },
  //                                               };
              
  //                                   // Send push notification
  //                                   const gcm = context.services.get('gcm');
  //                                   const result = gcm.send(message)
  //                                   .then((response) => {
  //                                         // Response is a message ID string.
  //                                         console.log('Successfully sent message:', response);
  //                                       })
  //                                       .catch((error) => {
  //                                         console.log('Error sending message:', error);
  //                                       });
  //                           }
  //                         }
  //                     }
                 
                 
  //               break;
  //             case "invite":
  //               // invite request has been updated
  //               switch (fullDocument.status) {
  //                 case "accepted":
  //                   if (companyAdminsAndManagers.length > 0) {
  //                     for (const person of companyAdminsAndManagers) {
  //                       const message = {
  //                                           "to": `${person}`,
  //                                           "notification": {
  //                                             "title": `Your have a new Crew Member!`,
  //                                             "body": `${fullDocument.recipient} joined your bussiness!`,
  //                                           },
  //                                         };
        
  //                             // Send push notification
  //                             const gcm = context.services.get('gcm');
  //                             const result = gcm.send(message)
  //                             .then((response) => {
  //                                   // Response is a message ID string.
  //                                   console.log('Successfully sent message:', response);
  //                                 })
  //                                 .catch((error) => {
  //                                   console.log('Error sending message:', error);
  //                                 });
  //                     }
  //                   }
                    
  //               }
                 
  //               break;
  //             case "join":
  //               // Join request has been updated 
                 
                 
                 
  //               break;
  //           }
      
  //               break;
                
                
  //   // existing requets has been deleted.
  //   case "delete" :
  // }
  // Ends here
  const result = context.functions.execute("SwitchNotificationTypeAndSend", changeEvent, companyAdmins, companyAdminsAndManagers);
      })
      .catch((error) => {
                    console.log('could not find company doc:', error);
                  });
    })
      .catch((error) => {
                    console.log('could not find user doc:', error);
                  });
    
    
    
    
    console.log(`company Managers ${companyManagers.count}`);
    console.log(`manager and admins ${companyAdminsAndManagers.count}`);
  
  
  
  

 
 
  
 // switch on change event Operation type 
 console.log("switching operation type ");
  // switch (changeEvent.operationType) {
  //   // new request was made
  //   case "insert":
  //               // on fulldoc.type
  //               switch (fullDocument.type) {
  //               case "shift": 
                   
  //                 break;
  //               case "roleChange":
  //                 // new Role change request for company.
                   
                   
  //                 break;
  //               case "invite":
  //                 // new invite request for company 
                   
                   
  //                 break;
  //               case "join":
  //                 //  new join request for company
                  
  //                     switch (fullDocument.status) {
  //                         case "pending":
  //                           if (companyAdmins.length > 0) {
  //                             for (const admin of companyAdmins) {
  //                               const message = {
  //                                                   "to": `${admin}`,
  //                                                   "notification": {
  //                                                     "title": `New ${type} request.`,
  //                                                     "body": `${fullDocument.sender} wants to join your bussiness.`,
  //                                                   },
  //                                                 };
                
  //                                     // Send push notification
  //                                     const gcm = context.services.get('gcm');
  //                                     const result = gcm.send(message)
  //                                     .then((response) => {
  //                                           // Response is a message ID string.
  //                                           console.log('Successfully sent message:', response);
  //                                         })
  //                                         .catch((error) => {
  //                                           console.log('Error sending message:', error);
  //                                         });
  //                             }
  //                           }
  //                       }
                       
  //                     break;
  //             }
     
  //   break;
                
  //   // existing request has been updated
  //   case "update" :
  //     console.log("updating request doc");
  //           switch (fullDocument.type) {
  //             case "shift": 
  //               console.log("request type is shift");
  //               // shift request has been updated
                 
  //                     switch (fullDocument.status) {
  //                       case "accepted":
  //                         console.log("request status is accepted");
  //                           if (companyAdminsAndManagers.length > 0) {
  //                               for (const person of companyAdminsAndManagers) {
  //                                 const message = {
  //                                                     "to": `${person}`,
  //                                                     "notification": {
  //                                                       "title": `Shift accepted!`,
  //                                                       "body": `${fullDocument.recipient} accepted their shift request!`,
  //                                                     },
  //                                                   };
                  
  //                                       // Send push notification
  //                                       const gcm = context.services.get('gcm')
  //                                       .catch((error) => {
  //                                             console.log('Error getting gcm:', error);
  //                                           });
  //                                       const result = gcm.send(message)
  //                                       .then((response) => {
  //                                             // Response is a message ID string.
  //                                             console.log('Successfully sent message:', response);
  //                                           })
  //                                           .catch((error) => {
  //                                             console.log('Error sending message:', error);
  //                                           });
  //                               }
  //                           } else {
  //                             console.log("No compnay admins or managers");
  //                           }
  //                           break;
  //                           case "denied":
  //                             if (companyAdminsAndManagers.length > 0) {
  //                               for (const person of companyAdminsAndManagers) {
  //                                 const message = {
  //                                                     "to": `${person}`,
  //                                                     "notification": {
  //                                                       "title": `Shift declined!`,
  //                                                       "body": `${fullDocument.recipient} declined their shift request!`,
  //                                                     },
  //                                                   };
                  
  //                                       // Send push notification
  //                                       const gcm = context.services.get('gcm');
  //                                       const result = gcm.send(message)
  //                                       .then((response) => {
  //                                             // Response is a message ID string.
  //                                             console.log('Successfully sent message:', response);
  //                                           })
  //                                           .catch((error) => {
  //                                             console.log('Error sending message:', error);
  //                                           });
  //                               }
  //                           }
  //                           break;
  //                     }
                 
                 
  //               break;
  //             case "roleChange":
  //               // role chnage request has been updated 
  //                     switch (fullDocument.status) {
  //                       case "accepted":
  //                         if (companyAdmins.length > 0) {
  //                           for (const admin of companyAdmins) {
  //                             const message = {
  //                                                 "to": `${admin}`,
  //                                                 "notification": {
  //                                                   "title": `New crew member role change`,
  //                                                   "body": `${fullDocument.recipient} accepted their new role`,
  //                                                 },
  //                                               };
              
  //                                   // Send push notification
  //                                   const gcm = context.services.get('gcm');
  //                                   const result = gcm.send(message)
  //                                   .then((response) => {
  //                                         // Response is a message ID string.
  //                                         console.log('Successfully sent message:', response);
  //                                       })
  //                                       .catch((error) => {
  //                                         console.log('Error sending message:', error);
  //                                       });
  //                           }
  //                         }
  //                         case "denied":
  //                           if (companyAdmins.length > 0) {
  //                           for (const admin of companyAdmins) {
  //                             const message = {
  //                                                 "to": `${admin}`,
  //                                                 "notification": {
  //                                                   "title": `New crew member role change`,
  //                                                   "body": `${fullDocument.recipient} declined their new role`,
  //                                                 },
  //                                               };
              
  //                                   // Send push notification
  //                                   const gcm = context.services.get('gcm');
  //                                   const result = gcm.send(message)
  //                                   .then((response) => {
  //                                         // Response is a message ID string.
  //                                         console.log('Successfully sent message:', response);
  //                                       })
  //                                       .catch((error) => {
  //                                         console.log('Error sending message:', error);
  //                                       });
  //                           }
  //                         }
  //                     }
                 
                 
  //               break;
  //             case "invite":
  //               // invite request has been updated
  //               switch (fullDocument.status) {
  //                 case "accepted":
  //                   if (companyAdminsAndManagers.length > 0) {
  //                     for (const person of companyAdminsAndManagers) {
  //                       const message = {
  //                                           "to": `${person}`,
  //                                           "notification": {
  //                                             "title": `Your have a new Crew Member!`,
  //                                             "body": `${fullDocument.recipient} joined your bussiness!`,
  //                                           },
  //                                         };
        
  //                             // Send push notification
  //                             const gcm = context.services.get('gcm');
  //                             const result = gcm.send(message)
  //                             .then((response) => {
  //                                   // Response is a message ID string.
  //                                   console.log('Successfully sent message:', response);
  //                                 })
  //                                 .catch((error) => {
  //                                   console.log('Error sending message:', error);
  //                                 });
  //                     }
  //                   }
                    
  //               }
                 
  //               break;
  //             case "join":
  //               // Join request has been updated 
                 
                 
                 
  //               break;
  //           }
      
  //               break;
                
                
  //   // existing requets has been deleted.
  //   case "delete" :
  // }
  
};


