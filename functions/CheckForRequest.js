exports = function() {
 const cluster = context.services.get("mongodb-atlas");
  const requests = cluster.db("Cool_Name_Here").collection("Request");
  const currentUser = context.user;
  // ... paste snippet here ...
  
  return requests.findOne({"recipient": currentUser.userName})
  .then(result => {
    if(result) {
      console.log(`Successfully found document: ${result}.`);
      
    } else {
      console.log("No document matches the provided query.");
    }
    return result;
  })
  .catch(err => console.error(`Failed to find document: ${err}`));
}