'user strict';
var database = require('./app/config/database.js');
var Users = function () { }
Users.prototype.getAllUsers = async function () {
    try {
        const query = {
            sql: 'select * from company',
        };
        let result = await database.run(query);
        if (result[0]) {
            var rows = result[0].map((row) => row.toJSON());
            return rows;
        } else {
            return null
        }
    } catch (err) {
        throw ("error in getAllUsers function", err)
    }
}
Users.createCompany = async function (params, result) {
    try {
        params.created_at = 'spanner.commit_timestamp()';
        database.table('company').insert(params);
        return true
    } catch (error) {
        return false
    }
};
module.exports = Users