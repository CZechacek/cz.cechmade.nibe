'use strict';

const { OAuth2Driver } = require('homey-oauth2app');

class NibeDriver extends OAuth2Driver {

  async onOAuth2Init() {
    // Register Flow Cards etc.
    this.log('NibeOAuth2Driver has been initialized');
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices({ oAuth2Client }) {
    const devicelist = [];
    // Fetch only the first page as nobody will ever control more than 10 water tanks with Homey
    const systems = await oAuth2Client.getSystems({ page: 1 });

    // NOTE: This code has Never been tested with more than 1 device but should support more
    for (let itemNr = 0; itemNr < systems.numItems; itemNr++) {
      const system = systems.systems[itemNr];
      for (let deviceNr = 0; deviceNr < system.devices.length; deviceNr++) {
        const device = system.devices[deviceNr];
        const mydevice = {
          name: device.product.name,
          data: {
            systemId: system.systemId,
            systemName: system.name,
            deviceId: device.id,
            deviceSerial: device.product.serialNumber,
            deviceName: device.product.name,
            connectionState: device.connectionState,
            currentFwVersion: device.currentFwVersion,
            securityLevel: system.securityLevel,
            hasAlarm: system.hasAlarm,
          },
        };
        devicelist.push(mydevice);
      }
    }
    return devicelist;
  }

}

module.exports = NibeDriver;
