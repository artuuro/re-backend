import { Types } from '../helpers';

export default {
  router: [{
    method: 'POST'
  }],
  schema: {
    name: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    account: {
      type: Types.ObjectId,
      ref: 'Account',
      required: true
    }
  }
}
