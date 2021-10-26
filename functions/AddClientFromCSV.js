exports = function(changeEvent) {
  const cluster = context.services.get("mongodb-atlas");
  const CSV = cluster.db("Cool_Name_Here").collection("CSVClient");
  const docId = changeEvent.documentKey._id;
  const client = cluster.db("Cool_Name_Here").collection("Client");
  const CSVClient = changeEvent.fullDocument;
 
  
  
  const addressDoc = {
    street: `${CSVClient.Street}`,
    city: CSVClient.City,
    state: CSVClient.State,
    zip: `${CSVClient.Zip}`,
    country: CSVClient.Country
  }
  
  const ClientDoc = {
    _id: `${docId}`,
    partition: "public=public",
    firstName: CSVClient.FirstName,
    lastName: CSVClient.LastName,
    address: addressDoc,
    phoneNumber: `${CSVClient.Phone}`,
    email: CSVClient.Email,
    category: "Needs Estimate"
  }    
  return client.insertOne(ClientDoc);
};


