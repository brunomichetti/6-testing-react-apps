// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {render, screen, act, renderHook} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useCounter from '../../components/use-counter'

// 🐨 create a simple function component that uses the useCounter hook
// and then exposes some UI that our test can interact with to test the
// capabilities of this hook
// 💰 here's how to use the hook:
// const {count, increment, decrement} = useCounter()
function CompUseCounterTest() {
  const {count, increment, decrement} = useCounter()
  return (
    <>
      <div>{count}</div>
      <button onClick={increment}>Increase</button>
      <button onClick={decrement}>Decrease</button>
    </>
  )
}

test('exposes the count and increment/decrement functions', async () => {
  // 🐨 render the component
  render(<CompUseCounterTest />)
  // 🐨 get the elements you need using screen
  const incrementButton = screen.getByRole('button', {name: /increase/i})
  const decrementButton = screen.getByRole('button', {name: /decrease/i})
  // 🐨 assert on the initial state of the hook
  expect(screen.getByText(/0/i)).toBeInTheDocument()
  // 🐨 interact with the UI using userEvent and assert on the changes in the UI
  await userEvent.click(incrementButton)
  expect(screen.getByText(/1/i)).toBeInTheDocument()
  await userEvent.click(decrementButton)
  expect(screen.getByText(/0/i)).toBeInTheDocument()
})

// extra 1, no definir un componente de test porque a veces puede ser engorroso
// definir una variable, que es modificada en el "componente vacío" con el resultado
// después le ejecutas derecho desde la variable las funciones y haces assert de los resultados
test('test custom hook using only result', () => {
  let result
  function TestComponent(props) {
    result = useCounter(props)
    return null
  }

  render(<TestComponent />)
  expect(result.count).toBe(0)
  act(() => result.increment())
  expect(result.count).toBe(1)
  act(() => result.decrement())
  expect(result.count).toBe(0)
})

// extra 2: agrear dos tests para testear customizaciones de initial count y step
// Para esto se crea una función setup que se usa en ambos tests

function setup(initialProps) {
  let results = {}
  function TestComponent() {
    // usa asign para no perder la referencia de results. porque sino hace:
    // const results = setup(...)
    // results.increment(...) -> esto re renderiza y se pierde la refrencia del results anterior
    Object.assign(results, useCounter(initialProps))
    return null
  }
  render(<TestComponent />)
  return results
}

test('allows customization of the initial count', () => {
  const initialCountTest = 2
  const results = setup({initialCount: initialCountTest})

  expect(results.count).toBe(initialCountTest)

  act(() => results.increment())
  expect(results.count).toBe(initialCountTest + 1)
  act(() => results.decrement())
  expect(results.count).toBe(initialCountTest)
})

test('allows customization of the step', () => {
  const stepTest = 2
  const results = setup({step: stepTest})

  expect(results.count).toBe(0)

  act(() => results.increment())
  expect(results.count).toBe(stepTest)
  act(() => results.decrement())
  expect(results.count).toBe(0)
})

// extra 3: usar renderHook de la lib de test de react, que es análoga a la function setup definida en el extra 2
test('allows customization of the initial count using renderHook', () => {
  const initialCountTest = 2
  const {result} = renderHook(useCounter, {
    initialProps: {initialCount: initialCountTest},
  })

  expect(result.current.count).toBe(initialCountTest)

  act(() => result.current.increment())
  expect(result.current.count).toBe(initialCountTest + 1)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(initialCountTest)
})

test('allows customization of the step using renderHook', () => {
  const stepTest = 2
  const {result} = renderHook(useCounter, {
    initialProps: {step: stepTest},
  })

  expect(result.current.count).toBe(0)

  act(() => result.current.increment())
  expect(result.current.count).toBe(stepTest)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

/* eslint no-unused-vars:0 */
