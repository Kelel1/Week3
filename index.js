const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 4
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 5
    },
    {
        name: "Nipsey Hussel",
        number: "606-060-6060",
        id: 6
    }
]

// Homepage
app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
})

// Display all contacts
app.get('/persons', (req, res) => {
    res.json(persons)
})

// Display total contacts 
app.get('/info', (req, res) => {
    res.send('Phonebook has info for ' + persons.length + ' people <br></br>' + (new Date).toUTCString())
})

// Display contact by id
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }    
})

// Delete Contact
app.delete('/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

// Generate Contact Id
const generateId = () => {
    return Math.floor(Math.random()*Math.floor(1000000))
}
// Add Contact
app.post('/persons', (request, response) => {
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

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    persons = persons.concat(person)
    
    response.json(person)
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)