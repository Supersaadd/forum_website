const express = require("express");
const Users = require("./entities/Users.js");
const Messages = require("./entities/Messages.js");
function init() {
    const router = express.Router();
    // On utilise JSON
    router.use(express.json());
    // simple logger for this router's requests
    // all requests to this router will first hit this middleware
    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });
    const users = new Users.default();
    const messages = new Messages.default();

    

    router.post("/user/login", async (req, res) => {
        try {
            const obj = req.body;
            // Erreur sur la requête HTTP
            if (!obj.login || !obj.password) {
                res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : login et password nécessaires"
                }); 
                return;
            }

            const login = obj.login.toLowerCase();
            const password = obj.password;
            if(! await users.exists(login)) {
                res.status(401).json({
                    status: 401,
                    message: "Uknown login"
                });
                return;
            }
            let user = await users.checkpassword(login, password);
            if (user) {
                if(user.role === "banned") {
                    res.status(403).json({
                        status: 403,
                        message: "You have been banned, you cannot access this forum"
                    });
                    return;
                }

                if(user.role==="waiting"){
                    res.status(403).json({
                        status: 403,
                        message: "Your account is waiting for validation, please try again later"
                    });
                    return;
                }

                // Avec middleware express-session
                req.session.regenerate(function (err) {
                    if (err) {
                        res.status(500).json({
                            status: 500,
                            message: "Erreur interne"
                        });
                    }
                    else {
                        // C'est bon, nouvelle session créé
                        req.session.userid = user._id.toHexString();
                        res.status(200).json({
                            status: 200,
                            user: user,
                            message: "Login et mot de passe accepté"
                        });
                    }
                });
                return;
            }
            // Faux login : destruction de la session et erreur
            req.session.destroy((err) => { });
            res.status(403).json({
                status: 403,
                message: "login et/ou le mot de passe invalide(s)"
            });
            return;
        }
        catch (e) {
            console.log(e);
            // Toute autre erreur
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    });

    router
        .route("/user/:user_id")
        .get(async (req, res) => {
        try {
            let userid = req.params.user_id;
            const user = await users.get(userid);
            if (!user)
                res.status(404).json(
            { message: "User not found" }
            );
            else
                res.send(user);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
        .delete((req, res, next) => {
            const user_id = req.params.user_id;
            users.delete(user_id)
                .then(() => res.status(204).send())
                .catch((err) => res.status(500).send(err));
        })



    router.get("/session", (req, res) => {
        if (req.session.userid) {
            res.status(200).send({ userid: req.session.userid });
        } else {
            res.status(401).send("Unauthorized");
        }
    })

    router.delete("/session", (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).send("Erreur interne");
            } else {
                res.status(204).send();
            }
        });
    });
    
    router.get("/users",(req,res) => {
        users.getAll()
        .then((users) => res.status(200).send(users))
        .catch((err) => res.status(500).send(err));
    });

    router.get("/usersWaiting",(req,res) => {
        users.getAllWaiting()
        .then((users) => res.status(200).send(users))
        .catch((err) => res.status(500).send(err));
    })
    
    router.get("/messages/userReplyingToMessage/:replyingTo", (req, res) => {
        messages.get(req.params.replyingTo)
        .then((message) => res.status(200).send(message.userid))
        .catch((err) => res.status(500).send(err));
        
    });

    router.put("/userRole/:user_id", (req, res) => {
        const { role } = req.body;
        if (!role) {
            res.status(400).send("Missing fields");
        } else {
            users.updateRole(req.params.user_id, role)
                .then(() => res.status(200).send())
                .catch((err) => res.status(500).send(err));
        }
    });

    router.post("/user/signup", async (req, res) => {
        const obj = req.body;
        const login = obj.login.toLowerCase();
        const password = obj.password;
        const email = obj.email;
        const firstname = obj.firstname;
        const lastname = obj.lastname;
        const birthdate = obj.birthdate;
        const account_created = obj.account_created;
        if (!login || !password || !email || !firstname || !lastname || !birthdate || !account_created) {
            res.status(400).json({
                status: 400,
                "message": "Invalid request : missing fields"
            });
            return;
        }
        if(await users.exists(login)){
            res.status(400).json({
                status: 400,
                "message": "Login already taken"
            });
            return;
        }
        users.create(login, password, lastname, firstname, email, birthdate, account_created)
            .then((user) => res.status(201).send(user))
            .catch((err) => res.status(500).send(err));
    });


    router.get("/messages", (req, res) => {
        messages.getAll()
        .then((messages) => res.status(200).send(messages))
        .catch((err) => res.status(500).send(err));
    });


    router.get("/messages/user/:userid", (req, res) => {
        messages.getAllFromUser(req.params.userid)
        .then((messages) => res.status(200).send(messages))
        .catch((err) => res.status(500).send(err));
    });

    router.get("/messages/replies/:messageid", (req, res) => {
        messages.getReplies(req.params.messageid)
        .then((replies) => res.status(200).send(replies))
        .catch((err) => res.status(500).send(err));
    });

    router.get("/messages/:messageid", (req, res) => {
        messages.get(req.params.messageid)
        .then((message) => res.status(200).send(message))
        .catch((err) => res.status(500).send(err));
    });

    router.delete("/messages/:messageid", (req, res) => {
        messages.delete(req.params.messageid)
        .then(() => res.status(204).send())
        .catch((err) => res.status(500).send())});

    router.get("/messages/forum/:forumid", (req, res) => {
        messages.getAllFromForum(req.params.forumid)
        .then((messages) => res.status(200).send(messages))
        .catch((err) => res.status(500).send(err));
    });


    router.get("/messages/nbreplies/:messageid",(req,res)=>{
        messages.getNbReplies(req.params.messageid)
        .then((nbReplies) => res.status(200).send(nbReplies))
        .catch((err) => res.status(500).send(err));
    })

    router.post("/message", async (req, res) => {
        const obj = req.body;
        const title = obj.title;
        const author = obj.userid;
        const replyingTo = obj.replyingTo;
        const forumId = obj.forumid;
        const content = obj.content;
        const date = obj.date;
        if (!author || !content || !date) {
            res.status(400).json({
                status: 400,
                "message": "Invalid request : missing fields"
            });
            return;
        }
        messages.create(title,content,date,author,replyingTo,forumId)
            .then((message) => res.status(201).send(message))
            .catch((err) => res.status(500).send(err));
    });

    router.get("/search/:search", (req, res) => {
        messages.search(req.params.search)
        .then((messages) => res.status(200).send(messages))
        .catch((err) => res.status(500).send(err));
    });

    router.get("/messages/isLikedBy/:messageid/:userid", (req, res) => {
        messages.isLikedByUser(req.params.messageid, req.params.userid)
        .then((isLiked) => res.status(200).send(isLiked))
        .catch((err) => res.status(500).send(err));
    });

    router.get("/messages/nbLikes/:messageid", (req, res) => {
        messages.getNbLikes(req.params.messageid)
        .then((nbLikes) => res.status(200).send(nbLikes))
        .catch((err) => res.status(500).send(err))});

    router.post("/messages/like/:messageid/:userid", (req, res) => {
        messages.addLike(req.params.messageid, req.params.userid)
        .then(() => res.status(200).send())
        .catch((err) => res.status(500).send(err))});

    router.delete("/messages/like/:messageid/:userid", (req, res) => {
        messages.removeLike(req.params.messageid, req.params.userid)
        .then(() => res.status(200).send())
        .catch((err) => res.status(500).send(err))});

    return router;
}
exports.default = init;

