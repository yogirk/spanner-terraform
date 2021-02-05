'use strict';
const Company = require('../models/company.model')
const Simulation = require('../models/companySimulation.model')
const { v4: uuidv4 } = require('uuid');

exports.getList = async function (req, res) {
    await Company.getAll(function (err, data) {
        if (err)
            res.json({
                success: false,
                message: "Error occured while fetching all Company"
            });
        if (data == null) {
            res.json({
                success: true,
                data: []
            });
        }
        if (data) {
            res.status(200).json({
                success: true,
                data: data
            });
        }
    });
};

exports.getDashboardStock = async function (req, res) {
    let param = req.body
    await Company.getCompanyStock(param, function (err, data) {
        if (err)
            res.json({
                success: false,
                message: "Error occured while fetching company stock"
            });
        if (data == null) {
            res.json({
                success: true,
                data: []
            });
        }
        if (data) {
            res.status(200).json({
                success: true,
                data: data
            });
        }
    });
};

exports.create = async function (req, res) {
    let params = req.body;
    const company = await Company.checkCompany(params);
    if(company.status && company.data && company.data.length>0){
        return res.status(409).json({
            success: false,
            record:company,
            message: "company already exists!"
        });
    }
    await Company.create(params, function (err, data) {
        if (err) {
            res.json({
                success: false,
                message: "Error occured while creating company"
            });
        }
        if (data == null) {
            res.json({
                success: true,
                data: []
            });
        }
        if (data) {
            res.status(200).json({
                success: true,
                message: "company created successfully"
            });
        }
    });
};

exports.update = async function (req, res) {
    let params = req.body;
    if (params && params.companyId) {
        await Company.update(params, function (err, data) {
            if (err) {
                res.json({
                    success: false,
                    message: "Error occured while updating company"
                });
            }
            if (data) {
                res.status(200).json({
                    success: true,
                    message: "Company details updated sucessfully"
                });
            }
        });
    } else {
        res.status(501).json({
            success: false,
            message: "invalid data"
        });
    }
}

exports.delete = async function (req, res) {
    let companyId = req.params.companyId;
    await Company.delete(companyId, function (err, data) {
        if (err) {
            res.json({
                success: false,
                message: "something went wrong"
            });
        }
        if (data == null) {
            res.json({
                success: true,
                data: []
            });
        }
        if (data) {
            res.status(200).json({
                success: true,
                message: "company deleted!"
            });
        }
    });
};

exports.simulateCompany = async function (req, res) {
    var params = req.body;
    const { Spanner } = require('@google-cloud/spanner')
    await Company.getCompany(params.companyId, function (err, data) {
        if (err) {
            res.json({
                success: false,
                message: "Error while simulating company"
            });
        }
        if (data == null) {
            res.json({
                success: true,
                data: []
            });
        }
        if (data) {
            if (data.length > 0) {
                let company = data[0];
                let interval = params.timeInterval * 1000;
                let fakeStockmarketgenerator = require('fake-stock-market-generator');
                const stock = fakeStockmarketgenerator.generateStockData(params.data).priceData;
                Simulation.create(company, function (err, sId) {
                    if (err) {
                        console.log('Error while simulating company', err);
                    }
                    if (sId) {
                        for (var i = 0; i < params.data; i++) {
                            setTimeout(function (i) {
                                var stockData = {};
                                stockData.currentValue = Spanner.float(stock[i].price)
                                stockData.companyStockId = uuidv4();
                                stockData.companyId = params.companyId;
                                stockData.companyShortCode = company.companyShortCode
                                stockData.shares = Spanner.float(randomInt(5, 30))
                                stockData.date = Spanner.float(new Date().getTime());
                                stockData.open = Spanner.float(randDec(5, 4000, 2))
                                stockData.volume = Spanner.float(randDec(30, 60, 2))
                                stockData.close = Spanner.float(randDec(5, 4000, 2))
                                stockData.dayHigh = Spanner.float(randDec(5, 4000, 2))
                                stockData.dayLow = Spanner.float(randDec(5, 4000, 2))
                                stockData.adjHigh = Spanner.float(randDec(5, 4000, 2))
                                stockData.adjLow = Spanner.float(randDec(5, 4000, 2))
                                stockData.adjClose = Spanner.float(randDec(5, 4000, 2))
                                stockData.adjOpen = Spanner.float(randDec(5, 4000, 2))
                                stockData.adjVolume = Spanner.float(randDec(5, 4000, 2))
                                stockData.timestamp = 'spanner.commit_timestamp()'
                                Simulation.findByCompanyId(params.companyId, sId, function (err, data) {
                                    if (data && data.status) {
                                        console.log('simulating stock data for', company.companyShortCode)
                                        Company.createStockData(stockData, function (error, data) {
                                            if (error) {
                                                console.log('error while simulating', error);
                                            }
                                        });
                                    }
                                    if (err) {
                                        console.log(err);
                                    }
                                })

                            }, interval * i, i);


                        }
                    }
                });

            }
            res.status(200).json({
                success: true,
                row: data[0]
            });
        }
    });
};

exports.simulateAllCompany = async function (req, res) {
    const {
        Spanner
    } = require('@google-cloud/spanner')
    let params = req.body;
    for (var i = 0; i < params.length; i++) {
        await Company.createData(params[i], function (err, companyId) {
            if (companyId) {
                const today = new Date()
                const start = addMonths(new Date(), -1);
                var dates = getDatesBetweenDates(start, today);
                let fakeStockmarketgenerator = require('fake-stock-market-generator');
                const stock = fakeStockmarketgenerator.generateStockData(dates.length).priceData;
                console.log('stock',stock);
                for (var j = 0; j < dates.length; j++) {
                    var stockData = {};
                    stockData.currentValue = Spanner.float(stock[j].price)
                    stockData.companyStockId = uuidv4();
                    stockData.companyId = companyId;
                    stockData.companyShortCode = params[i].symbol
                    stockData.exchangeName = params[i].exchange_name
                    stockData.exchangeMic = params[i].exchange_mic
                    stockData.timezone = params[i].timezone
                    stockData.shares = Spanner.float(randomInt(5, 30))
                    stockData.requestId = params[i].requestId
                    stockData.date = Spanner.float(dates[j].getTime())
                    stockData.open = Spanner.float(randDec(5, 4000, 2))
                    stockData.volume = Spanner.float(randDec(30, 60, 2))
                    stockData.close = Spanner.float(randDec(5, 4000, 2))
                    stockData.dayHigh = Spanner.float(randDec(5, 4000, 2))
                    stockData.dayLow = Spanner.float(randDec(5, 4000, 2))
                    stockData.adjHigh = Spanner.float(randDec(5, 4000, 2))
                    stockData.adjLow = Spanner.float(randDec(5, 4000, 2))
                    stockData.adjClose = Spanner.float(randDec(5, 4000, 2))
                    stockData.adjOpen = Spanner.float(randDec(5, 4000, 2))
                    stockData.adjVolume = Spanner.float(randDec(5, 4000, 2))
                    stockData.timestamp = 'spanner.commit_timestamp()'
                    Company.createStockData(stockData, function (error, data) {
                    });
                }
            }
        });
    }
    await res.status(200).json({
        success: true
    });
};

exports.getAllStocks = async function (req, res) {
    Company.getAllStocks(function (err, data) {
        if (err) {
            res.json({
                success: false,
                message: "something went wrong"
            });
        }
        if (data == null) {
            res.json({
                success: true,
                data: []
            });
        }
        if (data) {
            res.status(200).json({
                success: true,
                data: data
            });
        }
    })
};

function addMonths(date, months) {
    date.setMonth(date.getMonth() + months);
    return date;
}

const getDatesBetweenDates = (startDate, endDate) => {
    let dates = []
    const theDate = new Date(startDate)
    while (theDate < endDate) {
        dates = [...dates, new Date(theDate)]
        theDate.setDate(theDate.getDate() + 1)
    }
    return dates
}

const randDec = (min, max, decimalPlaces) => {
    var rand = Math.random() * (max - min) + min;
    var power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
}

const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}