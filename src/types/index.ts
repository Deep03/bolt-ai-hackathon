export type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple';

export interface Note {
  id: string;
  content: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  color: NoteColor;
  createdAt: Date;
  updatedAt: Date;
  zIndex: number;
}

export interface NoteFormState {
  isOpen: boolean;
  position: { x: number; y: number } | null;
}