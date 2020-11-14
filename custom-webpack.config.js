const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      ENVIRONMENT: {
        API_HOST: JSON.stringify(process.env.API_HOST),
        ROUTER_HOST: JSON.stringify(process.env.ROUTER_HOST),
        TARGET_BRANCH: JSON.stringify(process.env.TARGET_BRANCH)
      }
    })
  ]
};
