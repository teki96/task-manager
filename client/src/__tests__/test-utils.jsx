import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { TaskProvider } from '../context/TaskContext'

export function renderWithProviders(
  ui,
  { withRouter = false, ...renderOptions } = {},
) {
  function Wrapper({ children }) {
    const content = (
      <AuthProvider>
        <TaskProvider>{children}</TaskProvider>
      </AuthProvider>
    )

    if (withRouter) {
      return <BrowserRouter>{content}</BrowserRouter>
    }

    return content
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

export function renderWithRouter(ui, renderOptions = {}) {
  return renderWithProviders(ui, { withRouter: true, ...renderOptions })
}

export * from '@testing-library/react'
