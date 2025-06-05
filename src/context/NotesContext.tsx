import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Note, NoteColor } from '../types';

interface NotesContextProps {
  notes: Note[];
  addNote: (content: string, position: { x: number; y: number }, color?: NoteColor) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  deleteAllNotes: () => void;
  bringToFront: (id: string) => void;
}

const NotesContext = createContext<NotesContextProps | undefined>(undefined);

interface NotesProviderProps {
  children: React.ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('sticky-notes');
    if (savedNotes) {
      return JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('sticky-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (
    content: string = '',
    position: { x: number; y: number },
    color: NoteColor = 'yellow'
  ) => {
    const maxZIndex = notes.length > 0 ? Math.max(...notes.map(note => note.zIndex)) : 0;
    
    const newNote: Note = {
      id: uuidv4(),
      content,
      position,
      size: { width: 220, height: 220 },
      color,
      createdAt: new Date(),
      updatedAt: new Date(),
      zIndex: maxZIndex + 1,
    };
    
    setNotes(prevNotes => [...prevNotes, newNote]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id
          ? {
              ...note,
              ...updates,
              updatedAt: new Date(),
            }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  const deleteAllNotes = () => {
    setNotes([]);
  };

  const bringToFront = (id: string) => {
    const maxZIndex = Math.max(...notes.map(note => note.zIndex));
    
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id
          ? { ...note, zIndex: maxZIndex + 1, updatedAt: new Date() }
          : note
      )
    );
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, deleteAllNotes, bringToFront }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};