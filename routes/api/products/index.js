'use strict'

// In-memory database
let products = [
    {
        id: 1,
        name: 'Product 1',
        description: 'Description for product 1',
        price: 100,
        availability: 10,
    },
    {
        id: 2,
        name: 'Product 2',
        description: 'Description for product 2',
        price: 200,
        availability: 20,
    },
    {
        id: 3,
        name: 'Product 3',
        description: 'Description for product 3',
        price: 300,
        availability: 30,
    }
];
let nextProductId = 4;

// Utility function to find product by ID
const findProductIndex = (id) => products.findIndex((product) => product.id == id);

module.exports = async function (fastify, opts) {

    fastify.addHook('preHandler', async (request, reply) => {
        const { authorization } = request.headers;
        if (!authorization) {
            reply.code(401).send({ message: 'Unauthorized' });
            return;
        }
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.code(401).send({ message: 'Unauthorized' });
        }
    })

    // Retrieve a list of products
    fastify.get('/', async function (request, reply) {
        return products;
    });

    // Add a new product to the database
    fastify.post('/', async function (request, reply) {
        const { name, description, price, availability } = request.body;
        const product = {
            id: nextProductId++,
            name,
        };
        products.push(product);
        return product;
    });

    // Retrieve the details of a specific product by ID
    fastify.get('/:id', async function (request, reply) {
        const productIndex = findProductIndex(request.params.id);
        if (productIndex === -1) {
            reply.code(404).send({ message: 'Product not found' });
            return;
        }
        return products[productIndex];
    });

    // Update the details or availability of a product
    fastify.put('/:id', async function (request, reply) {
        const id = request.params.id;
        const productIndex = findProductIndex(id);
        if (productIndex === -1) {
            reply.code(404).send({ message: 'Product not found' });
            return;
        }
        products[productIndex] = { ...products[productIndex], ...request.body };
        return products[productIndex];
    });

    // Delete a product by ID
    fastify.delete('/:id', async function (request, reply) {
        const id = request.params.id;
        const productIndex = findProductIndex(id);
        if (productIndex === -1) {
            reply.code(404).send({ message: 'Product not found' });
            return;
        }
        products = products.filter((product) => product.id !== id);
        return { message: 'Product deleted' };
    });
}