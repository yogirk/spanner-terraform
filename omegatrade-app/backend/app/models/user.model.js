'user strict';
const database = require('./../config/database.js');
var User = function (user) {};

User.registerUser = async function (user, cb) {
  database.runTransaction(async (err, transaction) => {
    if (err) {
      cb(err, null)
      return;
    }
    try {
      const [rowCount] = await transaction.runUpdate({
        sql: 'INSERT users (userId, fullName, businessEmail,password,photoUrl,provider) VALUES (@userId, @fullName, @businessEmail,@password,@photoUrl,@provider)',
        params: {
          userId: user.userId,
          fullName: user.fullName,
          businessEmail: user.businessEmail,
          password: user.password,
          photoUrl: user.photoUrl,
          provider: user.provider

        },
      });
      await transaction.commit();
      cb(null, rowCount)
    } catch (err) {
      console.error('ERROR:', err);
      cb(err, null)
    }
  });
}

User.findUser = async function (user, cb) {
  try {
    const query = {
      sql: 'select userId,fullName,businessEmail,password,photoUrl,provider from users where businessEmail = @businessEmail',
      params: {
        businessEmail: user.businessEmail
      }
    };
    let result = await database.run(query);
    if (result[0]) {
      var rows = result[0].map((row) => row.toJSON());
      cb(null, rows[0])
    }
  } catch (error) {
    cb(error, null)
  }
}

module.exports = User