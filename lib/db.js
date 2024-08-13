const _ = class DB {
  static localestorage = [];

  static write(data) {
    if (data) {
      this.localestorage.push(data);
      return data;
    }

    return false;
  }

  static findOne(id) {
    if (id) {
      for (let record of this.localestorage) {
        if (id == record.id) return record;
      }

      return false;
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
