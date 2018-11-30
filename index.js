const rtlSdr = require('rtl-sdr');

const getDeviceCount = () => {
  const count = rtlSdr.get_device_count();
  console.log(`${count} device(s) found`);
}

getDeviceCount()