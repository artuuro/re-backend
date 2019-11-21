class Ping {
  async get(request, reply) {
    const result = {
      message: 'PONG',
      time: new Date()
    };

    return reply.type('application/json').send(result);

  }
}

export default Ping;
