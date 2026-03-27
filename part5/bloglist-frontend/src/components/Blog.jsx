import { useState } from 'react'

const Blog = ({ blog, onLike, onDelete, currentUser }) => {
  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible(v => !v)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    if (!onLike) return
    const userId = blog.user && (blog.user.id || blog.user._id)
    const updated = {
      user: userId,
      likes: (blog.likes || 0) + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    await onLike(blog.id || blog._id, updated)
  }

  const handleDelete = async () => {
    if (!onDelete) return
    const id = blog.id || blog._id
    onDelete(id, blog.title)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggle}>{visible ? 'hide' : 'view'}</button>
      </div>

      {visible && (
        <div className="blogDetails">
          <div>{blog.url}</div>
          <div>{blog.likes} likes <button onClick={handleLike}>like</button></div>
          <div>{blog.user.name}</div>
          {(() => {
            const blogUser = blog.user
            const blogUsername = blogUser && (blogUser.username || blogUser.name)
            const currentUsername = currentUser && currentUser.username
            if (currentUsername && blogUsername && currentUsername === blogUsername) {
              return <div><button onClick={handleDelete}>remove</button></div>
            }
            return null
          })()}
        </div>
      )}
    </div>
  )
}

export default Blog