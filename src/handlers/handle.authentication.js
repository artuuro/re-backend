class Authentication {
  async post(request, reply) {
    const token = this.jwt.sign(request.body);
    

    reply.send({ token });
  }

}

export default Authentication;
