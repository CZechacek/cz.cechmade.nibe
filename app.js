'use strict';

const { OAuth2App } = require('homey-oauth2app');
const NibeOAuth2Client = require('./lib/NibeOAuth2Client');

class NibeApp extends OAuth2App {

  static DEBUG = false;
  static OAUTH2_CLIENT = NibeOAuth2Client; // Default: OAuth2Client
  static OAUTH2_DEBUG = this.DEBUG; // Default: false
  static OAUTH2_MULTI_SESSION = false; // Default: false
  static OAUTH2_DRIVERS = ['heat-pump']; // Default: all drivers

  /**
   * onInit is called when the app is initialized.
   */
  async onOAuth2Init() {
    if (this.DEBUG) {
      this.log('Nibe has been initialized');
    }
  }

}

module.exports = NibeApp;
