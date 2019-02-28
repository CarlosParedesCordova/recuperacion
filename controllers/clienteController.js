'use strict';
var models = require('../models');
var Cliente = models.cliente;
class autorController {
    verCliente(req, res) {
        Cliente.findAll({}).then(function (cliente) {
            res.render('index', {
                titulo: 'Cliente',
                cliente: cliente,
                fragmento: 'fragmentos/cliente'
            });
        });
    }
    guardarCliente(req, res) {
        if (req.body.external === "0") {
            Cliente.create({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                cedula: req.body.cedula,
                direccion: req.body.direccion
            }).then(function (newCliente, created) {
                if (newCliente) {
                    res.redirect('/clientes');
                }
            });
        } else {
            Cliente.update({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                cedula: req.body.cedula,
                direccion: req.body.direccion
            }, {where: {external_id: req.body.external}}).then(function (updatedCliente, created) {
                if (updatedCliente) {
                    res.redirect('/clientes');
                }
            });
        }

    }

}
module.exports = autorController;