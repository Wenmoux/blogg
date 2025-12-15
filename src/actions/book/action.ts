'use server';

import fs from 'fs/promises';
import path from 'path';

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  rating: number;
  link?: string;
  finishedDate?: string;
}

export async function getBooks(): Promise<Book[]> {
  try {
    const bookPath = path.join(process.cwd(), '/content/books.json');
    
    try {
      const content = await fs.readFile(bookPath, 'utf-8');
      const books: Book[] = JSON.parse(content);
      return books;
    } catch {
      const defaultBooks: Book[] = [
        {
          id: '1',
          title: '示例书籍',
          author: '作者名',
          cover: '/assets/book-default.jpg',
          description: '这是一本很棒的书...',
          rating: 4.5,
          link: 'https://example.com',
          finishedDate: '2025-12',
        },
      ];
      await fs.writeFile(bookPath, JSON.stringify(defaultBooks, null, 2), 'utf-8');
      return defaultBooks;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}
