const _ = class DB {
  static localestorage = [];

  static write(data) {
    if (data) {
      this.localestorage.push(data);
      return data;
    }

    return false;
  }

  static setVerified(email) {
    for (let i = 0; i < this.localestorage; i++) {
      if (this.localestorage[i].email == email) {
        this.localestorage[i].isVerified = true;
        return;
      }
    }
  }

  static findOne(id) {
    if (id) {
      for (let record of this.localestorage) {
        if (id == record.id) return record;
      }

      return false;
    }
  }

  static upDatePassword(email, newPassWord) {
    for (let i = 0; i < this.localestorage; i++) {
      if (this.localestorage[i].email == email) {
        this.localestorage[i].setPassword(newPassWord);
        return;
      }
    }
  }

  static findByEmail(email) {
    let user = false;
    if (email)
      for (let record of this.localestorage) {
        if (email == record.email) {
          user = record;
          return user;
        }
      }
    return user;
  }
};
module.exports = _;
