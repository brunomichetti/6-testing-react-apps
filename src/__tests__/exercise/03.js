// Avoid implementation details
// http://localhost:3000/counter

import * as React from 'react'
// 🐨 add `screen` to the import here:
import {render, fireEvent, screen} from '@testing-library/react'
import Counter from '../../components/counter'

// extra credit: usar userEvent en vez de fireEvent, para abstraerse de implementaciones
// hay que agregar async en la function del test y luego await en cada evento
import userEvent from '@testing-library/user-event'

test('counter increments and decrements when the buttons are clicked', async () => {
  render(<Counter />)
  // 🐨 replace these with screen queries
  // 💰 you can use `getByText` for each of these (`getByRole` can work for the button too)
  // const [decrement, increment] = container.querySelectorAll('button')
  // const message = container.firstChild.querySelector('div')
  const increment = screen.getByRole('button', {name: /increment/i})
  const decrement = screen.getByRole('button', {name: /decrement/i})
  const message = screen.getByText(/current count/i)

  expect(message).toHaveTextContent('Current count: 0')
  // extra credit: cambiar fireEvent por userEvent
  // fireEvent.click(increment)
  await userEvent.click(increment)
  expect(message).toHaveTextContent('Current count: 1')
  // fireEvent.click(decrement)
  await userEvent.click(decrement)
  expect(message).toHaveTextContent('Current count: 0')
})
