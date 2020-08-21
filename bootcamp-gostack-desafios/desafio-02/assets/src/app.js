const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { v4: isUuid } = require('uuid');
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId( request, response, next) {
	const {id} = request.params;

	if(!isUuid(id)) {
	
		return response.status(400).json({ error: 'Invalid project ID.'});	

	}

	return next();
}

app.use('/repositories/:id',validateProjectId);

app.get("/repositories", (request, response) => {
  // TODO

  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const likes = 0;

  const repo = {id: uuid(), title, url, techs, likes};

  repositories.push(repo);

  return response.json(repo);

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id ==  id);

  if (repoIndex < 0){
    return response.status(400).json({ error: 'Project not found.'});
  }

  const likes = repositories[repoIndex].likes;

  const repo = {id ,title, url, techs, likes};

  repositories[repoIndex] = repo;

  return response.json(repo);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id ==  id);

  if (repoIndex < 0){
    return response.status(400).json({ error: 'Project not found.'});
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id ==  id);

  if (repoIndex < 0){
    return response.status(400).json({ error: 'Project not found.'});
  }

  repositories[repoIndex].likes += 1;

  return response.json(repositories[repoIndex]);

});

module.exports = app;
