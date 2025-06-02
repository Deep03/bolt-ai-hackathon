import React from 'react';
import { StickyNote } from 'lucide-react';

export const EmptyBoard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-500 p-4">
      <StickyNote size={64} className="mb-4 opacity-50" />
      <h3 className="text-xl font-semibold mb-2">No Notes Yet</h3>
      <p className="text-center max-w-md mb-4">
        Create your first note by clicking the + button in the header or double-clicking anywhere on the board.
      </p>
      <div className="flex flex-col gap-2 bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg text-sm">
        <div className="flex items-center">
          <kbd className="px-2 py-1 bg-white dark:bg-zinc-700 rounded border border-zinc-300 dark:border-zinc-600 text-xs mr-2">Double-click</kbd>
          <span>Create a note at cursor position</span>
        </div>
        <div className="flex items-center">
          <kbd className="px-2 py-1 bg-white dark:bg-zinc-700 rounded border border-zinc-300 dark:border-zinc-600 text-xs mr-2">Shift+N</kbd>
          <span>Create a new note</span>
        </div>
      </div>
    </div>
  );
};