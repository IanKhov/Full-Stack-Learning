import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, test, expect, vi } from 'vitest'
import Blog from './Blog'

afterEach(() => {
  cleanup()
})

describe('Blog', () => {
  const blog = {
    id: '12345',
    title: 'Blog list Testing',
    author: 'test_user',
    url: 'https://example.com/blog-test',
    likes: 15,
    user: {
      id: 'u1',
      username: 'test_user'
    }
  }

  test('renders title and author but not url or likes by default', () => {
    const { container } = render(<Blog blog={blog} />)

    const header = container.querySelector('.blogTitleAuthor')
    const details = container.querySelector('.blogDetails')

    expect(header.textContent).toContain('Blog list Testing')
    expect(header.textContent).toContain('test_user')
    expect(details).toBeNull()
    expect(screen.queryByText('https://example.com/blog-test')).toBeNull()
    expect(screen.queryByText('15 likes')).toBeNull()
  })

  test('shows url and likes when view button is clicked', async () => {
    const user = userEvent.setup()
    render(<Blog blog={blog} />)

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(screen.getByText('https://example.com/blog-test')).toBeDefined()
    expect(screen.getByText('15 likes')).toBeDefined()
  })

  test('calls like handler twice when like button is clicked twice', async () => {
    const user = userEvent.setup()
    const likeHandler = vi.fn()

    render(<Blog blog={blog} onLike={likeHandler} />)

    await user.click(screen.getByText('view'))
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeHandler.mock.calls).toHaveLength(2)
  })
})
