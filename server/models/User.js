const mongoose = require('mongoose');

// define userSchema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }, 
  vpcID: {
    type: String,
    required: false
  },
  subnetId: {
    type: String,
    required: false
  },
  amiPublicKey: {
    type: String,
    required: false
  },
  amiSecretKey: {
    type: String,
    required: false
  },
  region: {
    type: String,
    required: false
  },
  clusterIPs: {
    type: Array,
    required: false
  }, 
  clusterPassword: {
    type: String,
    required: false
  }
},
{
  timestamps: true
});

// define user model
const User = mongoose.model('User', userSchema);

// export user model
module.exports = User;