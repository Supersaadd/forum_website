const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const uri = "mongodb+srv://idirchm:NRQnDsECkznPaKvz@organizasso.lfvs79x.mongodb.net/?retryWrites=true&w=majority&appName=OrganizAsso";
const client = new MongoClient(uri);
const db = client.db("OrganizAsso");
const Messages = require("./Messages.js");
const messages = new Messages.default();
class Users {
  constructor() {
    this.db = db;
  }



  

  create(login, password, lastname, firstname, email, birthdate, account_created) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) {
          reject(err);
        } else {
          db.collection("users").insertOne({
            login: login, 
            password: hash, 
            lastname: lastname, 
            firstname: firstname, 
            email: email,
            birthdate: new Date(birthdate),
            account_created: new Date(account_created),
            role: "waiting"})
          .then(() => resolve())
          .catch((err) => reject(err));
        }
      })
    });
  }

  get(userid) { //take the id of ther user and return the user corresponding WARNING: the id isn't the 'ObjectID' but the 'hexString'
    return new Promise((resolve, reject) => {
      let user = db.collection("users").findOne({_id: {$eq:new ObjectId(userid)}}, {projection: {password: 0}})
      if(!user) {
        //erreur
        reject();
      } else {
        resolve(user);
      }
    });
  }

  delete(userid) { //take the id of the user and delete the user corresponding WARNING: the id isn't the 'ObjectID' but the 'hexString'
    return new Promise((resolve, reject) => {
      db.collection("users").deleteOne({_id: {$eq:new ObjectId(userid)}})
      .then(async () => {
        await messages.deleteAllUserMessages(userid)
        resolve()
        }
      )
      .catch((err) => reject(err));
    });
  }

  async exists(login) { //take the login of the user and return the user ObjectID corresponding if the user exists 
    return new Promise((resolve, reject) => {
      console.log(login)
      let userid = db.collection("users").findOne({login:login}, {projection: {_id: 1}})
      if(!userid) {
        reject();
      } else {
        resolve(userid);
      }});
  }

  checkpassword(login, password) { //take the login and the password of the user and return the user ObjectID of the user if the password is correct
    return new Promise(async (resolve, reject) => {
      let user = await db.collection("users").findOne({login:login})
      if(!user) {
        //erreur
        reject();
      } else {
        bcrypt.compare(password, user.password, (err, result) => {
          if(err) {
            reject(err);
          } else if(result) {
            resolve(user);
          } else {
            resolve(null);
          }
        });
      }
    });
  }

  getAll() {
    return new Promise((resolve, reject) => {
      let users = db.collection("users").find().project({password: 0}).toArray()
      if(!users) {
        //erreur
        reject();
      } else {
        resolve(users);
      }
    });
  }

  getAllWaiting() {
    return new Promise((resolve, reject) => {
      let users = db.collection("users").find({role: "waiting"}).project({password: 0}).toArray()
      if(!users) {
        //erreur
        reject();
      } else {
        resolve(users);
      }
    });
  }
  updateRole(userid, role) {
    return new Promise((resolve, reject) => {
      db.collection("users").updateOne({_id: {$eq:new ObjectId(userid)}}, {$set: {role: role}})
      .then(() => resolve())
      .catch((err) => reject(err));
    });
  }
  
}

exports.default = Users;