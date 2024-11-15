import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './TaskList.css'; // Fichier CSS pour les animations

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

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: ID!, $status: String!, $completed_at: DateTime) {
    updateTaskStatus(id: $id, status: $status, completed_at: $completed_at) {
      id
      status
      completed_at
    }
  }
`;

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

type Task = {
  id: string;
  description: string;
  status: 'en_cours' | 'complete';
  created_at: string;
  completed_at: string | null;
};

const TaskList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_TASKS);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);
  const [createTask] = useMutation(CREATE_TASK);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set()); // Liste des tâches sélectionnées
  const [selecting, setSelecting] = useState(false); // Mode de sélection des tâches

  useEffect(() => {
    if (data) {
      setTasks(data.tasks);
    }
  }, [data]);

  const handleDeleteTask = async (id: string) => {
    try {
      const { data: deletedTask } = await deleteTask({
        variables: { id },
      });
      setTasks(tasks.filter((task) => task.id !== deletedTask.deleteTask.id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche', error);
    }
  };

  const handleDeleteSelectedTasks = async () => {
    try {
      for (const id of selectedTasks) {
        await deleteTask({
          variables: { id },
        });
      }
      setTasks(tasks.filter((task) => !selectedTasks.has(task.id)));
      setSelectedTasks(new Set()); // Réinitialiser les tâches sélectionnées
      setSelecting(false); // Désactiver le mode de sélection
    } catch (error) {
      console.error('Erreur lors de la suppression des tâches sélectionnées', error);
    }
  };

  const handleChangeStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'en_cours' ? 'complete' : 'en_cours';
    const completedAt =
      newStatus === 'complete' ? format(new Date(), 'yyyy-MM-dd HH:mm:ss') : null;

    try {
      const { data: updatedTask } = await updateTaskStatus({
        variables: { id, status: newStatus, completed_at: completedAt },
      });
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
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut', error);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskDescription.trim()) {
      try {
        const { data: newTaskData } = await createTask({
          variables: { description: newTaskDescription },
        });
        setTasks((prevTasks) => [newTaskData.createTask, ...prevTasks]);
        setNewTaskDescription('');
      } catch (error) {
        console.error("Erreur lors de l'ajout de la tâche", error);
      }
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'dd MMM yyyy à HH:mm:ss');
  };

  const sortedTasks = [...tasks].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const maxCompletedTasks = 10;

  if (loading) return <p>Chargement des tâches...</p>;
  if (error) return <p>Erreur lors de la récupération des tâches</p>;

  return (
    <div className="min-h-screen flex flex-col items-center p-10 w-3/4 rounded-2xl">
      {/* Section en haut à droite pour gérer la sélection et suppression */}
      <div className="w-full flex justify-between items-center mb-6">
        <div>
          {selecting ? (
            <button
              onClick={handleDeleteSelectedTasks}
              className="bg-red-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-red-600"
            >
              Supprimer les tâches sélectionnées
            </button>
          ) : (
            <button
              onClick={() => setSelecting(true)}
              className="bg-cvs-blue text-white font-bold px-4 py-2 rounded-xl hover:bg-blue-600"
            >
              Sélectionner les tâches à supprimer
            </button>
          )}
        </div>
      </div>

      {/* Formulaire d'ajout à gauche */}
      <div className="bg-cvs-cream shadow-md rounded-xl p-4 w-full max-w-5xl mb-6">
        <h2 className="text-xl font-quicksand mb-4">Ajouter une tâche</h2>
        <form onSubmit={handleAddTask} className="flex items-center space-x-4">
          <input
            type="text"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Description de la tâche"
            className="border p-2 rounded-xl w-4/5"
          />
          <button
            type="submit"
            className="bg-cvs-rose text-white font-bold px-4 py-2 rounded-xl w-1/5 hover:bg-blue-600"
          >
            Ajouter
          </button>
        </form>
      </div>

      {/* Liste des tâches */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        {/* Tâches en cours */}
        <div className="flex-1 bg-cvs-blue shadow-md rounded-xl p-4">
          <h2 className="text-xl font-quicksand mb-4">Tâches en cours</h2>
          <TransitionGroup className="space-y-4">
            {sortedTasks
              .filter((task) => task.status === 'en_cours')
              .map((task) => (
                <CSSTransition key={task.id} timeout={500} classNames="task">
                  <div className="task p-4 bg-white rounded-xl shadow">
                    {selecting && (
                      <input
                        type="checkbox"
                        checked={selectedTasks.has(task.id)}
                        onChange={() => {
                          const newSelectedTasks = new Set(selectedTasks);
                          if (newSelectedTasks.has(task.id)) {
                            newSelectedTasks.delete(task.id);
                          } else {
                            newSelectedTasks.add(task.id);
                          }
                          setSelectedTasks(newSelectedTasks);
                        }}
                        className="mr-2"
                      />
                    )}
                    <p>{task.description}</p>
                    <p className="text-sm text-gray-500">Créée le : {formatDate(task.created_at)}</p>
                    <button
                      onClick={() => handleChangeStatus(task.id, task.status)}
                      className="text-cvs-purple hover:underline"
                    >
                      valider
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 hover:underline ml-4"
                    >
                      Supprimer
                    </button>
                  </div>
                </CSSTransition>
              ))}
          </TransitionGroup>
        </div>

        {/* Tâches complètes */}
        <div className="flex-1 bg-cvs-rose shadow-md rounded-xl p-4">
          <h2 className="text-xl font-quicksand mb-4">Tâches complètes</h2>
          <TransitionGroup className="space-y-4">
            {sortedTasks
              .filter((task) => task.status === 'complete')
              .slice(0, maxCompletedTasks)
              .map((task) => (
                <CSSTransition key={task.id} timeout={500} classNames="task">
                  <div className="task p-4 bg-white rounded-xl shadow">
                    {selecting && (
                      <input
                        type="checkbox"
                        checked={selectedTasks.has(task.id)}
                        onChange={() => {
                          const newSelectedTasks = new Set(selectedTasks);
                          if (newSelectedTasks.has(task.id)) {
                            newSelectedTasks.delete(task.id);
                          } else {
                            newSelectedTasks.add(task.id);
                          }
                          setSelectedTasks(newSelectedTasks);
                        }}
                        className="mr-2"
                      />
                    )}
                    <p>{task.description}</p>
                    <p className="text-sm text-gray-500">Complétée le : {formatDate(task.completed_at)}</p>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </CSSTransition>
              ))}
          </TransitionGroup>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
