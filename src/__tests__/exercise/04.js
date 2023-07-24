// form testing
// http://localhost:3000/login

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../components/login'
import faker from 'faker'
import {build, fake} from '@jackfranklin/test-data-bot'

// extra 2, usar faker
// function buildLoginForm() {
//   return {
//     username: faker.internet.userName(),
//     password: faker.internet.password(),
//   }
// }

// extra 3: usar overrides por si se quiere data especifica para overridear username o password
// function buildLoginForm(overrides) {
//   return {
//     username: faker.internet.userName(),
//     password: faker.internet.password(),
//     ...overrides,
//   }
// }

// extra 4: usar test data bot
const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

test('submitting the form calls onSubmit with username and password', async () => {
  // 🐨 create a variable called "submittedData" and a handleSubmit function that
  // accepts the data and assigns submittedData to the data that was submitted
  let submittedData
  // 💰 if you need a hand, here's what the handleSubmit function should do:
  // const handleSubmit = data => (submittedData = data)
  //const handleSubmit = data => (submittedData = data)

  // extra 1: mockear funciones
  const handleSubmit = jest.fn()

  // 🐨 render the login with your handleSubmit function as the onSubmit prop
  render(<Login onSubmit={handleSubmit} />)
  // 🐨 get the username and password fields via `getByLabelText`
  const usernameInput = screen.getByLabelText(/username/i)
  const passwordInput = screen.getByLabelText(/password/i)
  // 🐨 use `await userEvent.type...` to change the username and password fields to
  //    whatever you want

  // extra 2: usar faker
  // extra 3: definir mypassword y pasarla
  // const mypassword = 'mypassword'
  // const {username, password} = buildLoginForm({password: mypassword})

  // extra 4: usar test data bot
  const {username, password} = buildLoginForm()
  // await userEvent.type(usernameInput, 'test.user')
  // await userEvent.type(passwordInput, 'test.user.password')

  await userEvent.type(usernameInput, username)
  await userEvent.type(passwordInput, password)

  // 🐨 click on the button with the text "Submit"
  const submitButton = screen.getByText('Submit')
  await userEvent.click(submitButton)
  // assert that submittedData is correct
  // 💰 use `toEqual` from Jest: 📜 https://jestjs.io/docs/en/expect#toequalvalue
  // expect(submittedData).toEqual({
  //   username: username,
  //   password: password,
  // })

  // extra 1: mockear funcion y usar tohavebeencalled
  expect(handleSubmit).toHaveBeenCalledWith({
    username,
    password,
  })
  expect(handleSubmit).toHaveBeenCalledTimes(1)
})

/*
eslint
  no-unused-vars: "off",
*/
