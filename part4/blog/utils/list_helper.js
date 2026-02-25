const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  const likes = blogs.map(blog => blog.likes)
  const result = likes.reduce(reducer, 0)
  
  return result
}

const favouriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null
  }

  return blogs.reduce((fav, blog) => {
    return (fav.likes > blog.likes) ? fav : blog
  })
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}