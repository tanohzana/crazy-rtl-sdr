const rtlSdr = require('rtl-sdr');

const DEVICE_INDEX = 0;
let device = null;

const getDeviceCount = () => {
  const count = rtlSdr.get_device_count();
  console.log(`${count} device(s) found`);
}

const getDeviceName = () => {
  const name = rtlSdr.get_device_name(DEVICE_INDEX);
  console.log(`Device: ${name}`);
}

const onData = (buffer, bufferSize) => {
  console.log(buffer);
};

const onEnd = () => {
  if (device) {
    rtlSdr.close(device);
  }
}

const useDevice = async () => {
  const bufferCount = 12;
  const bufferSize = 16 * 16384; // 256k
  const freq = 1090000000;
  const rate = 2000000;

  device = rtlSdr.open(DEVICE_INDEX);

  // Find the maximum gain available
  const gains = new Int32Array(100);
  const numgains = rtlSdr.get_tuner_gains(device, gains);
  const gain = gains[numgains - 1];

  rtlSdr.set_center_freq(device, freq);
  console.log(`Device is tuned on: ${rtlSdr.get_center_freq(device)}`);

  rtlSdr.set_tuner_gain(device, gain);
  console.log(`Gain is: ${rtlSdr.get_tuner_gain(device)}`);

  rtlSdr.set_sample_rate(device, rate);
  console.log(`Sample rate is: ${rtlSdr.get_sample_rate(device)}`);

  rtlSdr.reset_buffer(device);

  await rtlSdr.read_async(device, onData, onEnd, bufferCount, bufferSize);

  setTimeout(() => {
    rtlSdr.cancel_async(device);
  }, 10000);
}

useDevice();