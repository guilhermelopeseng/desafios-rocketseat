const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];//cria o array que vai conter os objetos
const numberLike = { // cria o objeto para receber os likes, separada do repositories
  likes: 0
}



app.get("/repositories", (request, response) => { // faz a listagem de todos os repositories
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body // pega do body da requisição somente o title, url, techs, não é para vim o like
  const {likes} = numberLike // o like é para pegar do objeto criado
  const respos = { // reuni as informações
    id: uuid(),
    title,
    url,
    techs,
    likes
  }
  repositories.push(respos) // E acrescenta no array
  return response.json(respos) // retorna o objeto criado
});

app.put("/repositories/:id", (request, response) => { //atualizar
  const {id} = request.params // pega o id do body da requisição
  const {title, url, techs} = request.body; // pega o title o url e o techs da requisição

  const resposIndex = repositories.findIndex( repo => repo.id === id); // procura o indice pelo id

  if(resposIndex < 0){ // se não achar retorna error
    return response.status(400).json({error: 'Repositorie not find'})
  }
  const {likes} = repositories[resposIndex] // se achar pega o likes do repositorio
  const repositorie = { // uni com as demais informações
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[resposIndex] = repositorie // atualiza as informações
  return response.json(repositorie) // retorna o repositorio atualizado

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params // pega o id da requisição 
  const reposIndex = repositories.findIndex(repo => repo.id === id); // verifica se o id tem

  if(reposIndex < 0){ // senão gera um error
    return response.status(400).json({error: 'Repositorie not find'})
  }

  repositories.splice(reposIndex,1) //se sim apaga esse objeto do array

  return response.status(204).send() // retorno o sucesso
});

app.post("/repositories/:id/like", (request, response) => { 
  const {id} = request.params // pega o id da requisição

  const reposIndex = repositories.findIndex(repo => repo.id === id); // verifica se existe esse objeto
  

  if(reposIndex < 0){// senão gera error
    return response.status(400).json({error: 'Repositorie not find'})
  }

  var {title, url, techs, likes} = repositories[reposIndex] // depois pega todas as informações do repositories ja criado, lembrar que não pode ser const

  console.log(title, url, techs, likes) // verificar se pegou certo no log

  likes = likes + 1; // aumentar mais um like
  
  const repositorie = { // unir as informações
    id,
    title,
    url,
    techs,
    likes
  }
  repositories[reposIndex] = repositorie // atualizar o objeto

  return response.json(repositorie) // retornar o objeto atualizado

});

module.exports = app;
