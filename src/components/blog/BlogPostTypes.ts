
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  created_at: string;
  updated_at?: string;
  image_url?: string;
  category: string;
  is_popular: boolean;
  is_featured?: boolean;
}
