export interface Book {
  id: number;
  title: string;
  isbn: string;
  description: string;
  price: number;
  stock: number;
  publishedAt: string;
  imageUrl: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  author?: { id: number; name: string };
  genre?: { id: number; name: string };
  publisher?: { id: number; name: string };
}
