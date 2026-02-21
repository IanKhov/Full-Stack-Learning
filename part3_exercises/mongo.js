const mongoose = require('mongoose')
let commandLine = process.argv.length

if (commandLine < 3) {
  console.log('give password as argument')
  process.exit(1)
}

if (commandLine > 5) {
    console.log('too many arguments have been provided')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://iankhov2005_db_user:${password}@cluster0.htqdg3y.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})

if (commandLine === 3) {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
            mongoose.connection.close()
        })
    })
}

if (commandLine === 5) {
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        console.log(result)
        mongoose.connection.close()
    })

}

