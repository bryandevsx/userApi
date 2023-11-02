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
      const response = await axios.get('https://reqres.in/api/users');//busca a lista dos usuário com nomes e fotos
      setUsers(response.data.data);
    } catch (error) {
      console.error('Erro ao obter os usuários:', error);
    }
  };

  const createUser = async () => {
    try {
      const response = await axios.post('https://reqres.in/api/users', newUser);//adicionar usuário novo
      console.log('Novo usuário adicionado:', response.data);
      fetchUsers();
      setUsers([...users, response.data]);
    } catch (error) {
      console.error('Erro ao adicionar novo usuário:', error);
    }
  };

  const updateUser = async () => {
    try {
      if (selectedUser) {
        const updatedUser = await axios.put(`https://reqres.in/api/users/${selectedUser.id}`, selectedUser);//Ao clicar em um nome ja existente ele abre um form e edita o nome.
        console.log('Usuário atualizado:', selectedUser.first_name, selectedUser.last_name);

        const updatedUsers = users.map(user => {
          if (user.id === selectedUser.id) {
            return updatedUser.data;
          }
          return user;
        });

        setUsers(updatedUsers);
        fetchUsers();
        setUpdateMessage(`Usuário ${selectedUser.first_name} ${selectedUser.last_name} atualizado com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao atualizar o usuário:', error);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
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