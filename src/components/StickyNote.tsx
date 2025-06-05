import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Trash2, Minimize2, Maximize2, Palette } from 'lucide-react';
import { Note as NoteType, NotePosition, NOTE_COLORS, NOTE_TEXT_COLORS, NoteColor } from '../types';
import { useNotes } from '../context/NotesContext';

interface NoteProps {
  note: NoteType;
}

export const StickyNote: React.FC<NoteProps> = ({ note }) => {
  const { updateNote, deleteNote, bringToFront } = useNotes();
  const nodeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });

  // Bring note to front when clicked
  const handleNoteClick = () => {
    bringToFront(note.id);
  };

  // Update content when textarea changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(note.id, { content: e.target.value });
  };

  // Track drag position
  const handleDrag = (_e: any, data: { x: number; y: number }) => {
    const newPosition: NotePosition = { x: data.x, y: data.y };
    updateNote(note.id, { position: newPosition });
  };

  // Start resize
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: note.size.width, height: note.size.height });
  };

  // Handle mouse move for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      e.preventDefault();
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      
      const newWidth = Math.max(150, startSize.width + dx);
      const newHeight = Math.max(120, startSize.height + dy);
      
      updateNote(note.id, { size: { width: newWidth, height: newHeight } });
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
    };
    
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startPos, startSize, note.id, updateNote]);

  // Set focus to content when note is created
  useEffect(() => {
    if (note.content === '' && contentRef.current) {
      contentRef.current.focus();
    }
  }, [note.content]);

  const colorClasses = NOTE_COLORS[note.color];
  const textColorClass = NOTE_TEXT_COLORS[note.color];

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".note-handle"
      defaultPosition={note.position}
      position={note.position}
      onDrag={handleDrag}
      onMouseDown={handleNoteClick}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className={`absolute ${colorClasses} rounded-md shadow-lg border overflow-hidden transition-shadow hover:shadow-xl`}
        style={{
          width: `${note.size.width}px`,
          height: note.minimized ? '40px' : `${note.size.height}px`,
          zIndex: note.zIndex,
        }}
      >
        {/* Note header */}
        <div className={`note-handle h-10 ${colorClasses} border-b flex items-center justify-between p-2 cursor-move`}>
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowColorPicker(!showColorPicker);
              }}
              className="p-1 rounded-full hover:bg-black/10 transition-colors"
              aria-label="Change color"
            >
              <Palette size={16} className={textColorClass} />
            </button>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateNote(note.id, { minimized: !note.minimized });
              }}
              className="p-1 rounded-full hover:bg-black/10 transition-colors"
              aria-label={note.minimized ? "Maximize" : "Minimize"}
            >
              {note.minimized ? (
                <Maximize2 size={16} className={textColorClass} />
              ) : (
                <Minimize2 size={16} className={textColorClass} />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
              className="p-1 rounded-full hover:bg-black/10 transition-colors"
              aria-label="Delete note"
            >
              <Trash2 size={16} className={textColorClass} />
            </button>
          </div>
        </div>

        {/* Color picker dropdown */}
        {showColorPicker && !note.minimized && (
          <div className="absolute top-10 left-0 bg-white shadow-lg rounded-md p-2 z-50 flex flex-wrap gap-2">
            {Object.keys(NOTE_COLORS).map((color) => (
              <button
                key={color}
                onClick={() => {
                  updateNote(note.id, { color: color as NoteColor });
                  setShowColorPicker(false);
                }}
                className={`w-6 h-6 rounded-full ${NOTE_COLORS[color as NoteColor]} border hover:scale-110 transition-transform`}
                aria-label={`Change to ${color}`}
              />
            ))}
          </div>
        )}

        {/* Note content */}
        {!note.minimized && (
          <textarea
            ref={contentRef}
            value={note.content}
            onChange={handleContentChange}
            onClick={handleNoteClick}
            className={`w-full h-[calc(100%-40px)] p-3 bg-transparent resize-none focus:outline-none ${textColorClass}`}
            placeholder="Write your note here..."
            style={{ overflowY: 'auto' }}
          />
        )}

        {/* Resize handle */}
        {!note.minimized && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={handleResizeStart}
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)',
              backgroundSize: '3px 3px',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              padding: '8px',
            }}
          />
        )}
      </div>
    </Draggable>
  );
};