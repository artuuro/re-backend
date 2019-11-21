import _ from 'lodash';

export default url => _.upperFirst(_.camelCase(url.split("/")[2]));