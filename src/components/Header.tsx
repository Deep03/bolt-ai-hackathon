import React from 'react';
import { Plus, Trash2, Moon, Sun } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { NoteColor } from '../types';

export const Header: React.FC = () => {
  const { addNote, deleteAllNotes } = useNotes();
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Color options
  const colors: NoteColor[] = ['yellow', 'blue', 'green', 'pink', 'purple'];
  
  // Color map for the buttons
  const colorClasses: Record<NoteColor, string> = {
    yellow: 'bg-amber-200 hover:bg-amber-300',
    blue: 'bg-blue-200 hover:bg-blue-300',
    green: 'bg-green-200 hover:bg-green-300',
    pink: 'bg-pink-200 hover:bg-pink-300',
    purple: 'bg-purple-200 hover:bg-purple-300',
  };

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const createNewNote = (color: NoteColor) => {
    const centerX = window.innerWidth / 2 - 110;
    const centerY = window.innerHeight / 2 - 110;
    
    // Add some randomness to avoid perfect stacking
    const randomOffset = 20;
    const x = centerX + Math.random() * randomOffset - randomOffset / 2;
    const y = centerY + Math.random() * randomOffset - randomOffset / 2;
    
    addNote('', { x, y }, color);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold">Sticky Notes</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 mr-4">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => createNewNote(color)}
                className={`w-7 h-7 rounded-full flex items-center justify-center ${colorClasses[color]} transition-transform hover:scale-110`}
                title={`Create new ${color} note`}
              >
                <Plus size={16} className="text-zinc-700" />
              </button>
            ))}
          </div>
          
          <button
            onClick={() => deleteAllNotes()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Delete all notes"
          >
            <Trash2 size={20} className="text-red-500" />
          </button>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {darkMode ? (
              <Sun size={20} className="text-amber-400" />
            ) : (
              <Moon size={20} />
            )}
          </button>
        </div>
      </div>
      <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-500 dark:text-zinc-400 flex justify-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <kbd className="px-1 py-0.5 bg-white dark:bg-zinc-700 rounded border border-zinc-300 dark:border-zinc-600 text-xs mx-1">Shift</kbd>
            <span>+</span>
            <kbd className="px-1 py-0.5 bg-white dark:bg-zinc-700 rounded border border-zinc-300 dark:border-zinc-600 text-xs mx-1">N</kbd>
            <span className="ml-2">New Note</span>
          </div>
        </div>
      </div>
    </header>
  );
};