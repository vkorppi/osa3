/* eslint-disable quotes */
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Phonenumbers = require('./models/Phonenumbers')


const datab = {

  "persons": [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]
}

app.use(cors())

app.use(bodyParser.json())

app.use(morgan('tiny'))

app.use(express.static('build'))


const conDelErrorHandler = (error, request, response, next) => {


  if (error.name === 'MongoError' && error.code === 11000) {
    return response.status(400).send({ error: 'Duplicate name' })
  }
  else if(error.name === 'MongoError') {

    return response.status(503).send({ error: 'Service unvailable' })
  }


  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'Object id was invalid' })
  }

  next(error)
}

const wrongUrl = (request, response) => {
  response.status(404).send({ error: 'Page not found' })
}


app.get('/app/info', (request, response) => {



  response.send(`Phonenumberlist has this many phonenumbers ${datab.persons.length} <br><br> ${new Date()} ` )


})


app.get('/app/persons', (request, response,next) => {

  Phonenumbers.find({}).then(persons => {

    var databasedata=persons.map(person => person.toJSON())

    response.json(databasedata)

  })
    .catch(error => next(error))
})



app.get('/app/persons/:id', (request, response) => {


  const id = Number(request.params.id)
  const person = datab.persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/app/persons/:id', (request, response,next) => {



  Phonenumbers.findByIdAndRemove(request.params.id)
    // eslint-disable-next-line no-unused-vars
    .then(removedResponse => {
      response.status(204).end()
    })
    .catch(error => next(error))


})



app.post('/app/persons', (request, response,next) => {

  const bodyOfreq = request.body


  const personPhnNumber = new Phonenumbers({
    name:  bodyOfreq.name,
    number: bodyOfreq.number
  })

  personPhnNumber.save().then(savedPersonObject => {


    var persondata=savedPersonObject.toJSON()

    response.json(persondata)

  }).catch(error => next(error))




})
app.use(conDelErrorHandler)

app.use(wrongUrl)


// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})