// testing with context and a custom render method
// http://localhost:3000/easy-button

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import {ThemeProvider} from '../../components/theme'
import EasyButton from '../../components/easy-button'

test('renders with the light styles for the light theme', () => {
  // 🐨 uncomment all of this code and your test will be busted on the next line:
  // define el wrapper que recibe un children, y lo retorna wrappeado con el themeprovider
  // seteando por defecto el initialTheme como light
  function Wrapper({children}) {
    return <ThemeProvider initialTheme="light">{children}</ThemeProvider>
  }

  // En el render, le pasa el wrapper. De esta forma se renderiza wrappeado
  // Esto ayuda en la medida de que si tengo que renderizar varias veces, no hago el wrappeo en cada línea de rerender.
  render(<EasyButton>Easy</EasyButton>, {wrapper: Wrapper})

  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: white;
    color: black;
  `)
  //
  // 🐨 update the `render` call above to use the wrapper option using the
  // ThemeProvider
})

// extra 1: hacer lo mismo para el dark theme
test('renders with the dark styles for the dark theme', () => {
  const Wrapper = ({children}) => (
    <ThemeProvider initialTheme="dark">{children}</ThemeProvider>
  )
  render(<EasyButton>Easy</EasyButton>, {wrapper: Wrapper})
  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: black;
    color: white;
  `)
})

// extra 2: sobrescribir el render, para no tener que duplicar esto al pedo, y que el wrapper acepte un theme
// con esto los dos tests anteriores estan al pedito
function renderWithProviders(ui, {theme, ...options} = {}) {
  const Wrapper = ({children}) => (
    <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
  )
  return render(ui, {wrapper: Wrapper, ...options})
}

test('renders with light theme', () => {
  renderWithProviders(<EasyButton>Easy</EasyButton>, {theme: 'light'})
  let button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: white;
    color: black;
  `)
})

test('renders with dark theme', () => {
  renderWithProviders(<EasyButton>Easy</EasyButton>, {theme: 'dark'})
  let button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: black;
    color: white;
  `)
})

//extra 3: define en test-utils eso, lo llama render simplemente.

/* eslint no-unused-vars:0 */
