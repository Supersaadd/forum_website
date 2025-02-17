export const messages=[{
    "_id": {
      "$oid": "6608003717aaa7bc011f69a1"
    },
    "title": "Comment centrer une div ? ",
    "content": "Quelqu'un sait comment on centre une div en css svp ?",
    "date": "12/12/2021",
    "userid": {
      "$oid": "6607ff6417aaa7bc011f6999"
    },
    "replyingTo": null,
    "forumId": 1
  },
  {
    "_id": {
      "$oid": "6608003717aaa7bc011f69a2"
    },
    "title": "Incroyable ce forum",
    "content": "Je suis le seul à trouver ce forum incroyable ?",
    "date": "12/12/2021",
    "userid": {
      "$oid": "6607ff6417aaa7bc011f699a"
    },
    "replyingTo": null,
    "forumId": 1
  },
  {
    "_id": {
      "$oid": "6608003717aaa7bc011f69a3"
    },
    "title": "Comment on cree un serveur en nodejs ?",
    "content": "Je veux creer un serveur en nodejs, quelqu'un peut m'aider svp ?",
    "date": "12/12/2021",
    "userid": {
      "$oid": "6607ff6417aaa7bc011f699b"
    },
    "replyingTo": null,
    "forumId": 1
  },
  {
    "_id": {
      "$oid": "6608003717aaa7bc011f69a4"
    },
    "title": null,
    "content": "Je pense que tu peux utiliser la propriété display:flex en css pour centrer une div",
    "date": "12/12/2021",
    "userid": {
      "$oid": "6607ff6417aaa7bc011f699a"
    },
    "replyingTo": {
      "$oid": "6608003717aaa7bc011f69a1"
    },
    "forumId": 1
  },
  {
    "_id": {
      "$oid": "6608003717aaa7bc011f69a5"
    },
    "title": null,
    "content": "Tu peux utiliser la propriété margin:auto en css",
    "date": "12/12/2021",
    "userid": {
      "$oid": "6607ff6417aaa7bc011f699c"
    },
    "replyingTo": {
      "$oid": "6608003717aaa7bc011f69a1"
    },
    "forumId": 1
  },
  {
    "_id": {
      "$oid": "6608003717aaa7bc011f69a6"
    },
    "title": null,
    "content": "Tu peux utiliser la librairie express pour creer un serveur en nodejs",
    "date": "12/12/2021",
    "userid": {
      "$oid": "6607ff6417aaa7bc011f699d"
    },
    "replyingTo": {
      "$oid": "6608003717aaa7bc011f69a3"
    },
    "forumId": 1
  },
  {
    "_id": {
      "$oid": "6608003717aaa7bc011f69a7"
    },
    "title": "Ceci est un message privé",
    "content": "Ceci est un message privé",
    "date": "12/12/2021",
    "userid": {
      "$oid": "6607ff6417aaa7bc011f6999"
    },
    "replyingTo": null,
    "forumId": 2
  }]

export const users=[{
    "_id": {
      "$oid": "6607ff6417aaa7bc011f6999"
    },
    "firstname": "Idir",
    "lastname": "Chami",
    "login": "idirkbyl",
    "password": "1234",
    "email": "idirchm@gmail.com",
    "birthdate": "17/08/2003",
    "account_created": "12/12/2021",
    "role": "admin"
  },
  {
    "_id": {
      "$oid": "6607ff6417aaa7bc011f699a"
    },
    "firstname": "Nadir",
    "lastname": "Ait Kheddache",
    "login": "nadirlekabyle",
    "password": "1234",
    "email": "nadir@gmail.com",
    "birthdate": "15/02/1997",
    "account_created": "12/12/2021",
    "role": "admin"
  },
  {
    "_id": {
      "$oid": "6607ff6417aaa7bc011f699b"
    },
    "firstname": "Maria",
    "lastname": "Saad",
    "login": "mariasaad",
    "password": "1234",
    "email": "maria@gmail.com",
    "birthdate": "12/12/1990",
    "account_created": "12/12/2021",
    "role": "user"
  },
  {
    "_id": {
      "$oid": "6607ff6417aaa7bc011f699c"
    },
    "firstname": "Axel",
    "lastname": "Zahreb",
    "login": "axelzhrb",
    "password": "1234",
    "email": "axel@gmail.com",
    "birthdate": "12/12/1990",
    "account_created": "12/12/2021",
    "role": "user"
  },
  {
    "_id": {
      "$oid": "6607ff6417aaa7bc011f699d"
    },
    "firstname": "Patrick",
    "lastname": "Nollet",
    "login": "patricknlt",
    "password": "1234",
    "email": "patrick@gmail.com",
    "birthdate": "12/12/1990",
    "account_created": "12/12/2021",
    "role": "user"
  },
  {
    "_id": {
      "$oid": "6607ff6417aaa7bc011f699e"
    },
    "firstname": "Pika",
    "lastname": "Chu",
    "login": "pikachu",
    "password": "1234",
    "email": "pikachu@gmail.com",
    "role": "admin",
    "birthdate": "17/08/2003"
  }]

export const loggedUser = users[0]