require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
morgan.token('body', (req, res) => JSON.stringify(req.body));
const cors = require('cors')

const app = express()
const Person = require('./models/person')

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(express.static('static'))
app.use(cors())


app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const info = `<p>Phonebook has info for ${persons.length} people</p>`
        const date = `<p>${new Date()}</p>`
        response.send(info + date)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        return response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            return response.json(person)
        } else {
            response.status(404).end()
        }
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            Person.findByIdAndDelete(request.params.id).then(() => {
                response.status(204).end()
            })
        } else {
            response.status(404).end()
        }
      })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    
    Person.find({ name: body.name }).then(persons => {
        console.log(persons)
        if (persons.length > 0) {
            return response.status(400).json({
                error: 'name must be unique'
            })
        } else {
            const person = new Person({
                name: body.name,
                number: body.number
            })
            person.save().then(savedPerson => {
                return response.status(201).json(savedPerson)
            })
        }
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})