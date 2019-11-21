export default async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (error) {
    throw reply.unauthorized(error.message);
  }
};
