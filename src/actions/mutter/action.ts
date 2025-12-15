'use server';

import fs from 'fs/promises';
import path from 'path';

export interface Mutter {
  id: string;
  content: string;
  date: string;
}

export async function getMutters(): Promise<Mutter[]> {
  try {
    const mutterPath = path.join(process.cwd(), '/content/mutters.json');
    
    try {
      const content = await fs.readFile(mutterPath, 'utf-8');
      const mutters: Mutter[] = JSON.parse(content);
      return mutters.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch {
      const defaultMutters: Mutter[] = [
        {
          id: '1',
          content: '今天天气不错，心情也很好 ☀️',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      ];
      await fs.writeFile(mutterPath, JSON.stringify(defaultMutters, null, 2), 'utf-8');
      return defaultMutters;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}
