// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
// 🐨 you'll need to grab waitForElementToBeRemoved from '@testing-library/react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
// 🐨 you'll need to import rest from 'msw' and setupServer from msw/node
import Login from '../../components/login-submission'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
// extra 1, importa los handlers definidos
import {handlers} from 'test/server-handlers'

const buildLoginForm = build({
  fields: {
    // usa fake con una funcion, pero cada vez que se genera data, genera un username y password nuevo.
    // no usa el mismo para todos los tests
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

// 🐨 get the server setup with an async function to handle the login POST request:
// 💰 here's something to get you started
// rest.post(
//   'https://auth-provider.example.com/api/login',
//   async (req, res, ctx) => {},
// )
// you'll want to respond with an JSON object that has the username.
// 📜 https://mswjs.io/
// const server = setupServer(
//   rest.post(
//     'https://auth-provider.example.com/api/login',
//     async (req, res, ctx) => res(ctx.json({username: req.body.username})),
//   ),
// )

// extra 1, define el server reutilizando los handlers definidos en otra parte
const server = setupServer(...handlers)

// 🐨 before all the tests, start the server with `server.listen()`
beforeAll(() => server.listen())
// 🐨 after all the tests, stop the server with `server.close()`
afterAll(() => server.close())

// extra 4: hace reset para resetear entre tests las sobreescrituras de server.use
afterEach(() => server.resetHandlers())

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.type(screen.getByLabelText(/password/i), password)
  // 🐨 uncomment this and you'll start making the request!
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  // as soon as the user hits submit, we render a spinner to the screen. That
  // spinner has an aria-label of "loading" for accessibility purposes, so
  // 🐨 wait for the loading spinner to be removed using waitForElementToBeRemoved
  // 📜 https://testing-library.com/docs/dom-testing-library/api-async#waitforelementtoberemoved
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  // once the login is successful, then the loading spinner disappears and
  // we render the username.
  // 🐨 assert that the username is on the screen
  expect(screen.getByText(username)).toBeInTheDocument()
})

// extra 2: unhappy paths
// de forma analoga se puede probar sin username
test(`logging in without password shows error`, async () => {
  render(<Login />)

  const {username} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)

  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByRole('alert')).toHaveTextContent('password required')
})

// extra 3: tomar snapshot en el assertion al final
test('omitting the password results in an error', async () => {
  render(<Login />)
  const {username} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)
  // don't type in the password
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password required"`,
  )
})

// extra 4: caso donde el server tira 500.
// utiliza server.use It allows you to add server handlers after the server has already started.
// And the server.resetHandlers() allows you to remove those added handlers between tests
// to preserve test isolation and restore the original handlers.
test('unknown server error displays the error message', async () => {
  const testErrorMessage = 'Oh no, something bad happened'
  server.use(
    rest.post(
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        // ctx es por context
        return res(ctx.status(500), ctx.json({message: testErrorMessage}))
      },
    ),
  )
  render(<Login />)
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByRole('alert')).toHaveTextContent(testErrorMessage)
})
