module.exports = function (sequelize, Sequelize) {
    var Cliente = sequelize.define('cliente', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        nombre: {
            type: Sequelize.STRING(50)
        },
        apellido: {
            type: Sequelize.STRING(50)
        },
        cedula: {
            type: Sequelize.STRING(50)
        },
        direccion: {
            type: Sequelize.TEXT
        },
        external_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        }
    }, {freezeTableName: true,
        createdAt: false,
        updatedAt: false
    });
    
    Cliente.associate = function (models) {
        models.cliente.hasMany(models.factura, {
            foreignKey: 'id_cliente'
        });
    };

    return Cliente;
};