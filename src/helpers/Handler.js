import * as handlers from '../handlers';

export default name => {
    const handler = handlers[name];

    if (!handler) {
        throw new Error(`Handler [${name}] doesn't exist!`);
    }

    return new handler;
};