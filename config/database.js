var dbUrl = 'mongodb://localhost/lordOfTheRingsScript';
module.exports.dburl = process.env.MONGO_URL || dbUrl;
