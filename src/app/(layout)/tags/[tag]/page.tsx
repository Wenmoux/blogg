import { getBlogList } from '@/actions/blog/action';
import { Metadata } from 'next';
import Link from 'next/link';

type Params = Promise<{ tag: string }>;

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `${decodedTag} - 标签`,
    description: `包含 ${decodedTag} 标签的文章`,
  };
}

export async function generateStaticParams() {
  const blogList = await getBlogList();
  const tagSet = new Set<string>();
  
  blogList.forEach(blog => {
    if (blog.tags) {
      blog.tags.forEach(tag => {
        const tagName = typeof tag === 'object' ? tag.name : tag;
        tagSet.add(tagName);
      });
    }
  });
  
  return Array.from(tagSet).map(tag => ({
    tag: tag,
  }));
}

export default async function TagPage({ params }: { params: Params }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  const blogList = await getBlogList();
  
  const filteredBlogs = blogList.filter(blog => {
    if (!blog.tags) {
      return false;
    }
    return blog.tags.some(t => {
      const tagName = typeof t === 'object' ? t.name : t;
      return tagName === decodedTag;
    });
  });
  
  let tagColor = 'blue';
  for (const blog of blogList) {
    if (blog.tags) {
      const matchTag = blog.tags.find(t => {
        const tagName = typeof t === 'object' ? t.name : t;
        return tagName === decodedTag;
      });
      if (matchTag && typeof matchTag === 'object') {
        tagColor = matchTag.color;
        break;
      }
    }
  }
  
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
      <div className='flex items-center gap-3'>
        <Link href='/tags' className='text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400'>
          ← 返回标签云
        </Link>
      </div>
      
      <div className='flex items-center gap-4'>
        <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${colorStyles[tagColor] || colorStyles.blue}`}>
          <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z' clipRule='evenodd' />
          </svg>
          <span className='text-xl font-bold'>{decodedTag}</span>
        </div>
        <span className='text-sm text-gray-500'>{filteredBlogs.length} 篇文章</span>
      </div>
      
      <div className='flex flex-col gap-2'>
        {filteredBlogs.map((blog, index) => (
          <div key={index} className='border-b-[1.75]'>
            <Link
              href={`/${blog.slug}`}
              className='block p-2 -mx-2 rounded-md transition hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm hover:scale-[1.01]'
            >
              <h2 className='text-base font-medium hover:underline'>{blog.title}</h2>
              <p className='text-xs text-gray-500 mt-1'>{blog.date}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
