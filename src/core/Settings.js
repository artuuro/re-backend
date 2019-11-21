import * as environment from '../configuration';
import defaults from '../configuration/defaults'
import _ from 'lodash';

class Configuration {
  constructor() {
    this.configure();
  }

  configure() {
    Object.assign(this, _.merge(defaults, environment[process.env.NODE_ENV]));
  }
}

export default Configuration;
