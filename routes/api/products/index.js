'use strict'

// In-memory database
let products = [];
let nextProductId = 1;

// Utility function to find product by ID
const findProductIndex = (id) => products.findIndex((product) => product.id === id);

module.exports = async function (fastify, opts) {
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
            description,
            price,
            availability
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