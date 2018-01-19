const execa = require('execa')
if (process.env.npm_config_snpm) {
  console.log('Installing gitbook-cli by snpm...')
  execa.shell('snpm i gitbook-cli -g')
} else if (process.env.npm_config_cnpm) {
  console.log('Installing gitbook-cli by cnpm...')
  execa.shell('cnpm i gitbook-cli -g')
} else if (process.env.npm_config_yarn) {
  console.log('Installing gitbook-cli by yarn...')
  execa.shell('yarn global add gitbook-cli')
} else {
  console.log('Installing gitbook-cli...')
  execa.shell('npm i gitbook-cli -g')
}