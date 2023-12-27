const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

const initialUsers = [
  {
    username: 'root1',
    name: 'Superuser',
    password: 'sekret',
  },
  {
    username: 'mluukkai1',
    name: 'Matti Luukkainen',
    password: 'salainen',
  },
]

var token = null

beforeEach(async () => {
  await User.deleteMany({})

  const saltRounds = 10
  let userObject1 = new User(initialUsers[0])
  userObject1.passwordHash = await bcrypt.hash(
    initialUsers[0].password,
    saltRounds
  )
  const user = await userObject1.save()

  let userObject2 = new User(initialUsers[1])
  userObject2.passwordHash = await bcrypt.hash(
    initialUsers[1].password,
    saltRounds
  )
  await userObject2.save()

  await Blog.deleteMany({})

  for (let blog of initialBlogs) {
    let blogObject = new Blog({ ...blog, user: user._id })
    await blogObject.save()
  }

  const response = await api.post('/api/login').send({
    username: 'root1',
    password: 'sekret',
  })

  token = response.body.token
})

describe('user with access', () => {
  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)

    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)

    const contents = response.body.map((r) => r.title)
    expect(contents).toContain('Go To Statement Considered Harmful')
  })

  test('id property exists', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)

    expect(response.body[0].id).toBeDefined()
    expect(response.body[0]._id).not.toBeDefined()
  })

  test('blog without title or url is not added', async () => {
    const newBlog1 = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
      __v: 0,
    }

    const newBlog2 = {
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      author: 'Edsger W. Dijkstra',
      likes: 5,
      __v: 0,
    }

    const response1 = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog1)

    expect(response1.status).toBe(400)

    const response2 = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog2)

    expect(response2.status).toBe(400)

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)

    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    }

    const savedResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    expect(savedResponse.status).toBe(201)
    expect(savedResponse.headers['content-type']).toContain('application/json')

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)

    const contents = response.body.map((r) => r.title)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(contents).toContain('Go To Statement Considered Harmful')
  }, 100000)

  test('blog without likes defaults to 0', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      __v: 0,
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    expect(response.status).toBe(201)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.likes).toBe(0)
  })

  test('delete blog', async () => {
    const deleteResponse = await api
      .delete('/api/blogs/5a422bc61b54a676234d17fc')
      .set('Authorization', `Bearer ${token}`)

    expect(deleteResponse.status).toBe(204)

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)

    const contents = response.body.map((r) => r.title)

    expect(response.body).toHaveLength(initialBlogs.length - 1)
    expect(contents).not.toContain('Type wars')
  })

  test('update blog', async () => {
    const newBlog = {
      // _id: "5a422a851b54a676234d17f7",
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 17,
      __v: 0,
    }

    response = await api
      .put('/api/blogs/5a422a851b54a676234d17f7')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    expect(response.status).toBe(200)
    expect(response.body.likes).toBe(17)
  })
})

describe('user without access', () => {
  test('add blog without token returns 401', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    }

    const response = await api.post('/api/blogs').send(newBlog)

    expect(response.status).toBe(401)
  }),
    test('delete blog without token returns 401', async () => {
      const response = await api.delete('/api/blogs/5a422bc61b54a676234d17fc')

      expect(response.status).toBe(401)
    })

  test('update blog without token returns 401', async () => {
    const newBlog = {
      // _id: "5a422a851b54a676234d17f7",
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 17,
      __v: 0,
    }

    response = await api
      .put('/api/blogs/5a422a851b54a676234d17f7')
      .send(newBlog)

    expect(response.status).toBe(401)
  })

  test('delete blog by another user returns 401', async () => {
    const login = await api.post('/api/login').send({
      username: 'mluukkai1',
      password: 'salainen',
    })
    const token2 = login.body.token

    const response = await api
      .delete('/api/blogs/5a422bc61b54a676234d17fc')
      .set('Authorization', `Bearer ${token2}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('invalid user')
  })

  test('update blog by another user returns 401', async () => {
    const login = await api.post('/api/login').send({
      username: 'mluukkai1',
      password: 'salainen',
    })
    const token2 = login.body.token

    const newBlog = {
      // _id: "5a422a851b54a676234d17f7",
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 17,
      __v: 0,
    }

    response = await api
      .put('/api/blogs/5a422a851b54a676234d17f7')
      .set('Authorization', `Bearer ${token2}`)

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('invalid user')
  })
})
