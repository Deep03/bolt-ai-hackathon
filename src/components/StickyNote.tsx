import React, { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { X, PaintBucket } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { Note, NoteColor } from '../types';

interface StickyNoteProps {
  note: Note;
}

export const StickyNote: React.FC<StickyNoteProps> = ({ note }) => {
  const { updateNote, deleteNote, bringToFront } = useNotes();
  const [isResizing, setIsResizing] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const noteRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const startResizeRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: note.id,
    data: note,
  });

  // Color classes for the sticky note
  const colorClasses: Record<NoteColor, string> = {
    yellow: 'bg-amber-100 border-amber-200',
    blue: 'bg-blue-100 border-blue-200',
    green: 'bg-green-100 border-green-200',
    pink: 'bg-pink-100 border-pink-200',
    purple: 'bg-purple-100 border-purple-200',
  };

  // Color options for the color picker
  const colorOptions: NoteColor[] = ['yellow', 'blue', 'green', 'pink', 'purple'];
  
  // Styles for the note position and size
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${note.position.x}px`,
    top: `${note.position.y}px`,
    width: `${note.size.width}px`,
    height: `${note.size.height}px`,
    zIndex: note.zIndex,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  // Handle text changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(note.id, { content: e.target.value });
  };

  // Handle deleting a note
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNote(note.id);
  };

  // Start resize operation
  const handleStartResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsResizing(true);
    
    if (noteRef.current) {
      startResizeRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: note.size.width,
        height: note.size.height
      };
    }
    
    window.addEventListener('mousemove', handleResize);
    window.addEventListener('mouseup', handleEndResize);
  };

  // Handle resize operation
  const handleResize = (e: MouseEvent) => {
    if (isResizing && startResizeRef.current) {
      const dx = e.clientX - startResizeRef.current.x;
      const dy = e.clientY - startResizeRef.current.y;
      
      const newWidth = Math.max(150, startResizeRef.current.width + dx);
      const newHeight = Math.max(150, startResizeRef.current.height + dy);
      
      updateNote(note.id, {
        size: {
          width: newWidth,
          height: newHeight
        }
      });
    }
  };

  // End resize operation
  const handleEndResize = () => {
    setIsResizing(false);
    startResizeRef.current = null;
    window.removeEventListener('mousemove', handleResize);
    window.removeEventListener('mouseup', handleEndResize);
  };

  // Handle color change
  const handleColorChange = (color: NoteColor) => {
    updateNote(note.id, { color });
    setShowColorPicker(false);
  };

  // Bring note to front when clicked
  const handleNoteClick = () => {
    bringToFront(note.id);
  };

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleEndResize);
    };
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === textareaRef.current && e.key === 'Delete') {
        deleteNote(note.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [note.id, deleteNote]);
  
  return (
    <div
      ref={setNodeRef}
      className={`sticky-note ${colorClasses[note.color]} shadow-md rounded-md border overflow-hidden transition-shadow duration-200 hover:shadow-lg`}
      style={style}
      onClick={handleNoteClick}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        setShowControls(false);
        setShowColorPicker(false);
      }}
    >
      {/* Note Controls */}
      <div
        className={`absolute top-0 right-0 p-1 z-10 flex transition-opacity duration-200 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          className="p-1.5 rounded-full hover:bg-black/10 transition-colors mr-1"
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <PaintBucket size={14} className="text-zinc-900" />
        </button>
        <button
          className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
          onClick={handleDelete}
        >
          <X size={14} className="text-zinc-900" />
        </button>
      </div>

      {/* Color Picker */}
      {showColorPicker && (
        <div className="absolute top-8 right-2 p-2 bg-white rounded-lg shadow-lg z-20 flex flex-col gap-2">
          {colorOptions.map(color => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full ${colorClasses[color].replace('border-', '')} hover:scale-110 transition-transform`}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </div>
      )}

      {/* Drag Handle */}
      <div
        className="h-6 bg-black/5 cursor-move"
        {...attributes}
        {...listeners}
      ></div>

      {/* Note Content */}
      <textarea
        ref={textareaRef}
        value={note.content}
        onChange={handleContentChange}
        className="w-full h-[calc(100%-32px)] p-3 resize-none bg-transparent focus:outline-none text-zinc-900"
        placeholder="Type your note here..."
      />

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
        onMouseDown={handleStartResize}
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />
    </div>
  );
};