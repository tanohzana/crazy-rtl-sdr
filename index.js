const rtlSdr = require('rtl-sdr');

const aircrafts = require('./src/aircrafts.js');

const DEVICE_INDEX = 0;
let device = null;

const getDeviceCount = () => {
  const count = rtlSdr.get_device_count();
  console.log(`${count} device(s) found`);
}

const getDeviceName = () => {
  const name = rtlSdr.get_device_name(DEVICE_INDEX);
  console.log(`Device: ${name}`);
};

device = rtlSdr.open(DEVICE_INDEX);

// Using aircrafts module
aircrafts.use(rtlSdr, device);