import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls createBlog with correct details when a new blog is created', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  await user.type(inputs[0], 'Testing New Blog')
  await user.type(inputs[1], 'Test Author')
  await user.type(inputs[2], 'https://example.com/new-blog')

  const createButton = screen.getByText('create')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing New Blog',
    author: 'Test Author',
    url: 'https://example.com/new-blog'
  })
})
