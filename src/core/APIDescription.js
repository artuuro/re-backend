import _ from 'lodash';
import mongoSwagger from 'mongoose-to-swagger';

class APIDescription {

    constructor(settings, name, model) {
        this.settings = settings;
        this.modelName = name;
        this.routeName = _.snakeCase(name);
        this.model = model;
        this.mainMethods = new Set(['GET', 'POST']);
        this.instanceMethods = new Set(['GET', 'DELETE', 'PUT']);
        this.routes = [];
        this.description = mongoSwagger(this.model);
    }

    generateSchema(method, instanced = false) {
        let schema = {};
        let bodyProperties = _.clone(this.description.properties);
        const properties = _.clone(this.description.properties);

        delete bodyProperties.updatedAt;
        delete bodyProperties.createdAt;
        delete bodyProperties.__v;
        delete bodyProperties._id;

        switch (method) {
            case 'POST':
                schema.summary = `Create new record at '${this.modelName}' collection.`;
                schema.body = {
                    type: 'object',
                    properties: bodyProperties
                };
                schema.response = {
                    201: {
                        description: 'Record created',
                        type: 'object',
                        properties: properties
                    },
                    400: {
                        description: 'Failed to create record',
                        type: 'object',
                        properties: {
                            statusCode: { type: 'integer' },
                            error: { type: 'string' },
                            message: { type: 'string' }
                        }
                    }
                }; 
            break;
            case 'GET':
                schema.summary = instanced ? `Queries single record from '${this.modelName}' collection` : `Queries multiple records from '${this.modelName}' collection.`;
                schema.response = {
                    200: {
                        description: 'Successful response',
                        type: 'object',
                        properties: properties
                    },
                    404: {
                        description: 'Resource not found',
                        type: 'object',
                        properties: {
                            statusCode: { type: 'integer' },
                            error: { type: 'string' },
                            message: { type: 'string' }
                        }
                    }
                };
            break;
            case 'PUT':
                schema.summary = `Updates a single record at '${this.modelName}' collection.`;
                schema.body = {
                    type: 'object',
                    properties: bodyProperties
                };
                schema.response = {
                    200: {
                        description: 'Successful response',
                        type: 'object',
                        properties: properties
                    },
                    400: {
                        description: 'Request failed',
                        type: 'object',
                        properties: {
                            statusCode: { type: 'integer' },
                            error: { type: 'string' },
                            message: { type: 'string' }
                        }
                    }
                };
            break;
            case 'DELETE':
                schema.summary = `Deletes a record at '${this.modelName}' collection.`;
                schema.response = {
                    204: {
                        description: 'Record deleted',
                        type: 'object'
                    },
                    400: {
                        description: 'Request failed',
                        type: 'object',
                        properties: {
                            statusCode: { type: 'integer' },
                            error: { type: 'string' },
                            message: { type: 'string' }
                        }
                    }
                };
            break;

        }

        return schema;
    }

    async create() {
        try {
            for (const item of this.settings) {
                const list = `/api/${this.routeName}`;
                const target = `${list}/:id`;
                let security = [];
                let description = ``;

                const mw = new Set(item.middlewares);

                if (item.middlewares) {
                    security = mw.has('Auth') ? [{ bearerAuth: [] }] : [];
                    description = `Requires passing middleware(s): <b>${item.middlewares.join(", ")}</b>`;
                }

                if (this.mainMethods.has(item.method)) {
                    this.routes.push({
                        path: list,
                        handler: 'crud',
                        ...item,
                        schema: {
                            description: description,
                            tags: [this.modelName],
                            security: security,
                            ...this.generateSchema(item.method)
                        }
                    });
                }

                if (this.instanceMethods.has(item.method)) {
                    this.routes.push({
                        path: target,
                        handler: 'crud',
                        ...item,
                        schema: {
                            description: description,
                            tags: [this.modelName],
                            security: security,
                            params: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'string'
                                    }
                                }
                            },
                            ...this.generateSchema(item.method, true),
                        }
                    });
                }

            }

            return this.routes;
        } catch (error) {
            throw error;
        }
    }
}

export default APIDescription;