'use strict';

/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * example, and better documentation about configuration variables and their
 * potential values.
 */
require('dotenv').config();
// console.log('New Relic App Name:', process.env.NEW_RELIC_APP_NAME);
// console.log('New Relic License Key:', process.env.NEW_RELIC_LICENSE_KEY);

console.log("Starting application with New Relic...");

exports.config = {
  /**
   * Array of application names.
   */
  app_name: [process.env.NEW_RELIC_APP_NAME],
  /**
   * Your New Relic license key.
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to
     * help you diagnose issues, while 'info' and higher
     * will impose the least overhead on production systems.
     */
    level: 'info'
  },
  /**
   * When using agent-based instrumentation, this is
   * automatically set to true if you are running on
   * a supported framework.
   */
  is_auto_instrument: true,
};
