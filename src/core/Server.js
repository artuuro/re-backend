import { Settings, FastifyServer, Memory, Router } from './';

class Server {
    constructor() {
        this.config = new Settings();
        this.memory = new Memory(this.config.database);
        this.router = new Router(this.config.routes);
    }

    async routes(routes) {
        for (const route of routes) {
            await this.instance.route(route);
            this.instance.log.info(`(${route.method}) ${route.path} ${route.middlewares ? '['+route.middlewares+']': ''}`);
        }
    }

    async init() {
        try {
            await this.memory.init();
            await this.router.init();

            this.instance = new FastifyServer(this.config.server);
            this.crud = new Router(this.memory.routes);

            await this.crud.init();
            await this.routes(this.crud.routes);
            await this.routes(this.router.routes);
            await this.instance.decorateRequest('memory', this.memory.mongo.models);
            await this.instance.decorate('mongo', this.memory.mongo);
            await this.instance.listen(this.config.server.port, this.config.server.host);
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }
}

export default Server;