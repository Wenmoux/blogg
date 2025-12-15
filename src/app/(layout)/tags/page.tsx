import { getBlogList } from '@/actions/blog/action';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '标签云 - Blogs',
  description: '所有文章标签',
};

export default async function TagsPage() {
  const blogList = await getBlogList();
  
  const tagMap = new Map<string, { count: number; color: string }>();
  
  blogList.forEach(blog => {
    if (blog.tags) {
      blog.tags.forEach(tag => {
        const isObject = typeof tag === 'object';
        const tagName = isObject ? tag.name : tag;
        const tagColor = isObject ? tag.color : 'blue';
        
        if (tagMap.has(tagName)) {
          tagMap.get(tagName)!.count += 1;
        } else {
          tagMap.set(tagName, { count: 1, color: tagColor });
        }
      });
    }
  });
  
  const sortedTags = Array.from(tagMap.entries()).sort((a, b) => b[1].count - a[1].count);
  
  const colorStyles: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800',
    gray: 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  };
  
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-3xl font-bold'>标签云</h1>
        <p className='text-sm text-gray-500 mt-2'>共 {sortedTags.length} 个标签</p>
      </div>
      
      <div className='flex gap-3 flex-wrap'>
        {sortedTags.map(([tagName, { count, color }]) => (
          <Link
            key={tagName}
            href={`/tags/${encodeURIComponent(tagName)}`}
            className={`inline-flex items-center px-4 py-2 rounded-lg border transition-all hover:shadow-md hover:scale-105 ${colorStyles[color] || colorStyles.blue}`}
          >
            <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z' clipRule='evenodd' />
            </svg>
            <span className='font-medium'>{tagName}</span>
            <span className='ml-2 text-xs opacity-70'>({count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
