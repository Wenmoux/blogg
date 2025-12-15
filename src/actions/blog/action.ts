'use server';

import { whiteList } from '@/app/white-list';
import fs from 'fs/promises';
import path from 'path';

export interface Blog {
  name: string;
  slug: string;
  title: string;
  date: string;
  content: string;
  description?: string;
  cover?: string;
  tags?: Array<string | { name: string; color: string }>;
  categories?: string[];
}

// 解析 frontmatter
function parseFrontmatter(content: string): Record<string, string | string[]> {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  if (!match) {
    return {};
  }
  
  const frontmatter: Record<string, string | string[]> = {};
  const lines = match[1].split('\n');
  let currentKey = '';
  const arrayKeys: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const colonIndex = line.indexOf(':');
    
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      
      if (value === '') {
        currentKey = key;
        arrayKeys.push(key);
        frontmatter[key] = [];
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // JSON 数组格式: tags: ["博客", "教程"]
        try {
          const parsed = JSON.parse(value);
          frontmatter[key] = Array.isArray(parsed) ? parsed : value.replace(/^['"]|['"]$/g, '');
        } catch {
          frontmatter[key] = value.replace(/^['"]|['"]$/g, '');
        }
        currentKey = '';
      } else {
        frontmatter[key] = value.replace(/^['"]|['"]$/g, '');
        currentKey = '';
      }
    } else if (line.trim().startsWith('-') && currentKey && arrayKeys.includes(currentKey)) {
      const item = line.trim().slice(1).trim();
      (frontmatter[currentKey] as string[]).push(item);
    }
  }
  
  return frontmatter;
}

export async function getBlogList(): Promise<Blog[]> {
  try {
    const mds = await fs.readdir(path.join(process.cwd(), '/content/mds'));
    const blogList = await Promise.all(
      mds.map(async (md: string) => {
        let name = '';
        let slug = '';
        let date = '';
        
        const oldFormatMatch = md.match(/\[(.*?)\]-\[(.*?)\]\.md$/);
        if (oldFormatMatch) {
          name = oldFormatMatch[1]!;
          date = oldFormatMatch[2]!;
          slug = name;
        } else if (md.endsWith('.md')) {
          slug = md.replace(/\.md$/, '');
          name = slug;
        } else {
          return null;
        }
        
        const content = await fs.readFile(
          path.join(process.cwd(), '/content/mds', md),
          'utf-8',
        );
        
        const frontmatter = parseFrontmatter(content);
        const title = (frontmatter.title as string) || name;
        const finalSlug = (frontmatter.slug as string) || slug;
        const finalDate = (frontmatter.date as string) || date;
        const dateTime = new Date(finalDate).toISOString().split('T')[0];
        
        let tags: Array<string | { name: string; color: string }> | undefined;
        if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
          tags = frontmatter.tags.map((tag: string) => {
            const colorMatch = tag.match(/^(.+?)\s*\((\w+)\)$/);
            if (colorMatch) {
              return { name: colorMatch[1]!.trim(), color: colorMatch[2]! };
            }
            return tag;
          });
        }
        
        return {
          name,
          slug: finalSlug,
          title,
          date: dateTime,
          content: '',
          description: frontmatter.description as string,
          cover: frontmatter.cover as string,
          tags,
          categories: frontmatter.categories as string[],
        };
      }),
    );
    
    const validBlogs = blogList.filter((blog): blog is NonNullable<typeof blog> => blog !== null);
    validBlogs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return validBlogs.filter(
      blog =>
        !whiteList.some(
          white => white.name != '' && blog.name.startsWith(white.name),
        ),
    );
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getBlog(slugOrName: string): Promise<Blog | null> {
  try {
    const mds = await fs.readdir(path.join(process.cwd(), '/content/mds'));
    
    const targetFile = mds.find((md: string) => {
      const oldMatch = md.match(/\[(.*?)\]-\[(.*?)\]\.md$/);
      if (oldMatch && oldMatch[1] === slugOrName) {
        return true;
      }
      if (md === `${slugOrName}.md`) {
        return true;
      }
      return false;
    });
    
    if (!targetFile) {
      return null;
    }
    
    const content = await fs.readFile(
      path.join(process.cwd(), '/content/mds', targetFile),
      'utf-8',
    );
    
    const frontmatter = parseFrontmatter(content);
    
    let name = '';
    let slug = '';
    let date = '';
    
    const oldFormatMatch = targetFile.match(/\[(.*?)\]-\[(.*?)\]\.md$/);
    if (oldFormatMatch) {
      name = oldFormatMatch[1]!;
      date = oldFormatMatch[2]!;
      slug = name;
    } else if (targetFile.endsWith('.md')) {
      slug = targetFile.replace(/\.md$/, '');
      name = slug;
    }
    
    const title = (frontmatter.title as string) || name;
    const finalSlug = (frontmatter.slug as string) || slug;
    const finalDate = (frontmatter.date as string) || date;
    const dateTime = new Date(finalDate).toISOString().split('T')[0];
    
    // 移除 frontmatter，只保留正文内容
    const contentWithoutFrontmatter = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
    
    let tags: Array<string | { name: string; color: string }> | undefined;
    if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
      tags = frontmatter.tags.map((tag: string) => {
        const colorMatch = tag.match(/^(.+?)\s*\((\w+)\)$/);
        if (colorMatch) {
          return { name: colorMatch[1]!.trim(), color: colorMatch[2]! };
        }
        return tag;
      });
    }
    
    return {
      name,
      slug: finalSlug,
      title,
      date: dateTime,
      content: contentWithoutFrontmatter,
      description: frontmatter.description as string,
      cover: frontmatter.cover as string,
      tags,
      categories: frontmatter.categories as string[],
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
