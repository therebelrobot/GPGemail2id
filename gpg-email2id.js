var debug = require('debug-log2')
var _ = require('lodash')
var prompt = require('prompt')
var colors = require('colors')

module.exports = function _utilEmailToKey(email, keys, enablePrompt, cb) {
  var matching = _.filter(keys, function (obj) {
    var internalMatch = _.where(obj.uids, {
      email: email
    })
    return internalMatch.length > 0
  })
  if (matching.length > 1) {
    if(enablePrompt){
      console.log('Multiple keys found'.bold)
      _.forEach(matching, function (key, index) {
        if (key.type === 'secret') {
          console.log('\t(' + index + ')', key.type.green.bold, key.date.green.bold, key.key.green.bold)
          _.forEach(key.uids, function (uid) {
            console.log('\t\t' + uid.email.green.bold, '<'.green.bold + uid.name.green.bold + '>'.green.bold, '('.green.bold + uid.comment.green.bold + ')'.green.bold, uid.type.green.bold)
          })
        } else {
          console.log('\t(' + index + ')', key.type, key.date.gray, key.key.bold)
          _.forEach(key.uids, function (uid) {
            console.log('\t\t' + uid.email.green, '<'.gray + uid.name.gray + '>'.gray, '('.gray + uid.comment.gray + ')'.gray, uid.type.gray)
          })
        }
      })
      prompt.start()
      prompt.get([{
        name: 'selection',
        description: 'Enter the number of the desired key',
        default: 0,
        type: 'number'
      }], function (err, result) {
        cb(matching[result.selection])
      })
    } else{
      cb(matching)
    }
  } else if (matching.length === 0) {
    cb()
  } else {
    cb(matching[0])
  }
}