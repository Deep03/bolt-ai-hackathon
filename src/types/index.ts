export type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple';

export interface NotePosition {
  x: number;
  y: number;
}

export interface NoteSize {
  width: number;
  height: number;
}

export interface Note {
  id: string;
  content: string;
  position: NotePosition;
  size: NoteSize;
  color: NoteColor;
  createdAt: Date;
  updatedAt: Date;
  zIndex: number;
  minimized?: boolean;
}

export const NOTE_COLORS: Record<NoteColor, string> = {
  yellow: 'bg-amber-100 border-amber-200',
  blue: 'bg-blue-100 border-blue-200',
  green: 'bg-green-100 border-green-200',
  pink: 'bg-pink-100 border-pink-200',
  purple: 'bg-purple-100 border-purple-200'
};

export const NOTE_TEXT_COLORS: Record<NoteColor, string> = {
  yellow: 'text-amber-900',
  blue: 'text-blue-900',
  green: 'text-green-900',
  pink: 'text-pink-900',
  purple: 'text-purple-900'
};

export interface NoteFormState {
  isOpen: boolean;
  position: NotePosition | null;
}