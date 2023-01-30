'use strict';

const { OAuth2Device } = require('homey-oauth2app');

// "measure_temperature.indoor",
// Mapping between settings and controller keys
const pointsMap = new Map([
  [4, { capability: 'measure_temperature.outdoor', dataType: 'number' }],
  [8, { capability: 'measure_temperature.supply_line', dataType: 'number' }],
  [10, { capability: 'measure_temperature.return_line', dataType: 'number' }],
  [11, { capability: 'measure_temperature.hot_water_top', dataType: 'number' }],
  [12, { capability: 'measure_temperature.hot_water_charging', dataType: 'number' }],
  [2491, { capability: 'measure_temperature.pump_return_line', dataType: 'number' }],
  [2494, { capability: 'measure_temperature.pump_supply_line', dataType: 'number' }],
  [50660, { capability: 'measure_temperature.indoor', dataType: 'number' }],
  // [10733, { capability: 'blocked.additional_heat_source', dataType: 'boolean' }],
]);

class NibeDevice extends OAuth2Device {

  /**
   * onOAuth2Init is called when the device is initialized.
   */
  async onOAuth2Init() {
    this.log('Nibe Device was initialized');

    await this.setSettings({
      // only provide keys for the settings you want to change
      connectionState: this.getData().connectionState,
      currentFwVersion: this.getData().currentFwVersion,
      securityLevel: this.getData().securityLevel,
    });

    const { deviceId } = this.getData();
    const points = await this.oAuth2Client.getDevicePoints(deviceId);

    points.forEach(async (item) => {
      const parameterId = parseInt(item.parameterId, 10);
      if (pointsMap.has(parameterId) === true) {
        let { value } = item;

        if (pointsMap.get(parameterId).dataType === 'boolean') {
          // alarm = 1
          // blocked = 0
          // unblocked =
          if (value === 1) {
            value = true;
          } else {
            value = false;
          }
        }

        await this.setCapabilityValue(pointsMap.get(parameterId).capability, value);
        this.log(pointsMap.get(parameterId).capability);
        this.log(item.value);
      }
    });

    // for (const [key, value] of pointsMap.entries()) {
    //     this.log(key +' = '+ value.capability);
    // }

    // this.log(pointsMap.has(44));

    // await this.oAuth2Client.getThingState()
    // .then(async state => {
    //   await this.setCapabilityValue('onoff', !!state.on);
    // });

    // this.registerCapabilityListener("onoff", async (value) => {
    //   await DeviceApi.setMyDeviceState({ on: value });
    // });
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('Nibe has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('MyDevice settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('MyDevice was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('Nibe has been deleted');
  }

}

module.exports = NibeDevice;
