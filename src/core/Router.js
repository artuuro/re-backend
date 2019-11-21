import { Handler, Middleware } from '../helpers';

class Router {
  constructor(routes) {
    this.routes = routes;
  }

  async init() {
    try {
      for (let route of this.routes) {
        route.handler = Handler(route.handler)[route.method.toLowerCase()];

        if (route.middlewares) {
          route.preHandler = [];
          for (const fn of route.middlewares) {
            route.preHandler.push(Middleware(fn));
          }
        }

        this.routes[route] = route;
      }
    } catch (error) {
      throw error;
    }
  }
}

export default Router;
