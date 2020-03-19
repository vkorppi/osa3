

const mongoose = require('mongoose')

// Otetaan urli
const databaseurl = process.env.DATABASESTRING

// Yhdistetään tietokantaan
mongoose.connect(databaseurl, { useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true})

// Tehdään objektien skeema tietokannalle
const phoneNumberSchm = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    number: String
  })

    // Listätään responsen muokkaus
    phoneNumberSchm.set('toJSON', {
        transform: (document, dbObject) => {
            dbObject.id = dbObject._id.toString()
          delete dbObject._id
          delete dbObject.__v
        }
      })


        // Luodaan model hakemista ja tallentamista varten
        module.exports  = mongoose.model('Person', phoneNumberSchm)