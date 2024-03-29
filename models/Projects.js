var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new mongoose.Schema({
  /*  Custom  */
  name: String,
  description: String,
  users: [Schema.Types.ObjectId],
  followers: [Schema.Types.ObjectId],
  repos: [{
      id: Schema.Types.ObjectId, 
      authed: Boolean
    }],
  tags: [Schema.Types.ObjectId],
  
  /*  *****  */

  name: { type: String, default: '' },
  gender: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  picture: { type: String, default: '' }

//  resetPasswordToken: String,
//  resetPasswordExpires: Date
});

/**
 * Password hash middleware.
 */
projectSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
projectSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
projectSchema.methods.gravatar = function(size) {
  if (!size) size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('Project', projectSchema);
