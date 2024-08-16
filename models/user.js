const { v4: uuidv4 } = require("uuid");
const validate = require("validate.js");
const constraints = require("../lib/contraints");
const bcrypt = require("bcrypt");
const DB = require("../lib/db");

let _ = class User {
  constructor() {
    this.created = new Date();
    
    this.id = uuidv4();

    this.name = {
      first: null,
      last: null,
    };

    this.email = null;

    this.security = {
      passwordHash: null,
    };

    this.banned = false;

    this.isVerified=false;
  }

  save() {
    DB.write(this);
  }

  find(id) {
    return "";
  }

  setFirstName(firstName) {
    try {
      if (firstName) {
        firstName = firstName.trim().replace(/ +/g, "");
      }

      let message = validate.single(firstName, constraints.name);

      if (message) {
        return message;
      } else {
        this.name.first = firstName;
        return;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  setLastName(lastName) {
    try {
      if (lastName) {
        lastName = lastName.trim().replace(/ +/g, "");
      }

      let message = validate.single(lastName, constraints.name);

      if (message) {
        return message;
      } else {
        this.name.last = lastName;
        return;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  setEmail(email) {
    try {
      if (email) email = email.trim().replace(/ +/g, "");

      let message = validate.single(email, constraints.email);

      if (message) return message;
      else this.email = email;
      return;
    } catch (error) {
      throw new Error(e);
    }
  }

  async setPassword(password) {
    console.log(password);

    let msg = await validate.single(password, constraints.password);

    // console.log(msg);

    if (msg) return msg;
    else this.security.passwordHash = await bcrypt.hash(password, 10);

    console.log(this.security.passwordHash);
  }
};

module.exports = _;
