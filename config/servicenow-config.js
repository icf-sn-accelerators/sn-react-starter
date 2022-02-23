/* eslint-disable import/no-extraneous-dependencies */
const { env } = require('./paths');
require('dotenv').config({ path: env });

const snConfig = {
  /**
   * This is a default prefix for all ServiceNow APIs
   * should not be changed
   */
  REST_API_PATH: process.env.REST_API_PATH || '/api',
  /**
   * ServiceNow instance URL for REST calls
   * it is being used in DEVELOPMENT mode only
   * This should be the instance where React application will be deployed to
   */
  SERVICENOW_INSTANCE: process.env.SERVICENOW_INSTANCE || 'https://dev113776.service-now.com',
  /**
   * ServiceNow path to GET resource which serves javascript files
   */
  JS_API_PATH: process.env.JS_API_PATH || 'api/x_305452_sandbox/resources/js',
  /**
   * ServiceNow path to GET resource which serves css files
   */
  CSS_API_PATH: process.env.CSS_API_PATH || 'api/x_305452_sandbox/resources/css',
  /**
   * ServiceNow path to GET resource which serves
   * Image files (png, jpg, gif)
   * SVG files will be embedded into javascript files
   */
  IMG_API_PATH: process.env.IMG_API_PATH || 'api/x_305452_sandbox/resources/img',
  /**
   * ServiceNow path to GET resource which serves
   * other files, like fonts, etc.
   */
  ASSETS_API_PATH: process.env.ASSETS_API_PATH || 'api/x_305452_sandbox/resources/assets',
  /**
   * fonts and images below this size will be put inside JS chunks
   * instead of being saved as separate files
   */
  ASSET_SIZE_LIMIT: process.env.ASSET_SIZE_LIMIT || 10000,
};

module.exports = snConfig;
