'use strict';
var models = require('../models');
var Cliente = models.cliente;
var Factura = models.factura;
var pdf = require('html-pdf');
let fs = require('fs');
class facturaController {
    verFactura(req, res) {

        res.render('index', {
            titulo: 'Facturas',
            fragmento: 'fragmentos/factura'
        });
    }
    obtenerClasificacion(req, res) {
        var clasificacion = {"clasificacion": ["Comida", "Vestimenta", "Educacion", "Salud", "Otros"]};
        res.status(200).json(clasificacion);
    }
    obtenerGastos(req, res) {
        var external = req.params.external;
        Factura.findAll({include: {model: Cliente, where: {external_id: external}}}).then(function (clienteFactura) {
            res.status(200).json(clienteFactura);
        });
    }
    obtenerFacturas(req, res) {
        Factura.findAll({include: {model: Cliente}}).then(function (factura) {
            res.status(200).json(factura);
        });
    }

    obtenerClientes(req, res) {
        Cliente.findAll({}).then(function (cliente) {
            res.status(200).json(cliente);
        });
    }
    guardarFactura(req, res) {
        if (req.body.external === "0") {
            Factura.create({
                fecha: req.body.fecha,
                clasificacion: req.body.clas,
                precio: req.body.precio,
                id_cliente: req.body.cliente
            }).then(function (newCliente, created) {
                if (newCliente) {
                    res.redirect('/facturas');
                }
            });
        } else {
            Factura.update({
                fecha: req.body.fecha,
                clasificacion: req.body.clas,
                precio: req.body.precio,
                id_cliente: req.body.cliente
            }, {where: {external_id: req.body.external}}).then(function (updatedFactura, created) {
                if (updatedFactura) {
                    res.redirect('/facturas');
                }
            });
        }
    }
    buscarFActura(req, res) {
        var buscar = req.params.buscar;
        Factura.findAll({where: {fecha: {"$between": [buscar, buscar]}}, include: {model: Cliente}}).then(function (factura) {
            res.status(200).json(factura);
        }).catch(function (err) {
            res.status(500).json(err);
        });
    }
    generarReporteCliente(req, res) {
        var external = req.params.external;
        Factura.findAll({include: {model: Cliente, where: {external_id: external}}}).then(function (clienteFactura) {
            var nombreArchivo = 'factura-' + new Date() + '.pdf';
            var contenido = facturaController.verReporte(clienteFactura);
            var options = {
                'format': 'A4',
                'header': {
                    'heigth': '60px'
                },
                "footer": {
                    'heigth': '22mm'
                }
            };
            pdf.create(contenido, options).toFile('./' + nombreArchivo, function (err, respuesta) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(respuesta);
                    res.download('./' + nombreArchivo, nombreArchivo, function () {
                        fs.unlinkSync('./' + nombreArchivo);
                    });
                }
            });
        });
    }
    generarReporte(req, res) {
        Factura.findAll({include: {model: Cliente}}).then(function (clienteFactura) {
            var nombreArchivo = 'factura.pdf';
            var contenido = facturaController.verReporte(clienteFactura);
            var options = {
                'format': 'A4',
                'header': {
                    'heigth': '60px'
                },
                "footer": {
                    'heigth': '22mm'
                }
            };
            pdf.create(contenido, options).toFile('./' + nombreArchivo, function (err, respuesta) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(respuesta);
                    res.download('./' + nombreArchivo, nombreArchivo, function () {
                        fs.unlinkSync('./' + nombreArchivo);
                    });
                }
            });
        });
    }

    static verReporte(data) {
        var fecha_actual = new Date();
        var estiloTabla = '<style>table {font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;border-collapse: collapse;width: 100%;font-size:70%;}\n\
                    table td, #customers th {border: 1px solid #ddd;padding: 8px;}table tr:nth-child(even){background-color: #f2f2f2;}\n\
                    table th {padding-top: 12px;padding-bottom: 12px;text-center: left;background-color: #red;color: white;}</style>';
        var contenido = estiloTabla + '<div id="pageHeader" style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">\n\
                        <p style="color: red; margin: 0; padding-top: 12px; padding-bottom: 5px; text-align:right; font-family: sans-serif; font-size: .85em">';
        contenido += fecha_actual + '</p></div><div style="background-color: ;  margin:1rem;padding:1rem;text-align: center; ">\n\
                        Facturas\n\
                        <table>\n\
                        <thead style="text-align: center;">\n\
                          <tr>\n\
                            <th>#</th>\n\
                            <th>Fecha</th>\n\
                            <th>Cliente</th>\n\
                            <th>Clasificaion</th>\n\
                            <th>precio</th>\n\
                          </tr>\n\
                        </thead>\n\
                        <tbody>';
        var precio = 0;
        for (var i = 0; i < data.length; i++) {
            contenido += '<tr>';
            contenido += ' <td>' + (i + 1) + '</td>';
            contenido += '<td>' + data[i].fecha + '</td>';
            contenido += '<td>' + data[i].cliente.nombre + ' ' + data[i].cliente.apellido + '</td>';
            contenido += '<td>' + data[i].clasificacion + '</td>';
            contenido += '<td>' + data[i].precio + '</td>';
            contenido += '</tr>';
            if (data[i].clasificacion !== 'Otros') {
                precio += data[i].precio;
            }
        }
        contenido += '<tr><td></td><td></td><td></td><td><b>TOTAL:</b></td><td><b>$ ' + precio + '</b></td></tr>';
        contenido += '<div id="pageFooter" style="border-top: 1px solid #ddd; padding-top: 5px;">\n\
                        <p style="color: #666; width: 70%; padding-bottom: 5px; text-align: left; font-family: sans-serif; font-size: .65em; float:center;">\n\
                        Esta lista se creó en una computadora y no es válida sin la firma y el sello.</p>\n\
                        <p style="color: #666; margin: 0; padding-bottom: 5px; text-align: right; font-family:sans-serif; font-size: .65em">Página {{page}} de {{pages}}</p></div>';

        return contenido;
    }
}
module.exports = facturaController;