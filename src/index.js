const express = require('express');
const multer = require('multer');
const uploadConfig = require('./upload/uploadConfig');
const {ApplicationError} = require('./error/ApplicationError');
const {validaToken} = require('./middlewares/auth/auth');
const {sign} = require('jsonwebtoken');

const app = express();
const uploadMiddleware = multer(uploadConfig);

app.use(express.json());
app.use('/imagens', express.static(uploadConfig.directory));
function monitorarRequisicoes(request, response, next) {
    const { method, url, params, body, query } = request;

    const texto = `[${method} - ${url} - params: ${JSON.stringify(params)} 
        - body: ${JSON.stringify(body)} - query: ${JSON.stringify(query)}]`;

    console.log(texto);

    return next();
}

app.use('/disciplinas', monitorarRequisicoes);

app.post('/disciplinas', uploadMiddleware.single('avatar'), (request, response) => {

    const body = request.body;

    return response.json(body);
});

app.get('/disciplinas', (request, response) => {

    const query = request.query;

    return response.json(query);
});

app.post('/autenticacao', (request, response) => {
    const { email, senha } = request.body;

    //... Validações quanto ao e-mail e senha

    const idUsuario = "XPTO"

    const token = sign({
        //Não incluir informações sensíveis
        //Permissões, etc...
    }, 'minha-chave-secreta', {
        subject: idUsuario,
        expiresIn: '1d'
    });

    return response.json({token});
});

app.put('/disciplinas/:id', validaToken, (request, response) => {

    const { id } = request.params;

    if (id !== "tecnologia") {
        throw new ApplicationError('Disciplina não encontrada.', 404);
    }

    return response.json({id});
});

app.delete('/disciplinas', (request, response) => {
    return response.json({
        message: "Nessa rota devo remover uma disciplina!"
    });
});

app.use((error, request, response, next) => {
    if (error instanceof ApplicationError) {
        return response.status(error.httpStatusCode).json({message: error.mensagem});
    }

    return response.status(500).json({message: 'Não foi possível processar sua requisição. Tente novamente mais tarde.'});
});

app.listen(3000);