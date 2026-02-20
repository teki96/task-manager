import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, userEvent } from '../test-utils'
import { TaskForm } from '../../components/TaskForm'

describe('TaskForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()

  const renderComponent = (props = {}) => {
    return render(
      <TaskForm isLoading={false} onSubmit={mockOnSubmit} {...props} />,
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders create mode correctly', () => {
    renderComponent()

    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create task/i }),
    ).toBeInTheDocument()
  })

  it('shows validation error when title is empty', async () => {
    const user = userEvent.setup()
    renderComponent()

    await user.click(screen.getByRole('button', { name: /create task/i }))

    expect(screen.getByText(/task title is required/i)).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with correct form data', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockResolvedValue({ success: true })

    renderComponent()

    await user.type(screen.getByLabelText(/task title/i), 'Test Task')
    await user.type(screen.getByLabelText(/description/i), 'Test Description')
    await user.selectOptions(screen.getByLabelText(/priority/i), 'high')

    await user.click(screen.getByRole('button', { name: /create task/i }))

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high',
      deadline: '',
    })
  })

  it('renders edit mode with initial data and handles cancel', async () => {
    const user = userEvent.setup()

    renderComponent({
      isEditing: true,
      initialData: {
        title: 'Existing Task',
        description: 'Existing Description',
        priority: 'medium',
        deadline: '',
      },
      onCancel: mockOnCancel,
    })

    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /save changes/i }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(mockOnCancel).toHaveBeenCalled()
  })
})
