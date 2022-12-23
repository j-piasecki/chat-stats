/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const { merge } = require('webpack-merge')
const common = require('./webpack.common.cjs')

module.exports = merge(common, {
  mode: 'production',
})
