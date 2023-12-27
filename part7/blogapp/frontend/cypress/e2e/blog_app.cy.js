Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
    cy.visit('http://localhost:5173/')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url, likes }) => {
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: { title, author, url, likes },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
    }
  })

  cy.visit('http://localhost:5173/')
})

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:5173/')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('input:first').type('root')
      cy.get('input:last').type('sekret')
      cy.contains('login').click()
      cy.contains('Superuser logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input:first').type('mluukkai')
      cy.get('input:last').type('salainen')
      cy.contains('login').click()
      cy.get('.error').contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      // log in user here
      cy.login({ username: 'root', password: 'sekret' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#blog-title').type('a blog created by cypress')
      cy.get('#blog-author').type('cypress')
      cy.get('#blog-url').type('http://localhost:5173')
      cy.get('button').contains('create').click()
      cy.contains('a blog created by cypress')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'a blog created by cypress',
          author: 'cypress',
          url: 'http://localhost:5173',
          likes: 0
        })
      })

      it('A blog can be liked', function() {
        cy.get('.blog').get('button').contains('view').click()
        cy.get('.blog').get('button').contains('like').click()
        cy.get('.blog').contains('likes 1')
      })

      it('A blog can be deleted', function() {
        cy.get('.blog').get('button').contains('remove').click()
        cy.get('.blog').should('not.exist')
      })

      describe('and another user logged in', function() {
        beforeEach(function() {
          // log in user here
          cy.login({ username: 'notroot', password: 'sekret' })
        })

        it('other user cannot see delete button', function() {
          cy.get('.blog').get('button').contains('remove').should('not.exist')
        })
      })
    })

    describe('and multiple blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'the blog with the most likes',
          author: 'cypress',
          url: 'http://localhost:5173',
          likes: 3
        })

        cy.createBlog({
          title: 'the blog with the second most likes',
          author: 'cypress',
          url: 'http://localhost:5173',
          likes: 2
        })

        cy.createBlog({
          title: 'the blog with the least likes',
          author: 'cypress',
          url: 'http://localhost:5173',
          likes: 1
        })
      })

      it('blogs are ordered according to likes', function() {
        cy.get('.blog').eq(0).should('contain', 'the blog with the most likes')
        cy.get('.blog').eq(1).should('contain', 'the blog with the second most likes')
        cy.get('.blog').eq(2).should('contain', 'the blog with the least likes')
      })
    })
  })
})