

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');


mongoose.set('useFindAndModify', false)


const pswd = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]



if ( !process.argv[2]) {
    process.exit(1)
  }


const databaseurl =`mongodb+srv://dbuser:${pswd}@cluster0-yydjv.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(databaseurl, {useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true })

const phoneNumberSchm = new mongoose.Schema({
    name: String,
    number: String
  })

    phoneNumberSchm.set('toJSON', {
        transform: (document, dbObject) => {
            dbObject.id = dbObject._id.toString()
          delete dbObject._id
          delete dbObject.__v
        }
      })

      phoneNumberSchm.plugin(uniqueValidator)  

  const Person = mongoose.model('Person', phoneNumberSchm)

  const personPhnNumber = new Person({
    name:  name,
    number: number
  })

  if ( !process.argv[3] && !process.argv[4])  {

 
  Person.find({}).then(persons => {
 
    
    personlist=persons.map(person => person.toJSON())

  
    console.log('phonebook:')
    personlist.forEach(person => {
        console.log(`${person.name} ${person.number} ` )
      })

    mongoose.connection.close()
  })

}
else {

    
  personPhnNumber.save().then(savedPersonObject => {

   
    persondata=savedPersonObject.toJSON()

    console.log(`added ${persondata.name} number ${persondata.number} to phonebook`)
    mongoose.connection.close()
  })
}
