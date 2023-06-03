const express = require('express')
const app = express()
const port = 3000
const bodyparser = require('body-parser')
const Bcrypt = require('bcrypt')
const connection = require('./database/connection')
const cadastroUser = require('./database/cadastro_user')
const usuario = require('./database/cadastro_user')


//Configurando body-parser
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())


//Configurando ejs
app.set('view engine', 'ejs')


//Configurando arquivos staticos
app.use(express.static('public'))


//Configuração da conexão com o banco de dados
connection
    .authenticate()
    .then(()=>{
        console.log('Conexão com o banco de dados Feita com SUCESSO!')
    }).catch((error)=>{
        console.log(error)
    })


//Rota Principal
app.get('/', (req, res)=>{
    res.render('index.ejs')
})

//Rota Main
app.get('/main', (req, res)=>{
    res.render('page/main')
})

//Rota Login
app.get('/login', (req, res)=>{
    res.render('login')
})

//Rota Cadastro
app.get('/cadastro', (req, res)=>{
    res.render('cadastro')
})


//Rota de Cadastro
app.post('/cadastro-user', (req, res)=>{
    
    var email = req.body.email
    var senha = req.body.senha
    
    var salt = Bcrypt.genSaltSync(10)
    var hash = Bcrypt.hashSync(senha, salt)

    cadastroUser.create({
        email: email,
        senha: hash,
        senha_2: req.body.senha_2
    }).then(function(){
        res.redirect("/login")
    }).catch(function(error){
        res.send("Ouve Error no Cadastro (CADASTRO NÃO EFETUADO)!" + error)
    })
})


//Rota Logar com Sucesso
app.post('/logado', (req, res)=>{
    var email = req.body.email
    var senha = req.body.senha

    cadastroUser.findOne({where:{email:email}}).then(usuario =>{
        if(usuario!=undefined){
            var correct = Bcrypt.compareSync(senha, usuario.senha)
            if(correct){
                res.render("page/main")
            }else{
                res.redirect("/cadastro")
            }
        }
    })
})


//Rota Filmes
app.get('/filmes', (req, res)=>{
    res.render('page/filmes')
})

//Rota Series
app.get('/series', (req, res)=>{
    res.render('page/series')
})

//Para Iniciar o Servidor
app.listen(port, ()=>{
    console.log('Servidor Online')
})

