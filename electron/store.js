const electron = require('electron');
const path = require('path');
const fs = require('fs');

const userDataPath = electron.app.getPath('userData');
const filePath = path.join(userDataPath, 'userConfig.json');

const parseDataFile = () => {
  try {
    const { defaults, user } = JSON.parse(fs.readFileSync(filePath));
    return { defaults, user };
  } catch (err) {
    return {
      defaults: {},
      user: {},
    };
  }
}

const { defaults, user } = parseDataFile();

module.exports = function Store() {
  this.userDataPath = userDataPath;
  this.path = filePath;
  this.defaults = defaults;
  this.user = user;

  this.setDefaults = (defaults) => {
    Object.assign(this.defaults, defaults);

    return this;
  };

  this.reset = () => {
    this.defaults = {};
    this.user = {};

    return this;
  };

  this.getDefaultSetting = (prop) => prop.split('.').reduce((o, i) => o[i], this.defaults);

  this.setUserSetting = (prop, val) => {
    this.user[prop] = val;

    console.log(this);

    try {
      fs.writeFileSync(this.path, JSON.stringify(this));
    } catch (err) {
      console.error(err);
    }

    return this;
  };

  this.getUserSetting = (prop) => prop.split('.').reduce((o, i) => o[i], this.user);

  this.getAllSettings = () => ({
    defaults: this.defaults,
    user: this.user,
  });
};
