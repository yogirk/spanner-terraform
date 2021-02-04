'user strict';
const database = require('./../config/database.js');
const { v4: uuidv4 } = require('uuid');
// Initialize User constructor
var Simulation = function (company) {};

Simulation.getAll = async function (cb) {
    try {
        const query = {
            sql: 'select sml.sId as sId,sml.companyId as companyId, sml.status as status, cy.companyName as companyName, cy.companyShortCode as companyShortCode from simulations sml LEFT JOIN companies cy ON sml.companyId = cy.companyId',
        };
        let result = await database.run(query);
        if (result[0]) {
            var rows = result[0].map((row) => row.toJSON());
            cb(null, rows)
        } else {
            cb(null, null);
        }
    } catch (error) {
        cb(error, null)
    }
}

Simulation.findById = async function (param, cb) {
    try {
        let sId = param.sId
        const query = {
            sql: 'select * from simulations where sId = @sId',
            params: {
                sId: sId
            }
        };
        let result = await database.run(query);
        if (result[0]) {
            var rows = result[0].map((row) => row.toJSON());
            cb(null, rows)
        }
    } catch (error) {
        cb(error, null)
    }
}

Simulation.findByCompanyId = async function (companyId, sid, cb) {
    try {
        const query = {
            sql: 'select * from simulations where companyId = @companyId and sid = @sid',
            params: {
                companyId: companyId,
                sid: sid
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

Simulation.create = async function (company, result) {
    try {
        const sId = uuidv4()
        await database.table('simulations').insert({
            sId: sId,
            status: true,
            createdAt: 'spanner.commit_timestamp()',
            companyId: company.companyId,
        });
        result(null, sId);
    } catch (error) {
        result(error, null);
    }
};

Simulation.deleteById = async function (sId, cb) {
    database.runTransaction(async (err, transaction) => {
        if (err) {
            cb(err, null)
            return;
        }
        try {
            const [rowCount] = await transaction.runUpdate({
                sql: "DELETE FROM simulations WHERE sId = @sId",
                params: {
                    sId: sId
                },
            });
            console.log(`Successfully deleted ${rowCount} record.`);
            await transaction.commit();
            cb(null, true)
        } catch (err) {
            cb(err, null)
        }
    });
}

Simulation.updateById = async function (params, cb) {
    const table = database.table('simulations');
    try {
        await table.update([params]);
        cb(null, true)
    } catch (err) {
        cb(err, null)
    }
}

module.exports = Simulation