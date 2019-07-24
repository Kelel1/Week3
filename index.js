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
app.get('/api/info', (request, response) => {
    Person.collection.countDocuments({}, function(error, count) {
        response.send(`Phonebook has info for ${count} people <br></br>` + (new Date).toUTCString())
        .catch(error => next(error))
    })   
})

// Display contact by id
app.get('/api/persons/:id', (request, response, next) => {

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

// Add Contact
app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name) {
        return response.status(400).json({
            error: 'missing name'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'missing number'
        })
    } 

    const person = new Person({
        name: body.name,
        number: body.number,

    })
    
    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })

})

// Update contact
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))

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
