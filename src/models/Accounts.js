import { Types } from '../helpers';

export default {
  router: [{
    method: 'POST'
  }, {
    method: 'DELETE',
  }, {
    method: 'GET', 
    middlewares: [
      'Auth',
      'isAdmin'
    ]
  }],
  schema: {
    type: {
      type: Types.ObjectId,
      ref: 'accountType',
      required: true
    }
  }
}
