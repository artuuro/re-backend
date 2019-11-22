import mongo from 'mongoose';
import * as models from '../models';
import { APIDescription } from './';

const { Schema } = mongo;

class Memory {
  constructor(settings) {
    Object.assign(this, settings);
    this.mongo = mongo;
    this.routes = [];
  }

  async setupModels() {
    try {
      for (const name of Object.keys(models)) {
        const { router, schema, methods } = models[name];
        const modelSchema = new Schema(schema, { timestamps: true });

        if (methods) {
          Object.assign(modelSchema.methods, methods);
        }

        this.mongo.model(name, modelSchema);

        if (router) {
          const generator = new APIDescription(router, name, this.mongo.models[name]);
          this.routes = this.routes.concat(await generator.create());
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async init() {
    try {
      await this.mongo.connect(this.host, this.config);
      await this.setupModels();
    } catch (error) {
      throw error;
    }
  }

}

export default Memory;
