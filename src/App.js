import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ first_name: '', last_name: '', avatar: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://reqres.in/api/users');//busca a lista dos usuario com nomes e fotos
      setUsers(response.data.data);
    } catch (error) {
      console.error('Erro ao obter os usuários:', error);
    }
  };

  const createUser = async () => {
    try {
      const response = await axios.post('https://reqres.in/api/users', newUser);//adicionar usuario novo
      console.log('Novo usuário adicionado:', response.data);
      fetchUsers();
      setUsers([...users, response.data]);
    } catch (error) {
      console.error('Erro ao adicionar novo usuário:', error);
    }
  };
  
  return (
    <div className="container">
      <h1>Usuários</h1>
      <div className="card-container">
        {users.map((user) => (
          <div key={user.id} className="card" onClick={() => handleSelectUser(user)}>
            <img src={user.avatar} alt="Avatar" />
            <p>{user.first_name} {user.last_name}</p>
          </div>
        ))}
      </div>
      {newUser.first_name && (
        <p>{newUser.first_name} (Novo usuário adicionado)</p>
      )}
      {updateMessage && <p>{updateMessage}</p>}

      <div className="margin-card">
      <h2>Adicionar Novo Usuário</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createUser();
        }}
      >
        <label htmlFor="name">Nome:</label>
        <input
          type="text"
          id="name"
          name="first_name"
          value={newUser.first_name}
          onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
        />
        <button type="submit">Adicionar Usuário</button>
      </form>

      </div>
      
      {selectedUser && (
        <div className="margin-card">
          <h2>Editar Usuário</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUser();
            }}
          >
            <label htmlFor="firstName">Primeiro Nome:</label>
            <input
              type="text"
              id="firstName"
              name="first_name"
              value={selectedUser.first_name}
              onChange={handleInputChange}
            />
            <label htmlFor="lastName">Último Nome:</label>
            <input
              type="text"
              id="lastName"
              name="last_name"
              value={selectedUser.last_name}
              onChange={handleInputChange}
            />
            <button type="submit">Atualizar Usuário</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
