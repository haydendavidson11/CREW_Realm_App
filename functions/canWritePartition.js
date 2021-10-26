exports = function(partition) {
console.log(`Checking if can sync a write for partition = ${partition}`);
const db = context.services.get("mongodb-atlas").db("Cool_Name_Here");
const userCollection = db.collection("User");
const clientCollection = db.collection("Client");
const user = context.user;
let partitionKey = "";
let partitionValue = "";
const splitPartition = partition.split("=");
if (splitPartition.length == 2) {
   partitionKey = splitPartition[0];
   partitionValue = splitPartition[1];
   console.log(`Partition key = ${partitionKey}; partition value = ${partitionValue}`)
} else {
   console.log(`Couldn't extract the partition key/value from ${partition}`)
   return false;
}
   switch (partitionKey) {
   case "user":
      console.log(`Checking if partitionKey(${partitionValue}) matches user.id(${user.id}) – ${partitionValue === user.id}`)
      console.log(`partitionValue  = user.id - (${partitionValue === user.id})`)
      return partitionValue === user.id;
   case "public":
      console.log(`Any user can write all public data`)
      return true;
   default:
      console.log(`Unexpected partition key: ${partitionKey}`);
      return false;
   }
};