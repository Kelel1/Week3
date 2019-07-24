const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
} 

const password = process.argv[2]
const contactName = process.argv[3]
const contactNumber = process.argv[4]

const url =
    `mongodb+srv://Kelder:${password}@cluster1-xo9e5.mongodb.net/phonebook-app?retryWrites=true&w=majority`
    

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
    Person.find({}).then(result => {
            console.log("phonebook: ")
        result.forEach(person => {
            console.log(person.name + ' ' + person.number);
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: contactName,
        number: contactNumber,
    })

    person.save().then(response => {
        console.log(`Added ${contactName} number ${contactNumber} to phonebook!`)
        mongoose.connection.close()
    })

}
