'use strict'

export default async function (fastify, opts) {
    fastify.get('/', async function (request, reply) {
        return 'this is a products example'
    })
    fastify.post('/', async function (request, reply) {

    })
    fastify.get('/:id', async function (request, reply) {

    })
    fastify.put('/:id', async function (request, reply) {

    })
    fastify.delete('/:id', async function (request, reply) {

    })
}
