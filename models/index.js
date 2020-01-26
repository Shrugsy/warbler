const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect(process.env.DBURL || 'mongodb://localhost:27017/warbler', {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

module.exports.User = require('./user')
module.exports.Message = require('./message')