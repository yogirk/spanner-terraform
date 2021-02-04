'user strict';
const database = require('./../config/database.js');
const {
    v4: uuidv4
} = require('uuid');
var Company = function (company) {};

Company.getAll = async function (cb) {
    try {
        const query = {
            sql: 'select * from companies',
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

Company.getCompanyStock = async function (param, cb) {
    try {
        let companyId = param.companyId
        let response = {}
        const query = {
            sql: 'select * from companies where companyId = @companyId',
            params: {
                companyId: companyId
            }
        };
        let result = await database.run(query);
        if (result[0]) {
            var rows = result[0].map((row) => row.toJSON());
            response.company = rows[0];
        }
        if (param.date) {
            var whereClause = 'where companyId = @companyId and date > @date ORDER BY date';
            var params = {
                companyId: companyId,
                date: param.date
            };
        } else {
            var whereClause = 'where companyId = @companyId ORDER BY date';
            var params = {
                companyId: companyId
            }
        }
        var query2 = {
            sql: 'select date,currentValue from companyStocks ' + whereClause,
            params: params
        };
        let stockResult = await database.run(query2);
        if (stockResult[0]) {
            var stockRows = stockResult[0].map((row) => row.toJSON());
            response.stocks = stockRows;
        }
        cb(null, response)
    } catch (error) {
        cb(error, null)
    }
};

Company.create = async function (params, result) {
    try {
        params.companyId = uuidv4();
        params.created_at = 'spanner.commit_timestamp()';
        await database.table('companies').insert(params);
        result(null, params.companyId);
    } catch (error) {
        result(true, null);
    }
};

Company.createData = async function (params, result) {
    try {
        let companyId = uuidv4();
        await database.table('companies').insert({
            "companyName": params.name,
            "companyShortCode": params.symbol,
            "companyId": companyId,
            "created_at": 'spanner.commit_timestamp()'
        })
        result(null, companyId)
    } catch (error) {
        result(true, null)
    }
};

Company.createStockData = async function (stockData, result) {
    try {
        await database.table('companyStocks').insert(stockData)
        result(null, true);
    } catch (error) {
        console.log('stockDataErr', error)
        result(error, false);
    }
};

Company.getCompany = async function (companyId, cb) {
    console.log(companyId)
    try {
        const query = {
            sql: 'select * from companies where companyId = @companyId',
            params: {
                companyId: companyId
            }
        };
        let result = await database.run(query);
        if (result[0]) {
            var rows = result[0].map((row) => row.toJSON());
            cb(null, rows)
        } else {
            cb(null, null);
        }
    } catch (error) {
        console.log('issue', error)
        cb(error, null)
    }
};

Company.checkCompany = async function (param) {
    companyName = param.companyName;
    companyShortCode = param.companyShortCode;
    try {
        const query = {
            sql: 'select * from companies where companyName = @companyName or companyShortCode = @companyShortCode',
            params: {
                companyName: companyName,
                companyShortCode:companyShortCode
            }
        };
        let result = await database.run(query);
        console.log(result);
        if (result[0]) {
            var data = result[0].map((row) => row.toJSON());
            return {status:true,data:data}
        } 
    } catch (error) {
        return {status:false}
    }
};

Company.delete = async function (companyId, cb) {
    database.runTransaction(async (err, transaction) => {
        if (err) {
            cb(err, null)
            return;
        }
        try {
            const [rowCount] = await transaction.runUpdate({
                sql: "DELETE FROM companies WHERE companyId = @companyId",
                params: {
                    companyId: companyId
                },
            });
            console.log(`Successfully deleted ${rowCount} record.`);
            await transaction.commit();
            cb(null, true)
        } catch (err) {
            console.error('ERROR:', err);
            cb(err, null)
        }
    });
}
Company.update = async function (params, cb) {
    const table = database.table('companies');
    try {
        await table.update([params]);
        cb(null, true)
    } catch (err) {
        cb(err, null)
    }
}

Company.getAllStocks = async function (cb) {
    try {
        const query = {
            sql: 'select * from companyStocks',
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

module.exports = Company