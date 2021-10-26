exports = function({user}) {
  const cluster = context.services.get("mongodb-atlas");
  const crewMember = cluster.db("Cool_Name_Here").collection("CrewMember");
  console.log(user)
  const CrewMemberDoc = {
    _id: user.id,
    partition: `user=${user.id}`,
    firstName: user.firstName,
    lastName: user.lastName,
    experience: 0,
    role: "installer",
    phonenumber: user.phonenumber,
    address: user.address,
    avatarImage: user.userPreferences.avatarImage
  }    
  return crewMember.insertOne(CrewMemberDoc);
};