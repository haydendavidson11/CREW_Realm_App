exports = function(changeEvent) {
  const fullDocument = changeEvent.fullDocument;
  const userCollection = context.services.get("mongodb-atlas").db("Cool_Name_Here").collection("User");
  const companyCollection = context.services.get("mongodb-atlas").db("Cool_Name_Here").collection("Company");
  const docId = changeEvent.documentKey._id;
 
   if (fullDocument.type == "join" || fullDocument.type == "invite") {
    switch (fullDocument.status) {
       // if the request was accepted set the user.companyID to the companyDoc ID and the users role to the role given in the request
      case "accepted" :
         if ((fullDocument.type = "invite")) {
          console.log(`Request(${fullDocument.type}) from Company(${fullDocument.company}) to CrewMember(${fullDocument.crewMember}) accepted.`);
         } else {
           console.log(`Request(${fullDocument.type}) from CrewMember(${fullDocument.crewMember}) to Company(${fullDocument,company}) accepted`);
         }
         // update user Doc with company ID 
          userCollection.updateOne({"userName": `${fullDocument.crewMember}`}, { $set: {"companyID": `${fullDocument.company}`, "role": `${fullDocument.role}`}})
            .then(result => {
           const { matchedCount, modifiedCount } = result;
            if(matchedCount && modifiedCount) {
              console.log(`Successfully updated user companyID. and the user's role to ${fullDocument.role}`);
            }
          })
          .catch(err => console.error(`Failed to find user document for user ${fullDocument.crewMember}: ${err}`));
          
          // get the role from the request and add the crewMember to the apropriate group
          var companyRole = "";
          
          console.log("entering switch statement");
          switch (fullDocument.role) {
            case "Admin" : 
              companyRole = "admins";
              
              userCollection.findOne({ userName : fullDocument.crewMember }).then((doc) => {
                  // do something with doc
                  console.log(doc._id);
                  // userdoc = doc._id;
                  
                  
                  companyCollection.updateOne({"_id": fullDocument.company}, { $addToSet: { "admins": `${doc._id}`}})
                          .then(result => {
                        const { matchedCount, modifiedCount } = result;
                          if(matchedCount && modifiedCount) {
                            console.log(`Successfully added user(${fullDocument.crewMember}) to company's(${fullDocument.company}) ${companyRole}`);
                          } else{
                            console.log("Did not update any Company documents");
                          }
                        })
                        .catch(err => console.error(`Failed to find company document and add the user to the company: ${err}`));
                });
              
              break;
            case "Member" : 
              companyRole = "members";
              console.log("request role is Member");
                // add the crewMember to the company's members.  
                  userCollection.findOne({ userName : fullDocument.crewMember }).then((doc) => {
                  // do something with doc
                  console.log(doc._id);
                  // userdoc = doc._id;
                  
                  
                  companyCollection.updateOne({"_id": fullDocument.company}, { $addToSet: { "members": doc._id}})
                          .then(result => {
                        const { matchedCount, modifiedCount } = result;
                          if(matchedCount && modifiedCount) {
                            console.log(`Successfully added user(${fullDocument.crewMember}) to company's(${fullDocument.company}) ${companyRole}`);
                          } else{
                            console.log("Did not update any Company documents");
                          }
                        })
                        .catch(err => console.error(`Failed to find company document and add the user to the company: ${err}`));
                });
              
              break;
            case "Manager" :
              companyRole = "managers";
            
            userCollection.findOne({ userName : fullDocument.crewMember }).then((doc) => {
                  // do something with doc
                  console.log(doc._id);
                  // userdoc = doc._id;
                  
                  
                  companyCollection.updateOne({"_id": fullDocument.company}, { $addToSet: { "managers": `${doc._id}`}})
                          .then(result => {
                        const { matchedCount, modifiedCount } = result;
                          if(matchedCount && modifiedCount) {
                            console.log(`Successfully added user(${fullDocument.crewMember}) to company's(${fullDocument.company}) ${companyRole}`);
                          } else{
                            console.log("Did not update any Company documents");
                          }
                        })
                        .catch(err => console.error(`Failed to find company document and add the user to the company: ${err}`));
                });
            
            
            }
          
          break;
     
      // if the request was denied set the user.companyID to the null
      case "denied":
        if ((fullDocument.type = "invite")) {
            console.log(`Request(${fullDocument.type}) from Company(${fullDocument.company}) to CrewMember(${fullDocument.crewMember}) denied.`);
         } else {
           console.log(`Request(${fullDocument.type}) from CrewMember(${fullDocument.crewMember}) to Company(${fullDocument,company}) denied`);
         }
         // update userDoc to null 
          userCollection.updateOne({"userName": `${fullDocument.crewMember}`}, { $set: {"companyID": null, "role": null }})
            .then(result => {
           const { matchedCount, modifiedCount } = result;
            if(matchedCount && modifiedCount) {
              console.log(`Successfully updated user companyID.`);
            }
          })
          .catch(err => console.error(`Failed to find user document for user ${fullDocument.recipient}: ${err}`));
          break;
      
      case "pending":
        console.log(`Request(${docId}) created and status set to ${fullDocument.status}.`);
        userCollection.updateOne({"userName": `${fullDocument.crewMember}`}, { $set: {"companyID": "pending", "role": null }})
            .then(result => {
          const { matchedCount, modifiedCount } = result;
            if(matchedCount && modifiedCount) {
              console.log(`Successfully updated user companyID to pending.`);
            } 
          })
          .catch(err => console.error(`Failed to find user document for user ${fullDocument.recipient}: ${err}`));
          break;
        
    }
   } else  {
     
     // Shift request
     if (fullDocument.type == "shift") {
       console.log(`request type == ${fullDocument.type}`);
       switch (fullDocument.status) {
         case "accepted":
           console.log(`Request(${fullDocument.typ}) has been accepted by ${fullDocument.recipient}`);
           
           userCollection.updateOne({"userName": `${fullDocument.crewMember}`}, { $addToSet: {"userPreferences.schedule": fullDocument.shift}})
              .then(result => {
            const { matchedCount, modifiedCount } = result;
              if(matchedCount && modifiedCount) {
                console.log(`Successfully added shift to user schedule.`);
              } 
            })
            .catch(err => console.error(`Failed to find user document for user ${fullDocument.recipient}: ${err}`));
            
            const date = fullDocument.shift.date;
            switch (fullDocument.shift.type) {
         
              case "FullDay":
                
                userCollection.updateOne({"userName": `${fullDocument.crewMember}`}, { $pull: {"userPreferences.availability.2.dates": {$in : [date]}}})
              .then(result => {
            const { matchedCount, modifiedCount } = result;
              if(matchedCount && modifiedCount) {
                console.log(`Successfully removed date from Available dates.`);
              } else {
                console.log("No Dates removed from availability");
              } 
            })
            .catch(err => console.error(`Failed to find user document for user ${fullDocument.recipient}: ${err}`));
                
                
                break;
              case "Morning":
                
                 userCollection.updateOne({"userName": `${fullDocument.crewMember}`}, { $pull: {"userPreferences.availability.0.dates": {$in : [date]}}})
              .then(result => {
            const { matchedCount, modifiedCount } = result;
              if(matchedCount && modifiedCount) {
                console.log(`Successfully removed date from Available dates.`);
              } else {
                console.log("No Dates removed from availability");
              } 
            })
            .catch(err => console.error(`Failed to find user document for user ${fullDocument.recipient}: ${err}`));
                
                  
                break;
              case "Afternoon":
                
                
                 userCollection.updateOne({"userName": `${fullDocument.crewMember}`}, { $pull: {"userPreferences.availability.1.dates": {$in : [date]}}})
              .then(result => {
            const { matchedCount, modifiedCount } = result;
              if(matchedCount && modifiedCount) {
                console.log(`Successfully removed date from Available dates.`);
              } else {
                console.log("No Dates removed from availability");
              } 
            })
            .catch(err => console.error(`Failed to find user document for user ${fullDocument.recipient}: ${err}`));
                
                break;
            }
            
            
            
            break;
            
            
        case "denied": 
          console.log(`Request(${fullDocument.type}) denied by ${fullDocument.recipient}`);
          break;
       }
     }
     
     
     //Role Change request 
     if (fullDocument.type == "roleChange") {
       console.log(`request type == ${fullDocument.type}`);
       switch (fullDocument.status) {
         
         //role has been accepted
         case "accepted":
           console.log(`Request(${fullDocument.type}) has been accepted by ${fullDocument.recipient}`);
           
           userCollection.findOne({ userName : fullDocument.crewMember }).then((doc) => {
                  // do something with doc
                  console.log(doc._id);
                  // userdoc = doc._id;
           
           // remove crewMemberId from company role list 
               switch (doc.role) {
                case "Admin" : 
                      
                      // remove from admins
                      companyCollection.updateOne({"_id": fullDocument.company}, { $pull: { "admins": `${doc._id}`}})
                              .then(result => {
                            const { matchedCount, modifiedCount } = result;
                              if(matchedCount && modifiedCount) {
                                console.log(`Successfully removed user(${fullDocument.crewMember}) from company's(${fullDocument.company}) ${doc.role}s`);
                              } else{
                                console.log("Did not update any Company documents");
                              }
                            })
                            .catch(err => console.error(`Failed to find company document and remove the user from the company: ${err}`));
                  
                  break;
                case "Member" : 
                  console.log("request role is Member");
                      
                      //remove from members
                      companyCollection.updateOne({"_id": fullDocument.company}, { $pull: { "members": doc._id}})
                              .then(result => {
                            const { matchedCount, modifiedCount } = result;
                              if(matchedCount && modifiedCount) {
                                console.log(`Successfully removed user(${fullDocument.crewMember}) from company's(${fullDocument.company}) ${doc.role}s`);
                              } else{
                                console.log("Did not update any Company documents");
                              }
                            })
                            .catch(err => console.error(`Failed to find company document and remove the user from the company: ${err}`));
                  
                  break;
                case "Manager" :
                      
                      //remove from managers
                      companyCollection.updateOne({"_id": fullDocument.company}, { $pull: { "managers": `${doc._id}`}})
                              .then(result => {
                            const { matchedCount, modifiedCount } = result;
                              if(matchedCount && modifiedCount) {
                                console.log(`Successfully removed user(${fullDocument.crewMember}) from company's(${fullDocument.company}) ${doc.role}s`);
                              } else{
                                console.log("Did not update any Company documents");
                              }
                            })
                            .catch(err => console.error(`Failed to find company document and remove the user from the company: ${err}`));
                }
           });
           
           
           //Update the user's Role
           userCollection.updateOne({"userName": `${fullDocument.crewMember}`}, {$set: {"role": fullDocument.role}})
              .then(result => {
            const { matchedCount, modifiedCount } = result;
              if(matchedCount && modifiedCount) {
                console.log(`Successfully updated user:${fullDocument._id}'s role to ${fullDocument.role}`);
              } 
            })
            .catch(err => console.error(`Failed to find user document for user ${fullDocument._id}: ${err}`));
           
            
            
            // add CrewMember ID to company role list 
            switch (fullDocument.role) {
            case "Admin" : 
              
              userCollection.findOne({ userName : fullDocument.crewMember }).then((doc) => {
                  // do something with doc
                  console.log(doc._id);
                  // userdoc = doc._id;
                  
                  
                  companyCollection.updateOne({"_id": fullDocument.company}, { $addToSet: { "admins": `${doc._id}`}})
                          .then(result => {
                        const { matchedCount, modifiedCount } = result;
                          if(matchedCount && modifiedCount) {
                            console.log(`Successfully added user(${fullDocument.crewMember}) to company's(${fullDocument.company}) ${doc.role}s`);
                          } else{
                            console.log("Did not update any Company documents");
                          }
                        })
                        .catch(err => console.error(`Failed to find company document and add the user to the company: ${err}`));
                });
              
              break;
            case "Member" : 
              console.log("request role is Member");
                // add the crewMember to the company's members.  
                  userCollection.findOne({ userName : fullDocument.crewMember }).then((doc) => {
                  // do something with doc
                  console.log(doc._id);
                  // userdoc = doc._id;
                  
                  
                  companyCollection.updateOne({"_id": fullDocument.company}, { $addToSet: { "members": doc._id}})
                          .then(result => {
                        const { matchedCount, modifiedCount } = result;
                          if(matchedCount && modifiedCount) {
                            console.log(`Successfully added user(${fullDocument.crewMember}) to company's(${fullDocument.company}) ${doc.role}s`);
                          } else{
                            console.log("Did not update any Company documents");
                          }
                        })
                        .catch(err => console.error(`Failed to find company document and add the user to the company: ${err}`));
                });
              
              break;
            case "Manager" :
              
            
            userCollection.findOne({ userName : fullDocument.crewMember }).then((doc) => {
                  // do something with doc
                  console.log(doc._id);
                  // userdoc = doc._id;
                  
                  
                  companyCollection.updateOne({"_id": fullDocument.company}, { $addToSet: { "managers": `${doc._id}`}})
                          .then(result => {
                        const { matchedCount, modifiedCount } = result;
                          if(matchedCount && modifiedCount) {
                            console.log(`Successfully added user(${fullDocument.crewMember}) to company's(${fullDocument.company}) ${doc.role}s`);
                          } else{
                            console.log("Did not update any Company documents");
                          }
                        })
                        .catch(err => console.error(`Failed to find company document and add the user to the company: ${err}`));
                });
            }
            break;
            
        case "denied": 
          console.log(`Request(${fullDocument.type}) denied by ${fullDocument.recipient}`);
          break;
       }
     }
     
   }














};
