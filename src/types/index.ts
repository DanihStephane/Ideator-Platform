export interface Idea {
  id: string;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  status: 'new' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  files: AttachedFile[];
  archived: boolean;
}

export interface AttachedFile {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}