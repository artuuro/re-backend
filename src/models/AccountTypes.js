import { Types } from '../helpers';

export default {
  router: [{
    method: 'POST'
  }, {
    method: 'GET',
  }, {
    method: 'PUT'
  }, {
    method: 'DELETE'
  }],
  schema: {
    name: {
      type: String,
      required: true
    }
  }
}
