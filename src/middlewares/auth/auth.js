const {ApplicationError} = require ('../../error/ApplicationError');
const {verify} = require('jsonwebtoken');

function validaToken(request, response, next) {
    const authorizationHeader = request.headers.authorization;

    if(!authorizationHeader) {
        throw new ApplicationError('Nenhum token enviado!', 403);
    }

    const [, token] = authorizationHeader.split(' ');
    
    try {
        const tokenDecodificado = verify(token, 'minha-chave-secreta');
        const { sub } = tokenDecodificado;

        request.user = sub;
        console.log(tokenDecodificado);
        
        return next();
    } catch {
        throw new ApplicationError('Erro ao verificar token!', 401);
    }

}

module.exports = {
    validaToken
}

