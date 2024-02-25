'use strict'

const bcrypt = require('bcrypt');

// Dummy user for testing purposes
const user = {
    id: '1',
    username: 'admin',
    password: '' + bcrypt.hashSync('password', 10),
};

module.exports = async function (fastify, opts) {
    fastify.post('/', async (request, reply) => {
        const { username, password } = request.body;

        if (user.username !== username || !bcrypt.compareSync(password, user.password)) {
            reply.code(401).send({ message: 'Invalid username or password' });
            return;
        }

        const token = fastify.jwt.sign({ id: user.id });
        reply.send({ token });
    });
}