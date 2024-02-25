'use strict'

const { test } = require('node:test')
const assert = require('node:assert')
const { build } = require('../../helper')

test('get product 1', async (t) => {
  const app = await build(t)

  // Make a POST request to the login route with valid credentials
  const loginRes = await app.inject({
    url: '/api/login',
    method: 'POST',
    payload: {
      username: 'admin',
      password: 'password'
    }
  });

  // Parse the response to get the token
  const token = JSON.parse(loginRes.payload).token;

  // Now you can use the token to test secured routes
  assert.ok(token, 'Token is not null or undefined');

  const res = await app.inject({
    url: '/api/products/1',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  assert.equal(res.payload, '{"id":1,"name":"Product 1","description":"Description for product 1","price":100,"availability":10}')
})

test('modify product 1', async (t) => {
  const app = await build(t)

  // Make a POST request to the login route with valid credentials
  const loginRes = await app.inject({
    url: '/api/login',
    method: 'POST',
    payload: {
      username: 'admin',
      password: 'password'
    }
  });

  // Parse the response to get the token
  const token = JSON.parse(loginRes.payload).token;

  // Now you can use the token to test secured routes
  assert.ok(token, 'Token is not null or undefined');

  const res = await app.inject({
    method: 'PUT',
    url: '/api/products/1',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: {
      name: 'ProductModified 1',
    }
  })
  assert.equal(res.payload, '{"id":1,"name":"ProductModified 1","description":"Description for product 1","price":100,"availability":10}')
})

test('delete product 1', async (t) => {
  const app = await build(t)

  // Make a POST request to the login route with valid credentials
  const loginRes = await app.inject({
    url: '/api/login',
    method: 'POST',
    payload: {
      username: 'admin',
      password: 'password'
    }
  });

  // Parse the response to get the token
  const token = JSON.parse(loginRes.payload).token;

  // Now you can use the token to test secured routes
  assert.ok(token, 'Token is not null or undefined');

  const deleteRes = await app.inject({
    method: 'DELETE',
    url: '/api/products/1',
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
  assert.equal(deleteRes.payload, '{"message":"Product deleted"}')

  const getRes = await app.inject({
    url: '/api/products/1',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  assert.equal(getRes.statusCode, 404)
})

// inject callback style:
//
// test('example is loaded', (t) => {
//   t.plan(2)
//   const app = await build(t)
//
//   app.inject({
//     url: '/example'
//   }, (err, res) => {
//     t.error(err)
//     assert.equal(res.payload, 'this is an example')
//   })
// })
