const electron = require('electron');
const path = require('path');
const fs = require('fs');

const userDataPath = electron.app.getPath('userData');
const filePath = path.join(userDataPath, 'userConfig.json');

const parseDataFile = () => {
  try {
    const { app, defaults, user } = JSON.parse(fs.readFileSync(filePath));
    return { app, defaults, user };
  } catch (err) {
    return {
      app: {},
      defaults: {},
      user: {},
    };
  }
}

const { app, defaults, user } = parseDataFile();

module.exports = function Store() {
  this.userDataPath = userDataPath;
  this.path = filePath;
  this.app = app;
  this.defaults = defaults;
  this.user = user;

  this.setDefaults = (defaults) => {
    Object.assign(this.defaults, defaults);

    try {
      fs.writeFileSync(this.path, JSON.stringify(this));
    } catch (err) {
      console.error(err);
    }


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

    try {
      fs.writeFileSync(this.path, JSON.stringify(this));
    } catch (err) {
      console.error(err);
    }

    return this;
  };

  this.getUserSetting = (prop) => prop.split('.').reduce((o, i) => o[i], this.user);

  this.setAppSetting = (prop, val) => {
    this.app[prop] = val;

    try {
      fs.writeFileSync(this.path, JSON.stringify(this));
    } catch (err) {
      console.error(err);
    }

    return this;
  };

  this.getAppSetting = (prop) => prop.split('.').reduce((o, i) => o[i], this.app);

  this.getAllSettings = () => ({
    app: this.app,
    defaults: this.defaults,
    user: this.user,
  });
};
