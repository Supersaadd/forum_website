const MongoClient = require("mongodb").MongoClient;
const { throws } = require("assert");
const { ObjectId } = require("mongodb");
const { resolve } = require("path");
const uri = "mongodb+srv://idirchm:NRQnDsECkznPaKvz@organizasso.lfvs79x.mongodb.net/?retryWrites=true&w=majority&appName=OrganizAsso";
const client = new MongoClient(uri);
const db = client.db("OrganizAsso");
class Messages {
  constructor() {
    this.db = db;
  }

  create(title,content,date,author,replyingTo,forumid) {
    return new Promise((resolve, reject) => {
      db.collection("messages").insertOne({
        title: title, 
        content: content, 
        date: new Date(date), 
        userid: new ObjectId(author), 
        replyingTo: replyingTo ? new ObjectId(replyingTo) : null,
        forumId: forumid,
        likes:[]
    })
        .then(() => resolve())
        .catch((err) => reject(err));
      });
    }

    get(messageid) {//take the id of the message and return the message corresponding WARNING: the id isn't the 'ObjectID' but the 'hexString'
        return new Promise((resolve, reject) => {
            let message = db.collection("messages").findOne({_id: {$eq:new ObjectId(messageid)}});
            if(!message) {
                reject();
            } else {
                resolve(message);
            }
        });
    }

    getNbReplies(messageid) {
        return new Promise((resolve, reject) => {
            db.collection("messages").find({replyingTo: {$eq:new ObjectId(messageid)}}).toArray()
            .then((messages) => resolve(messages.length.toString()))
            .catch((err) => reject(err));
        });
    }

    getReplies(messageid) {
        return new Promise((resolve, reject) => {
            db.collection("messages").find({replyingTo: {$eq:new ObjectId(messageid)}}).toArray()
            .then((messages) => resolve(messages))
            .catch((err) => reject(err));
        });
    }

    getAll(){
        return new Promise((resolve, reject) => {
            db.collection("messages").find().toArray()
            .then((messages) => resolve(messages))
            .catch((err) => reject(err));
        });
    }

    getAllFromForum(forumid){
        return new Promise((resolve, reject) => {
            db.collection("messages").find({forumid: {$eq:forumid}}).toArray()
            .then((messages) => resolve(messages))
            .catch((err) => reject(err));
        });
    }

    getAllFromUser(userid){
        return new Promise((resolve, reject) => {
            db.collection("messages").find({userid: {$eq:new ObjectId(userid)}}).toArray()
            .then((messages) => resolve(messages))
            .catch((err) => reject(err));
        });
    }

    delete(messageid){ //doit supprimer recursivement les reponses aux reponses 
         return new Promise((resolve, reject) => {
            try{
                this.deleteReplies(messageid);
                resolve();
            }
            catch(err){
                reject(err);
         }})}


    deleteAllUserMessages(userid){
        return new Promise((resolve, reject) => {
            db.collection("messages").find({userid: {$eq:new ObjectId(userid)}}).toArray().then((messages) => {
                for(let i = 0; i < messages.length; i++){
                    this.delete(messages[i]._id);
                }
                resolve();
            })
        })};
    

    async deleteReplies(messageid){
        if(await db.collection("messages").findOne({_id: {$eq:new ObjectId(messageid)}}) == null){
            return;
        }
        let replies = await db.collection("messages").find({replyingTo: {$eq:new ObjectId(messageid)}}).toArray();
        console.log(replies);
        if(replies.length == 0){
            await db.collection("messages").deleteOne({_id: {$eq:new ObjectId(messageid)}});
        } else {
            for(let i = 0; i < replies.length; i++){
                this.deleteReplies(replies[i]._id);
                await db.collection("messages").deleteOne({_id: {$eq:new ObjectId(messageid)}});
            }

        }
    }

    getNbLikes(messageid){
        return new Promise((resolve, reject) => {
            db.collection("messages").findOne({_id: {$eq:new ObjectId(messageid)}})
            .then((message) => {
                if(message.likes){
                    resolve(message.likes.length.toString());
                } else {
                    resolve("0");
                }})
            .catch((err) => reject(err));
        });
    }

    addLike(messageid,userid){
        return new Promise((resolve, reject) => {
            db.collection("messages").updateOne({_id: {$eq:new ObjectId(messageid)}}, {$push: {likes: new ObjectId(userid)}})
            .then(() => resolve())
            .catch((err) => reject(err));
        });
    }

    removeLike(messageid,userid){
        return new Promise((resolve, reject) => {
            db.collection("messages").updateOne({_id: {$eq:new ObjectId(messageid)}}, {$pull: {likes: new ObjectId(userid)}})
            .then(() => resolve())
            .catch((err) => reject(err));
        });
    }

    isLikedByUser(messageid,userid){
        return new Promise((resolve, reject) => {
            db.collection("messages").findOne({_id: {$eq:new ObjectId(messageid)}, likes: {$in: [new ObjectId(userid)]}})
            .then((message) => resolve(message != null))
            .catch((err) => reject(err));
        });
    }



    search(search){
        return new Promise((resolve, reject) => {
            db.collection("messages").find({$text: {$search: search}}).toArray()
            .then((messages) => resolve(messages))
            .catch((err) => reject(err));
        });
    }
}

exports.default = Messages;