import { describe, it, expect } from 'vitest'
import { renderWithProviders } from './test-utils'
import App from '../App'

describe('App Component', () => {
  it('should render without crashing', () => {
    const { container } = renderWithProviders(<App />)
    expect(container).toBeTruthy()
  })
})
