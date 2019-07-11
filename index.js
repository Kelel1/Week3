const http = require('http')

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

const app = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'application/json'})
    response.end(JSON.stringify(persons))
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)