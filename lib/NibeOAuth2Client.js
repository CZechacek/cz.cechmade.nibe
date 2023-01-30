'use strict';

const { OAuth2Client, OAuth2Error } = require('homey-oauth2app');

class NibeOAuth2Client extends OAuth2Client {

    static API_URL = 'https://api.myuplink.com/v2';
    static TOKEN_URL = 'https://api.myuplink.com/oauth/token';
    static AUTHORIZATION_URL = 'https://api.myuplink.com/oauth/authorize';
    static SCOPES = ['READSYSTEM WRITESYSTEM offline_access'];

    async onHandleNotOK({ body }) {
      throw new OAuth2Error(body.error);
    }

    async getSystems({ page }) {
      return this.get({
        path: '/systems/me',
        query: { page },
      });
    }

    async getSubscriptions(systemId) {
      return this.get({
        path: `/systems/${systemId}/subscriptions`,
      });
    }

    async getActiveNotifications(systemId) {
      return this.get({
        path: `/systems/${systemId}/notifications/active`,
      });
    }

    async getDeviceInfo(deviceId) {
      return this.get({
        path: `/devices/${deviceId}`,
      });
    }

    async getDevicePoints(deviceId, parameters) {
      return this.get({
        path: `/devices/${deviceId}/points`,
        query: { parameters },
      });
    }

}

module.exports = NibeOAuth2Client;
