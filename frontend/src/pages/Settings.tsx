import React from 'react';

interface SettingsProps {
  setBgColor: (color: string) => void; // Fonction qui met à jour la couleur du fond
}

const Settings: React.FC<SettingsProps> = ({ setBgColor }) => {
  // Liste des couleurs disponibles, ici on utilise les couleurs définies dans tailwind.config.js
  const colors = [
    { name: 'purple', label: 'Violet', className: 'bg-cvs-purple' },
    { name: 'pink', label: 'Rose', className: 'bg-cvs-pink' },
    { name: 'lavender', label: 'Lavande', className: 'bg-cvs-lavender' },
    { name: 'beige', label: 'Beige', className: 'bg-cvs-beige' },
    { name: 'cream', label: 'Crème', className: 'bg-cvs-cream' },
    { name: 'blue', label: 'Bleu', className: 'bg-cvs-blue' },
    { name: 'olive', label: 'Olive', className: 'bg-cvs-olive' },
    { name: 'rose', label: 'Rose pâle', className: 'bg-cvs-rose' },
    { name: 'green', label: 'Vert', className: 'bg-cvs-green' },
    { name: 'marron', label: 'Marron', className: 'bg-cvs-marron' },
    { name: 'gris', label: 'Gris', className: 'bg-cvs-gris' },
  ];

  // Fonction appelée quand l'utilisateur clique sur une case de couleur
  const handleChangeBackground = (color: string) => {
    console.log(`Changement de couleur: ${color}`); // Débogage
    setBgColor(color); // Change la couleur de fond
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-10 w-full">
      <h2 className="text-xl font-quicksand mb-4 bg-cvs-cream shadow-md rounded-xl p-4 w-full mb-6">
        Paramètres
      </h2>
      <div className="bg-cvs-marron flex flex-col items-center p-6 w-full rounded-2xl">
          <div>
            <label className="block text-xl font-quicksand-semibold mb-4">Choisissez une couleur de fond</label>
            <div className="flex flex-wrap gap-4">
              {/* Afficher chaque couleur sous forme de case colorée */}
              {colors.map((color) => (
                <div
                  key={color.name}
                  onClick={() => handleChangeBackground(color.className)}
                  className={`w-16 h-16 cursor-pointer rounded-lg border-2 ${color.className}`}
                >
                  <span className="sr-only">{color.label}</span> {/* Pour l'accessibilité */}
                </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
};

export default Settings;
