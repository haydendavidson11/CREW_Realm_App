exports = function(crewMemberID){
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
const userCollection = context.services.get("mongodb-atlas").db("Cool_Name_Here").collection("User");


// userCollection.findOne({ _id: crewMemberID }).then((doc) => {
//       // do something with doc
//       doc.companyID = "";
//       doc.role = "";
//       console.log("Updated")
//     })
//     .catch(err => console.log(`Could not remove companyID: ${err}`));

userCollection.updateOne({ _id : crewMemberID}, { $set: {"companyID": null, "role": null}})
            .then(result => {
           const { matchedCount, modifiedCount } = result;
            if(matchedCount && modifiedCount) {
              console.log(`Successfully removed user companyID. and the user's role`);
            }
          })
          .catch(err => console.error(`Failed to find user document for user ${crewMemberID}: ${err}`));


userCollection.updateOne({ _id : crewMemberID}, {$pull: {"userPreferences.schedule" : {crewMember: crewMemberID}}})
            .then(result => {
           const { matchedCount, modifiedCount } = result;
            if(matchedCount && modifiedCount) {
              console.log(`Successfully removed user schedule`);
            }
          })
          .catch(err => console.error(`Failed to find user document and remove schedule for user ${crewMemberID}: ${err}`));
};