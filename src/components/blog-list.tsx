import { getBlogList } from '@/actions/blog/action';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
export async function BlogList() {
  const blogList = await getBlogList();
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-xl tracking-tight'>
        博客
        <span className='text-xs text-gray-500 ml-2'>{blogList.length}篇</span>
      </h1>
      <div className='flex flex-col gap-2'>
        {blogList.map((blog, index) => {
          return (
            <div key={index} className='border-b-[1.75]'>
              <Link
                href={`/${blog.slug}`}
                className='block p-2 -mx-2 rounded-md transition hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm hover:scale-[1.01]'
              >
                <h2 className='text-base font-medium hover:underline'>
                  {blog.title}
                </h2>
                <div className='flex items-center gap-3 mt-1 flex-wrap'>
                  <p className='text-xs text-gray-500'>{blog.date}</p>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className='flex gap-2 flex-wrap'>
                      {blog.tags.map((tag, idx) => {
                        const isObject = typeof tag === 'object';
                        const tagName = isObject ? tag.name : tag;
                        const tagColor = isObject ? tag.color : 'blue';
                        
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
                          <span
                            key={idx}
                            className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md border ${colorStyles[tagColor] || colorStyles.blue}`}
                          >
                            <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                              <path fillRule='evenodd' d='M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z' clipRule='evenodd' />
                            </svg>
                            {tagName}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BlogListSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-xl tracking-tight'>博客</h1>
      <Skeleton className='w-full h-4' />
      <Skeleton className='w-full h-4' />
      <Skeleton className='w-full h-4' />
      <Skeleton className='w-full h-4' />
    </div>
  );
}
