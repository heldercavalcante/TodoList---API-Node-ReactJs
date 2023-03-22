import './home.css';
import { useEffect, useState } from 'react';

function Home() {

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState('');

  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    getTasks();
  }, []);

  async function createTask(event) {

    try {

    event.preventDefault();
    const dataJson = JSON.stringify({title:title});
    await fetch('http://localhost:3333/tasks', {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: dataJson
    });
    setTitle('');
    getTasks();

    } catch (error) {
      console.error(error);
    }

  }

  async function deleteTask(id) {

    try {

    await fetch(`http://localhost:3333/tasks/${id}`, {
      method: "DELETE"
    });

    getTasks();

    } catch (error) {
      console.error(error);
    }
  }

  async function getTasks() {
    try {

      const response = await fetch('http://localhost:3333/tasks');
      const data = await response.json();
      setTasks(data);

    } catch (error) {
      console.error(error);
    }
  }

  async function updateTask({id, title, status}) {

    try {

      await fetch(`http://localhost:3333/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({title, status})
      });

      getTasks();

    } catch (error) {
      console.error(error);
    }

  }

  function formatDate(dateUTC) {

    const options = { dateStyle: 'long', timeStyle: 'short' }
    const date = new Date(dateUTC).toLocaleString('pt-br',options);

    return date;
  }

  const handleUpdateClick = (taskId) => {
    setEditMode(taskId);
  };
  
  return (
    <main>
      <form className='add-form' onSubmit={createTask}>
        <input 
         type="text"
         placeholder='Adicionar tarefa' 
         className='input-task' 
         value={title}
         onChange={(event) => {setTitle(event.target.value)}}
         />
        <button type='submit'>+</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Tarefa</th>
            <th>Criada em</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>
                {editMode === task.id ? (
                  <form onSubmit={(event) => updateTask(task)}>
                    <input 
                    type="text"
                    className='input-task' 
                    value={task.title}
                    onChange={(event) => {setTasks(tasks.map((t) => 
                      t.id === task.id ? { ...t, title: event.target.value } : t))}}
                    />
                  </form>
                ) : (
                  task.title
                )}
              </td>
              <td>{formatDate(task.created_at)}</td>
              <td>
                <select value={task.status} onChange={(event) => updateTask({...task, status: event.target.value})}>
                  <option value="pendente">pendente</option>
                  <option value="em andamento">Em andamento</option>
                  <option value="concluida">concluída</option>
                </select>
              </td>
              <td>
                <button className='btn-action' onClick={() => handleUpdateClick(task.id)}>
                  <span className="material-symbols-outlined">
                    edit
                  </span>
                </button>
                <button className='btn-action' onClick={() => {deleteTask(task.id)}}>
                  <span className="material-symbols-outlined">
                    delete
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default Home;