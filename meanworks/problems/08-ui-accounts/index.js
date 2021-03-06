var tags = [
  '<input type="text" class="form-control ng-pristine ng-untouched ng-invalid ng-invalid-required" ng-model="newAccountName" placeholder="Enter a new account name" required="">',
  '<span class="ng-binding">Emergency Fund</span>',
  '<span class="ng-binding">Main Checking</span>'
]
var fs = require('fs')
exports.problem = fs.createReadStream(__dirname + '/problem.txt')
exports.solution = fs.createReadStream(__dirname + '/solution.txt')

var mongo = require('mongodb'),
  supertest = require('supertest'),
  path = require('path'),
  mongo = require('mongodb'),
  fetchHtml = require('../../fetch-html.js')

exports.verify = function (args, cb) {
  var cwd = process.cwd(),
    url = 'http://localhost:3000'

  var dbUrl = 'mongodb://localhost:27017/ngfullstacknew-dev'

  mongo.connect(dbUrl, function(err, db) {
    if (err) {
      console.error('Cannot connect to MongoDB, is it running on default port 27017?')
      return cb(false)
    }
    var accountsCollection = db.collection('accounts'),
      accountsCollection  = db.collection('accounts')

    accountsCollection.find({}, {sort: {_id:-1}}).toArray(function(error, accounts){
      if (error) return next(error)
      if (accounts.length == 0) {
        console.error('The accounts collection is empty in the mean database.')
        return cb(false)
      }
      console.log('Awesome. You have the data in the database... checking the browser UI app with Selenium driver')
      db.close()
      fetchHtml('http://localhost:9000/accounts', function(err, html){
        if (err) {
          // console.error(err)
          return cb(false)
        }
        var count = 0,
          stop = false
        tags.forEach((item, index, list)=>{
          // console.log(stop);
          if (stop) return false
          count ++
          if (html.indexOf(item)<0) {
            stop = true
            console.error(`When checking the content of the page, the ${item} element was not found`)
            console.error('Please use the tag template and content provided at http://bit.ly/1TB1IC0 and http://bit.ly/1TB1LOp.')
            return cb(false)
          }
          console.log('The %s tag was FOUND!', item)
          if (count == tags.length) {
            console.info('✓ We found some HTML tags. GOOD JOB. Proceed to the next adventure!');
            return cb(true)
          }
        })

      })
    })

  })

}
