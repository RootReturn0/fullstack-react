const totalLikes = (blogs) => {
  return blogs.map((blog) => blog.likes).reduce((a, b) => a + b, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((a, b) => (a.likes > b.likes ? a : b))
}

const mostBlogs = (blogs) => {
  const authorCount = blogs.reduce((count, blog) => {
    count[blog.author] = (count[blog.author] || 0) + 1
    return count
  }, {})

  const maxAuthor = Object.keys(authorCount).reduce((a, b) => {
    return authorCount[a] > authorCount[b] ? a : b
  })

  return { author: maxAuthor, blogs: authorCount[maxAuthor] }
}

const mostLikes = (blogs) => {
  const authorLikes = blogs.reduce((count, blog) => {
    count[blog.author] = (count[blog.author] || 0) + blog.likes
    return count
  }, {})

  const maxAuthor = Object.keys(authorLikes).reduce((a, b) => {
    return authorLikes[a] > authorLikes[b] ? a : b
  })

  return { author: maxAuthor, likes: authorLikes[maxAuthor] }
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
