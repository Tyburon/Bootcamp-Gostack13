import React, { useEffect, useState} from "react";
import api from './services/api'

import "./styles.css";

function App() {

  const [repos, setRepos] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepos(response.data);
    });
  }, []);

  async function handleAddRepository() {
    // TODO
    const response = await api.post('repositories', {
      title:'teste',
      url:'https://github.com/Tyburon/teste',
      techs: ['Node.Js', 'ReactJS']
    })

    setRepos([...repos, response.data]);
  }

  async function handleRemoveRepository(id) {
    // TODO
    await api.delete(`repositories/${id}`);

    setRepos(repos.filter(
      repo => repo.id != id
    ))
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repos.map(repo => (
          <li key={repo.id}>
          {repo.title}

          <button onClick={() => handleRemoveRepository(repo.id)}>
            Remover
          </button>
        </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
