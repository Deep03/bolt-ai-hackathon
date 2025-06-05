import React, {useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import { StickyNote } from './StickyNote';

export const NoteBoard: React.FC = () => {
  const { notes, addNote } = useNotes();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift+N to create new note
      if (e.shiftKey && e.key === 'N') {
        e.preventDefault();
        
        // Create note at a random position on screen
        const randomX = 100 + Math.random() * (window.innerWidth - 300);
        const randomY = 100 + Math.random() * (window.innerHeight - 300);
        
        addNote('', { x: randomX, y: randomY });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addNote]);

  // Double click to add new note
  const handleDoubleClick = (e: React.MouseEvent) => {
    // Don't create a note if we clicked on an existing note
    if ((e.target as HTMLElement).closest('.sticky-note')) {
      return;
    }

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    addNote('', { x, y });
  };

  return (
    <main 
      className="flex-grow relative overflow-hidden"
      onDoubleClick={handleDoubleClick}
    >
      {notes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500">
          <p className="text-lg mb-2">No notes yet</p>
          <p className="text-sm">Double-click anywhere to create a note</p>
          <p className="text-sm">Or use Shift+N keyboard shortcut</p>
        </div>
      )}
      
      {notes.map(note => (
        <StickyNote key={note.id} note={note} />
      ))}
    </main>
  );
};