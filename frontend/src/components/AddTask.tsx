import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

// Mutation pour créer une tâche
const CREATE_TASK = gql`
  mutation CreateTask($description: String!) {
    createTask(description: $description) {
      id
      description
      status
      created_at
      completed_at
    }
  }
`;

interface AddTaskProps {
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
}

const AddTask: React.FC<AddTaskProps> = ({ setTasks }) => {
  const [description, setDescription] = useState('');
  const [createTask] = useMutation(CREATE_TASK);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      try {
        const { data: newTaskData } = await createTask({
          variables: { description },
        });

        // Met à jour les tâches locales avec la nouvelle tâche
        setTasks((prevTasks) => [...prevTasks, newTaskData.createTask]);

        // Réinitialise le champ de description après l'ajout
        setDescription('');
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche', error);
      }
    }
  };

  return (
    <div>
      <h2>Ajouter une nouvelle tâche</h2>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description de la tâche"
        />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AddTask;
