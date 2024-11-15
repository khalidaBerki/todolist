import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { format } from 'date-fns';

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

// Mutation pour mettre à jour le statut d'une tâche
const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: ID!, $status: String!, $completed_at: DateTime) {
    updateTaskStatus(id: $id, status: $status, completed_at: $completed_at) {
      id
      status
      completed_at
    }
  }
`;

const TasksInProgress: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(GET_TASKS, { notifyOnNetworkStatusChange: true });
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);

  const [tasks, setTasks] = useState<{
    id: string;
    description: string;
    status: string;
    created_at: string;
    completed_at: string | null;
  }[]>([]);

  const [completedTaskMessage, setCompletedTaskMessage] = useState<string | null>(null);
  const [removingTask, setRemovingTask] = useState<string | null>(null);

  useEffect(() => {
    // Recharger les tâches chaque fois que le composant se monte ou que l'on revient dans cet onglet
    refetch().then((newData) => {
      setTasks(newData.data.tasks);
    });
  }, [refetch]);

  const handleChangeStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'en_cours' ? 'complete' : 'en_cours';
    const completedAt =
      newStatus === 'complete' ? format(new Date(), 'yyyy-MM-dd HH:mm:ss') : null;

    // Démarrer l'animation avant de mettre à jour la tâche
    setRemovingTask(id);

    setTimeout(async () => {
      try {
        const { data: updatedTask } = await updateTaskStatus({
          variables: { id, status: newStatus, completed_at: completedAt },
        });

        // Mettre à jour l'état des tâches avec les nouvelles données
        setTasks(
          tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: updatedTask.updateTaskStatus.status,
                  completed_at: updatedTask.updateTaskStatus.completed_at,
                }
              : task
          )
        );

        if (newStatus === 'complete') {
          const taskDescription = tasks.find((task) => task.id === id)?.description;
          setCompletedTaskMessage(`La tâche "${taskDescription}" est maintenant terminée.`);
          setTimeout(() => setCompletedTaskMessage(null), 4000); // Cache le message après 4 secondes
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut', error);
      } finally {
        // Supprimer la tâche après l'animation
        setRemovingTask(null);
      }
    }, 500); // Délai pour laisser le temps à l'animation de se produire
  };

  const tasksInProgress = tasks.filter((task) => task.status === 'en_cours');

  if (loading) return null; // Ne rien afficher tant que les tâches ne sont pas complètement chargées
  if (error) {
    console.error('Erreur GraphQL:', error);
    return <p>Erreur lors de la récupération des tâches : {error.message}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-10 w-full">
      {/* Titre */}
      <h2 className="text-xl font-quicksand mb-4 bg-cvs-cream shadow-md rounded-xl p-4 w-full mb-6">
        Tâches en cours
      </h2>

      <div className="bg-cvs-blue flex flex-col items-center p-6 w-full rounded-2xl">
        {/* Bloc des tâches */}
        <div className="w-full max-w-5xl mb-6 flex-grow">
          <ul className="w-full space-y-4">
            {tasksInProgress.length === 0 ? (
             <p className="text-center text-gray-600">Aucune tâche en cours</p>
            ) : (
              tasksInProgress.map((task) => (
                <li
                  key={task.id}
                  className={`transition-transform duration-500 ease-out ${
                    removingTask === task.id ? 'transform translate-x-full opacity-0' : ''
                  }`}
                >
                  {/* Bloc de tâche individuel */}
                  <div className="bg-white p-6 shadow-lg rounded-md flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-semibold">{task.description}</p>
                      <p className="text-sm text-gray-600">
                        Créée le {format(new Date(task.created_at), 'dd MMM yyyy à HH:mm:ss')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleChangeStatus(task.id, task.status)}
                      className="px-4 py-2 bg-cvs-marron text-white rounded-md hover:bg-cvs-rose transition"
                    >
                      Valider
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Message de confirmation avec flèche */}
      {completedTaskMessage && (
        <div className="fixed bottom-10 right-10 bg-cvs-green text-white p-4 rounded-lg shadow-lg animate-slide-in">
          <p className="flex items-center">
            <span className="mr-2">✅</span> {completedTaskMessage}
          </p>
          <div
            className="mt-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-green-500"
          ></div>
        </div>
      )}
    </div>
  );
};

export default TasksInProgress;
