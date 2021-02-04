'use strict';
const Simulation = require('../models/companySimulation.model')
const { v4: uuidv4 } = require('uuid');

exports.getSimulation = async function (req, res) {
    await Simulation.getAll(function (err, data) {
        if (err)
            res.json({
                success: false,
                message: "something went wrong"
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

exports.updateSimulation = async function (req, res) {
    let params = req.body;
    if (params) {
        await Simulation.updateById(params, function (err, data) {
            if (err) {
                console.log(err);
                res.json({
                    success: false,
                    message: "something went wrong"
                });
            }
            if (data) {
                res.status(200).json({
                    success: true,
                    message: `Simulation ${(params.status == true) ? 'Started' : 'Stopped'}  sucessfully`
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

exports.deleteSimulation = async function (req, res) {
    let sId = req.params.sId;
    if (sId) {
        await Simulation.deleteById(sId, function (err, data) {
            if (err) {
                res.json({
                    success: false,
                    message: "something went wrong"
                });
            }
            if (data) {
                res.status(200).json({
                    success: true,
                    message: `deleted sucessfully`
                });
            }
        });
    } else {
        res.status(501).json({
            success: false,
            message: "invalid data"
        });
    }
};