const rtlsdr = require('rtl-sdr')

// Get number of connected RTLSDR devices
const deviceCount = rtlsdr.get_device_count()

if (!deviceCount) {
  console.log('No supported RTLSDR devices found')
  process.exit(1)
}

console.log('Found %d device(s)', deviceCount)