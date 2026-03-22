
function response(setup){
    setup.res.status(setup.status).send({
        data :      setup.result    != null ? setup.result : null,
        message :   setup.data      != null ? setup.message : null,
        count :     setup.count     != null ? setup.count : null,
    });
};

module.exports = {
    response: response,
};