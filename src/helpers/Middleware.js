import * as middlewares from '../middlewares';

export default name => {
    const middleware = middlewares[name];
    
    if (!middleware) {
        throw new Error(`Middleware [${name}] doesn't exist!`);
    }

    return middleware;
};