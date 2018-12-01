
const Demodulator = require('mode-s-demodulator');
const AircraftStore = require('mode-s-aircraft-store');

const demodulator = new Demodulator();
const store = new AircraftStore();

const displayAircraft = () => {
  const aircrafts = store.getAircrafts();

    console.log(aircrafts);
}

const onData = (buffer, bufferSize) => {
  demodulator.process(buffer, bufferSize, (msg) => {
    store.addMessage(msg);
  });

  displayAircraft();
};

const use = async (rtlSdr, device) => {
  const bufferCount = 12;
  const bufferSize = 16 * 16384; // 256k
  const freq = 1090000000;
  const rate = 2000000;

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

  // Third argument is the onEnd function that needs the device object
  await rtlSdr.read_async(device, onData, () => rtlSdr.close(device), bufferCount, bufferSize);

  setTimeout(() => {
    rtlSdr.cancel_async(device);
  }, 15000);
}

module.exports = {
  use,
}