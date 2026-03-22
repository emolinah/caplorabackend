const db = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


//crea un set de parametros para la funcion findAndCountAll de Sequelize
//retorna el objeto para llamar la funcion "findAndCountAll(resultadoDeEstaFuncion);"

async function findAll({model, req, where = {}, include = null, offset = 0, limit = 10, orderField = null, order = "ASC"}) {
    
    let setup = {
        where : where,
        include : include,
        offset : offset,
        limit : limit,
    }

    //orden por parametros
    if(typeof orderField === 'string' && model.rawAttributes.hasOwnProperty(orderField)){
        setup.order = [[orderField, order == 'ASC' ? 'ASC' : 'DESC']]
    }
    
    if(req.hasOwnProperty('query')){
        //orden por query
        if(req.query.hasOwnProperty("orderField") && typeof req.query.orderField === 'string'){
            //verificamos si el modelo tiene el campo
            let orderField = req.query.orderField;
            if(model.rawAttributes.hasOwnProperty(orderField)){
                let order = req.query.order == 'ASC' ? 'ASC' : 'DESC';
                setup.order = [[orderField, order]]
            }
        }

        if(req.query.hasOwnProperty('queryLimit')) setup['limit'] = parseInt(req.query['queryLimit']) ?? 10;
        if(req.query.hasOwnProperty('queryOffset')) setup['offset'] = parseInt(req.query['queryOffset']);
        

        //verificamos los parametros
        Object.keys(req.query).forEach(parameterName => {

            // console.log('parameterName'); 
            // console.log(parameterName); 
            // console.log(typeof parameterName); 
            //si el parametro es STRING
            if(typeof req.query[parameterName] === 'string' && model.rawAttributes.hasOwnProperty(parameterName)){
                setup.where[parameterName] = {
                    [Op.like]: `${req.query[parameterName]}`
                }
            }
            else if(typeof req.query[parameterName] === 'int' && model.rawAttributes.hasOwnProperty(parameterName)){
                setup.where[parameterName] = req.query[parameterName];
            }

        });
    }
    //TODO ktry
    //ktry(model.findAndCountAll(setup));
    return await model.findAndCountAll({
        setup, 
        limit: setup['limit'],
        offset: setup['offset'],
        where: setup['where'],
    });
}

async function ktry({query, mensaje}){
    try {
        query();
    } catch (error) {
        if(error.toString().indexOf("clonado")){            
            return {status: 200, result: null, mensaje: "El campo debe ser único"}
        }
    }
}

async function create({model, req}){
    return await model.create(req.body);
}

async function edit({model, req, include = []}){

    //verificamos si es un entero
    if(req.hasOwnProperty('query')){
        let req_id = parseInt(req.query.id);
        if(!Number.isNaN(req_id)){
            //retornamos el sequelize
            return await model.findOne({
                where: {id : req_id},
                include: include,
            }); 
        }
    }
    //si no existe id
    return {data: {}};
    
}

async function update({model, req, include = []}){

    //verificamos si es un entero
    let req_id = parseInt(req.body.id);
    if(!Number.isNaN(req_id)){
        //retornamos el sequelize
        return await model.update(req.body, {where: {id : req_id}});
    }
    //si no existe id
    return {data: {}};
    
}

async function destroy({model, req,}){
    
    //verificamos si es un entero
    let req_id = parseInt(req.body.id);
    if(!Number.isNaN(req_id)){
        //destruimos
        return await model.destroy({where: {id : req_id}});
    }
    //si no existe id
    return {data: {}};
}

  
module.exports = {
    findAll: findAll,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy,
};