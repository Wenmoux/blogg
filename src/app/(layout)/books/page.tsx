import { getBooks } from '@/actions/book/action';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '书架 - Blogs',
  description: '记录阅读过的书籍',
};

export default async function BooksPage() {
  const books = await getBooks();
  
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-3xl font-bold'>书架</h1>
        <p className='text-sm text-gray-500 mt-2'>共阅读 {books.length} 本书</p>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {books.map((book) => {
          const cardContent = (
            <>
              <div className='relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 overflow-hidden'>
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center'>
                    <svg className='w-20 h-20 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z' />
                    </svg>
                  </div>
                )}
                
                <div className='absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-bold text-sm shadow-lg flex items-center gap-1'>
                  <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                  {book.rating}
                </div>
              </div>
              
              <div className='p-5 space-y-3'>
                <div>
                  <h3 className='text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                    {book.title}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                    {book.author}
                  </p>
                </div>
                
                <p className='text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed'>
                  {book.description}
                </p>
                
                {book.finishedDate && (
                  <div className='flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700'>
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd' />
                    </svg>
                    <span>读完于 {book.finishedDate}</span>
                  </div>
                )}
              </div>
              
              {book.link && (
                <div className='absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none' />
              )}
            </>
          );
          
          return book.link ? (
            <Link
              key={book.id}
              href={book.link}
              target='_blank'
              rel='noopener noreferrer'
              className='group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'
            >
              {cardContent}
            </Link>
          ) : (
            <div
              key={book.id}
              className='group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'
            >
              {cardContent}
            </div>
          );
        })}
      </div>
      
      {books.length === 0 && (
        <div className='text-center py-12 text-gray-500'>
          <svg className='w-16 h-16 mx-auto mb-4 opacity-50' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z' />
          </svg>
          <p>还没有记录书籍</p>
        </div>
      )}
    </div>
  );
}
