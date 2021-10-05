export interface Snippet {
    id: string; 
    user?: string | null;
    title: string;
    description: string; 
    statement_delimiter: string;
    content: string;
    created_at?: string;
    updated_at?: string;
  }