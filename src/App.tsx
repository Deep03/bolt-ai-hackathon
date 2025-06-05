import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { NoteBoard } from './components/NoteBoard';
import { Header } from './components/Header';
import { NotesProvider, useNotes } from './context/NotesContext';

function AppContent() {
  const { updateNote } = useNotes();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const note = active.data.current;
    
    if (note) {
      updateNote(note.id, {
        position: {
          x: note.position.x + delta.x,
          y: note.position.y + delta.y,
        },
      });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen">
        <Header />
        <NoteBoard />
      </div>
    </DndContext>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <NotesProvider>
        <AppContent />
      </NotesProvider>
    </div>
  );
}

export default App;