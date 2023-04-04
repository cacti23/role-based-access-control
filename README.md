# Role Based Access Control 🚀

This is a Role Based Access Control application using Nodejs, Express, Passport Js, etc. 🔐🚪

You can use this application as the starting point for whatever project you are going to build which needs authentication and authorization. 🏗️🔍

For authentication we have only Email & Password option but other authentication options using OAuth/OAuth2.0 like Google, Facebook, Apple, GitHub, etc, can be easily incorporated. 🔑📲

The application is based on the **MVC pattern** i.e. Model View Controller. 🔄👨‍💻

**Mongoose** is used as an ORM for MongoDB for storing Users in Database. 🗄️📊

**Passport JS** is used for local(email, password) authentication. 🔍👀

The application is _almost_ **production ready**. 🚀👌

---

## Getting Started

To start setting up the project, follow these steps:

1. Clone the repo

   ```bash
   git clone https://github.com/trulymittal/role-based-access-control
   ```

2. cd into the cloned repo and run:

   ```bash
   npm install
   ```

3. Put your credentials in the .env file.

   ```bash
   PORT=3000
   MONGODB_URI=YOUR_MONGODB_URI(example: mongodb://localhost:27017)
   DB_NAME=YOUR_DB_NAME
   ```

4. Install MongoDB

   See <https://docs.mongodb.com/manual/installation/> for more infos

5. Run Mongo daemon

   ```bash
   sudo service mongod start
   ```

6. Start the app by

   ```bash
   npm start
   ```

## Author 👤

- [**Cacti23**](https://github.com/cacti23)

## Contribute 🤝

You can fork this repo and send me a PR. 👥💬

## License 📄

This project is licensed under the MIT License. 📝✅
