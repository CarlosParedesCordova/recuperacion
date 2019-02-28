var express = require('express');
var router = express.Router();
//CLIENTE CONTROLLER
var cliente= require('../controllers/clienteController');
var clienteController = new cliente();
//FACTUTAS CONTROLLER
var factura= require('../controllers/facturaController');
var facturaController = new factura();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
      titulo: 'Express',
      fragmento: 'fragmentos/principal'
  });
});
//CLIENTES
router.get('/clientes', clienteController.verCliente);
router.post('/almacenar_cliente', clienteController.guardarCliente);
router.get('/lista_cliente', facturaController.obtenerClientes);

//FACTURAS
router.get('/facturas', facturaController.verFactura);
router.get('/lista_factura', facturaController.obtenerFacturas);
router.post('/factura/guardar', facturaController.guardarFactura);
router.get('/factura_buscar/:buscar', facturaController.buscarFActura);
router.get('/factura_cliente/:external', facturaController.obtenerGastos);

//REPORTES
router.get('/reporte/:external', facturaController.generarReporteCliente);
router.get('/reporte', facturaController.generarReporte);

//CLASIFICACION
router.get('/clasificacion', facturaController.obtenerClasificacion);

module.exports = router;
