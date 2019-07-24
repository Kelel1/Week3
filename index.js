require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

// Middlewares
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact '))
app.use(cors())


// Morgan middleware
morgan.token('contact', function (req, res) {return JSON.stringify(req.body) })
morgan.token('method', function (req, res) {return req.method})
morgan.token('url', function (req, res) {return req.url})
morgan.token('status', function(req, res) {return res.statusCode})

// let persons = [
//     {
//         name: "Arto Hellas",
//         number: "040-123456",
//         id: 1
//     },
//     {
//         name: "Ada Lovelace",
//         number: "39-44-5323523",
//         id: 4
//     },
//     {
//         name: "Dan Abramov",
//         number: "12-43-234345",
//         id: 3
//     },
//     {
//         name: "Mary Poppendieck",
//         number: "39-23-6423122",
//         id: 5
//     },
//     {
//         name: "Nipsey Hussel",
//         number: "606-060-6060",
//         id: 6
//     }
// ]

// Homepage
app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
})

// Display all contacts
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

// Display total contacts 
app.get('/info', (req, res) => {
    res.send('Phonebook has info for ' + persons.length + ' people <br></br>' + (new Date).toUTCString())
})

// Display contact by id
app.get('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // const person = persons.find(person => person.id === id)
    
    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }
        
    })    
    .catch(error => next(error))
})

// Delete Contact
app.delete('/api/persons/:id', (request, response, next) => {   

    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
    
})

// Generate Contact Id
// const generateId = () => {
//     return Math.floor(Math.random()*Math.floor(1000000))
// }
// Add Contact
app.post('/api/persons', (request, response) => {
    const body = request.body
    const matchName = persons.filter(p => p.name.toLowerCase() === body.name.toLowerCase()) 
    
    if (!body.name) {
        return response.status(400).json({
            error: 'missing name'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'missing number'
        })
    } else if (matchName.length > 0) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        // id: generateId(),
    })
    // persons = persons.concat(person)
    
    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
    // response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
