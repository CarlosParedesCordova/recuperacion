module.exports = function (sequelize, Sequelize) {
    var cliente= require('../models/cliente');
    var Cliente = new cliente(sequelize, Sequelize);
    var Factura = sequelize.define('factura', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        fecha:  {
            type: Sequelize.DATEONLY
        },
        clasificacion: {
            type: Sequelize.STRING
        },
        external_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        precio: {
            type: Sequelize.DOUBLE(7, 2)
        }

    }, {freezeTableName: true,
        createdAt: false,
        updatedAt: false
    });

    Factura.belongsTo(Cliente, {
        foreignKey: 'id_cliente',
        constraints: false
    });
    return Factura;
};