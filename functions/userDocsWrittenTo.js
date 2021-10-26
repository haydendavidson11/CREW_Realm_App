exports = function(changeEvent) {
   const db = context.services.get("mongodb-atlas").db("Cool_Name_Here");
   const crewMember = db.collection("CrewMember");
   const requests = db.collection("Request");
   const userCollection = db.collection("User");
   const docId = changeEvent.documentKey._id;
   const user = changeEvent.fullDocument;
   console.log(`Mirroring user for docId=${docId}. operationType = ${changeEvent.operationType}`);
   switch (changeEvent.operationType) {
      case "insert":
        
        requests.findOne({"recipient" : user.userName }).then((doc) => {
                  // do something with doc
                  console.log(`found pending request(${doc._id}) for user(${docId})`);
                  // if (doc.recipient == user.data.email) {
                    userCollection.updateOne({"_id": `${docId}`}, { $set: {"companyID": "pending"}})
            .then(result => {
           const { matchedCount, modifiedCount } = result;
            if(matchedCount && modifiedCount) {
              console.log(`Successfully updated user companyID.`);
            }
          })
          .catch(err => console.error(`Failed to find user document for user ${userdoc._id}: ${err}`));
                  // }
                })
                .catch(err => console.log(`No pending request document for user ${docId}: ${err}`));
        break;
        
      case "replace":
      case "update":
      console.log(`Writing data for ${user.userName}`);

      
      var CrewMemberDoc = {
            _id: user._id,
            partition: "public=public",
            userName: user.userName
            
           
      };
      
       if (user.companyID) {
              CrewMemberDoc.companyID = user.companyID;
            }
            
      if (user.role) {
        CrewMemberDoc.role = user.role;
      }
            
      if (user.userPreferences) {
            const prefs = user.userPreferences;
            CrewMemberDoc.displayName = prefs.displayName;
            CrewMemberDoc.bio = prefs.bio;
            CrewMemberDoc.availability = prefs.availability;
            CrewMemberDoc.shareContactInfo = prefs.shareContactInfo;
            
            if (prefs.schedule) {
            CrewMemberDoc.schedule = prefs.schedule;
            
            
            }
            
            if (prefs.avatarImage && prefs.avatarImage._id) {
               console.log(`Copying avatarImage`);
               CrewMemberDoc.avatarImage = prefs.avatarImage;
               console.log(`id of avatarImage = ${prefs.avatarImage._id}`);
            }
            const shareContact = prefs.shareContactInfo;
            
            if (shareContact) {
              
              CrewMemberDoc.email = user.userName;
              CrewMemberDoc.phone = prefs.phoneNumber;
              CrewMemberDoc.address = prefs.address;
              
            } else {
              console.log("Crew Member no sharing contact info.");
            }
            
            // if (prefs.availability) {
            //   crewMember.availability = prefs.availability;
            // }
            
            // if (prefs.schedule) {
            //   for (const setOfDays of prefs.schedule) {
            //     CrewMemberDoc.schedule.append(setOfDays);
            //   }
            //   // CrewMemberDoc.schedule = prefs.schedule;
            // }
      }
      crewMember.replaceOne({ _id: user._id }, CrewMemberDoc, { upsert: true })
      .then (() => {
            console.log(`Wrote CrewMember document for _id: ${docId}`);
      }, error => {
            console.log(`Failed to write CrewMember document for _id=${docId}: ${error}`);
      });
      break;
      case "delete":
      crewMember.deleteOne({_id: docId})
      .then (() => {
            console.log(`Deleted CrewMember document for _id: ${docId}`);
      }, error => {
            console.log(`Failed to delete CrewMember document for _id=${docId}: ${error}`);
      });
      break;
   }
};