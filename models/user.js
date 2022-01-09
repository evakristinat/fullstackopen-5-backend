const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username required'],
    unique: true,
    minlength: [3, 'username must have 3 characters or more'],
    maxlength: [15, 'username must be under 15 characters long'],
  },
  name: {
    type: String,
    minlength: [3, 'name must have 3 letters or more'],
    maxlength: [30, 'name should have 30 or less letters'],
    },
  passwordHash: {
    type: String,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    //salasanaa ei palauteta
    delete returnedObject.passwordHash
  },
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
