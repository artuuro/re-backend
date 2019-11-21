import { 
  ResolveModel as getModelName, 
  FormatJSON as formatOutput 
} from '../helpers';

class Crud {
  async get(request, reply) {
    try {
      const { raw, params, memory } = request;
      const model = memory[getModelName(raw.url)];
      const result = formatOutput(params.id ? await model.findById(params.id) : await model.find());
      reply
        .code(200)
        .send(result);
    } catch (error) {
      reply.notFound(error);
    }
  }

  async put(request, reply) {
    try {
      const { raw, params, body, memory } = request;
      const model = memory[getModelName(raw.url)];
      const result = formatOutput(await model.findOneAndUpdate({ _id: params.id }, body, { new: true }));
      reply
        .code(200)
        .send(result);
    } catch (error) {
      reply.badRequest(error);
    }
  }

  async post(request, reply) {
    try {
      const { raw, body, memory } = request;
      const model = memory[getModelName(raw.url)];
      const result = formatOutput(await new model(body).save());
      reply
        .code(201)
        .send(result);
    } catch (error) {
      reply.badRequest(error);
    }
  }

  async delete(request, reply) {
    try {
      const { raw, params, memory } = request;
      const model = memory[getModelName(raw.url)];
      const result = formatOutput(await model.deleteOne({ _id: params.id }));
      reply
        .code(204)
        .send(result);
    } catch (error) {
      reply.notFound(error);
    }
  }

}

export default Crud;
