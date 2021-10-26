



exports = function({user}) {
  const cluster = context.services.get("mongodb-atlas");
  const users = cluster.db("Cool_Name_Here").collection("User");
  const requests = cluster.db("Cool_Name_Here").collection("Request");
  const currentUser = context.user;
  const userPreferences = {
      };
  console.log(user);
  const userDoc = {
    _id: user.id,
    partition: `user=${user.id}`,
    userName: user.data.email,
    userPreferences: null,
    // companyID: "",
    // role: null
  };

  // requests.findOne({"recipient" : user.data.email }).then((doc) => {
  //                 // do something with doc
  //                 console.log(`found pending request(${doc._id}) for user(${userDoc._id})`);
  //                 // if (doc.recipient == user.data.email) {
  //                     userDoc.companyID = "pending";
  //                 // }
  //               })
  //               .catch(err => console.log(`No pending request document for user ${userDoc._id}: ${err}`));
  
  
  
  // if (request.recipient == user.userName) {
  //   userDoc.companyID = "pending";
  //   console.log("User has pending request to join a company and the companyId was set to pending ");
  // } else {
  //   console.log("No request found for user companyID == null");
  // }
  
  // const requestDoc = context.functions.execute("CheckForRequest");
  
  // if (requestDoc.recipient == currentUser.userName) {
  //   userDoc.companyID = "pending";
  //   console.log(`Found request for user and successfully updated user companyID.`);
  // } else {
  //   console.log("`No request found for user.");
  // }
  
  return users.insertOne(userDoc);
};


  