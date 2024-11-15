import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import client from './apolloClient';
import TaskList from './components/TaskList';
import TasksInProgress from './pages/TasksInProgress';
import CompletedTasks from './pages/CompletedTasks';
import Settings from './pages/Settings';
import './app.css';

const App: React.FC = () => {
  const [bgColor, setBgColor] = useState<string>('bg-cvs-white'); // État pour la couleur de fond
  const [showColorMenu, setShowColorMenu] = useState<boolean>(false); // État pour afficher/masquer le menu déroulant

  return (
    <ApolloProvider client={client}>
      <Router>
        <div className={`${bgColor} text-black p-4 rounded-md min-h-screen`}>
          {/* En-tête */}
          <header className="bg-cvs-gris text-white p-6 rounded-xl shadow-md">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-cvs-marron text-border font-black text-3xl">Todo List</h1>
              <nav>
                <ul className="flex space-x-1 relative">
                  <li>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-cvs-marron font-bold bg-cvs-blue px-1 py-4 rounded-xl'
                          : 'text-cvs-marron font-bold hover:underline hover:text-cvs-rose px-4 py-2'
                      }
                    >
                      Toutes les tâches
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/in-progress"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-cvs-marron font-bold bg-cvs-blue px-1 py-4 rounded-xl'
                          : 'text-cvs-marron font-bold hover:underline hover:text-cvs-rose px-4 py-2'
                      }
                    >
                      Tâches en cours
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/completed"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-cvs-marron font-bold bg-cvs-blue px-1 py-4 rounded-xl'
                          : 'text-cvs-marron font-bold hover:underline hover:text-cvs-rose px-4 py-2'
                      }
                    >
                      Tâches terminées
                    </NavLink>
                  </li>
                  <li
                    className="relative"
                    onMouseEnter={() => setShowColorMenu(true)} // Afficher le menu au survol
                    onMouseLeave={() => setShowColorMenu(false)} // Masquer le menu quand on quitte
                  >
                     <NavLink
                      to="/settings"
                      className={({ isActive }) =>
                        isActive
                          ? 'text-cvs-marron font-bold bg-cvs-blue px-1 py-4 rounded-xl'
                          : 'text-cvs-marron font-bold hover:underline hover:text-cvs-rose px-4 py-2'
                      }
                    >
                      Paramètres
                    </NavLink>
                    {/* Menu déroulant des couleurs */}
                    {showColorMenu && (
                      <div className="absolute bg-white shadow-lg rounded-md p-3 mt-2 w-40 z-10">
                        <p className="text-sm text-cvs-marron font-semibold mb-2">Les plus utilisées :</p>
                        <ul className="space-y-2">
                          <li>
                            <button
                              className="w-full p-2 text-left bg-cvs-white text-gray-900 rounded-md"
                              onClick={() => setBgColor('bg-cvs-white')}
                            >
                              Blanc
                            </button>
                          </li>
                          <li>
                            <button
                              className="w-full p-2 text-left bg-cvs-blue text-blue-500 rounded-md"
                              onClick={() => setBgColor('bg-cvs-blue')}
                            >
                              Bleu
                            </button>
                          </li>
                          <li>
                            <button
                              className="w-full p-2 text-left bg-cvs-rose text-pink-500 rounded-md"
                              onClick={() => setBgColor('bg-cvs-rose')}
                            >
                              Rose
                            </button>
                          </li>
                          <li>
                            <button
                              className="w-full p-2 text-left bg-cvs-cream text-cvs-marron rounded-md"
                              onClick={() => setBgColor('bg-cvs-cream')}
                            >
                              Crème
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Contenu principal */}
          <main className="flex-grow container mx-auto p-6 flex justify-center items-center">
            <Routes>
              <Route path="/" element={<TaskList />} />
              <Route path="/in-progress" element={<TasksInProgress />} />
              <Route path="/completed" element={<CompletedTasks />} />
              <Route path="/settings" element={<Settings setBgColor={setBgColor} />} />
            </Routes>
          </main>

          {/* Pied de page */}
          <footer className="bg-cvs-blue text-white py-4 mt-6">
            <div className="container mx-auto text-center">
              <p className="text-sm">
                © {new Date().getFullYear()} Gestionnaire de tâches. Tous droits réservés.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
