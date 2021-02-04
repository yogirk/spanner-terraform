'user strict';
const {Spanner} = require('@google-cloud/spanner');

// Creates Spanner client
const spanner = new Spanner({projectId: process.env.PROJECTID,});

// Initialize Spanner instance
const instance = spanner.instance(process.env.INSTANCE);  

// Environment variable assigned here
const databaseId = process.env.DATABASE;

// Initialize database
const database = instance.database(databaseId,{
    acquireTimeout: Infinity,
    concurrency: Infinity,
    fail: false,
    idlesAfter: 10,
    keepAlive: 30,
    labels: {},
    max: 500,
    maxIdle: 1,
    min: 100
});

database.createSession(function(err, session, apiResponse) {
    if (err) {
     console.log(err)
    }
});
  
database.createSession().then(function(data) {
    const session = data[0];
    const apiResponse = data[1];
});

module.exports = database;
