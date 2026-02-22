require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))

let persons = []

app.get('/', (request, response) => {
    response.send("<h1>Part3 Exercises</h1>")
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
    response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const now = new Date()
    response.send("Phonebook has info for " + persons.length + " people" + "<p></p>" + now)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then((person) => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const name = body.name

    if (!name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number is missing' 
        })
    }

    // const exists = persons.find(person => person.name === name)
    // if (exists) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person = new Person({
        id: generateId(),
        name: body.name,
        number: body.number
    })

    person.save().then((savedPerson) => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
