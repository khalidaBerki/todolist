import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

// Requête pour récupérer les tâches
const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      description
      status
      created_at
      completed_at
    }
  }
`;

// Mutation pour supprimer une tâche
const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

const CompletedTasks: React.FC = () => {
  const { loading, error, data } = useQuery(GET_TASKS);
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    awaitRefetchQueries: true,
  });

  const [removingTask, setRemovingTask] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set()); // État pour suivre les tâches sélectionnées
  const [isSelectMode, setIsSelectMode] = useState(false); // Mode sélection activé ou non

  if (loading) return <p>Chargement des tâches...</p>;
  if (error) return <p>Erreur lors de la récupération des tâches : {error.message}</p>;

  // Filtrer et trier les tâches complètes
  const completedTasks = data.tasks.filter((task: any) => task.status === 'complete');
  completedTasks.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleDeleteTask = async (id: string) => {
    setRemovingTask(id);
    try {
      setTimeout(async () => {
        await deleteTask({
          variables: { id },
        });
        setRemovingTask(null);
      }, 500);
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche', error);
    }
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode); // Activer/désactiver le mode sélection
    setSelectedTasks(new Set()); // Réinitialiser la sélection quand on quitte le mode sélection
  };

  const handleSelectTask = (taskId: string) => {
    const updatedSelection = new Set(selectedTasks);
    if (updatedSelection.has(taskId)) {
      updatedSelection.delete(taskId); // Si déjà sélectionnée, la désélectionner
    } else {
      updatedSelection.add(taskId); // Sinon, ajouter la tâche à la sélection
    }
    setSelectedTasks(updatedSelection);
  };

  const handleSelectAll = () => {
    // Si toutes les tâches sont sélectionnées, désélectionner toutes
    if (selectedTasks.size === completedTasks.length) {
      setSelectedTasks(new Set());
    } else {
      // Sinon, sélectionner toutes les tâches
      const allTaskIds = new Set(completedTasks.map((task: any) => task.id));
      setSelectedTasks(allTaskIds);
    }
  };

  const handleDeleteSelectedTasks = async () => {
    for (const taskId of selectedTasks) {
      await deleteTask({ variables: { id: taskId } });
    }
    setSelectedTasks(new Set()); // Réinitialiser la sélection après suppression
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-10 w-full">
      {/* Titre de la page avec le bouton pour activer le mode sélection */}
      <div className="flex justify-between w-full max-w-5xl mb-6">
        <h2 className="text-xl font-quicksand bg-cvs-cream shadow-md rounded-xl w-3/4 p-4">
          Tâches validées
        </h2>
        <button
          onClick={toggleSelectMode}
          className="bg-cvs-rose text-white font-bold px-4 py-2 rounded-xl hover:bg-blue-600"
        >
          {isSelectMode ? 'Annuler sélection' : 'Sélectionner plusieurs'}
        </button>
      </div>

      {/* Si le mode sélection est activé, afficher les options de sélection */}
      {isSelectMode && (
        <div className="flex justify-between mb-4 w-full max-w-5xl">
          <button
            onClick={handleSelectAll}
            className="bg-cvs-blue text-white font-bold px-4 py-2 rounded-xl hover:bg-blue-600"
          >
            {selectedTasks.size === completedTasks.length ? 'Désélectionner tout' : 'Tout sélectionner'}
          </button>
          {selectedTasks.size > 0 && (
            <button
              onClick={handleDeleteSelectedTasks}
              className="bg-red-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-red-600"
            >
              Supprimer les tâches sélectionnées
            </button>
          )}
        </div>
      )}

      {/* Bloc contenant toutes les tâches */}
      <div className="bg-cvs-rose flex flex-col items-center p-6 w-full rounded-2xl">
        <div className="w-full max-w-5xl mb-6 flex-grow">
          {/* Afficher "Aucune tâche pour le moment" si la liste est vide */}
          {completedTasks.length === 0 ? (
            <p className="text-center text-gray-600">Aucune tâche pour le moment</p>
          ) : (
            <ul className="w-full">
              {completedTasks.map((task: any, index: number) => (
                <li
                  key={task.id}
                  className={`mb-4 transition-opacity duration-500 ease-out ${
                    removingTask === task.id ? 'opacity-0' : ''
                  }`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Bloc de chaque tâche avec fond blanc */}
                  <div className="bg-white p-6 shadow-lg rounded-md flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-semibold">{task.description}</p>
                      <p className="text-sm text-gray-600">
                        - terminée le {new Date(task.completed_at).toLocaleString('fr-FR')}
                      </p>
                    </div>

                    {/* Case à cocher et bouton pour supprimer la tâche */}
                    <div className="flex items-center space-x-4">
                      {isSelectMode && (
                        <input
                          type="checkbox"
                          checked={selectedTasks.has(task.id)}
                          onChange={() => handleSelectTask(task.id)}
                          className="mr-2"
                        />
                      )}
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="px-4 py-2 text-cvs-marron rounded-md hover:bg-gray-200 transition-all"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedTasks;
