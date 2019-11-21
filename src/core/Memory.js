import mongo from 'mongoose';
import * as models from '../models';
import { APIDescription } from './';

const { Schema } = mongo;

class Memory {
  constructor(settings) {
    Object.assign(this, settings);
    this.mongo = mongo;
    this.relationChecklist = [];
    this.routes = [];
  }

  async setupModels() {
    try {
      for (const name of Object.keys(models)) {
        const { schema, methods } = models[name];
        const modelSchema = new Schema(schema, { timestamps: true });

        if (methods) {
          Object.assign(modelSchema.methods, methods);
        }

        this.mongo.model(name, modelSchema);
      }
    } catch (error) {
      throw error;
    }
  }

  async setupRoutes() {
    try {
      for (const name of Object.keys(models)) {
        const { router, schema, methods } = models[name];
        const model = this.mongo.models[name];
        if (router) {
          const generator = new APIDescription(router, name, model);
          this.routes = this.routes.concat(await generator.create());
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async load() {
    try {
      await this.setupModels();
      await this.setupRoutes();
    } catch (error) {
      throw error; 
    }
  }

  async init() {
    try {
      await this.mongo.connect(this.host, this.config);
      await this.load();
    } catch (error) {
      throw error;
    }
  }

}

export default Memory;
