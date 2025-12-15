import { getMutters } from '@/actions/mutter/action';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '碎碎念 - Blogs',
  description: '记录生活的点点滴滴',
};

export default async function MutterPage() {
  const mutters = await getMutters();
  
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-3xl font-bold'>碎碎念</h1>
        <p className='text-sm text-gray-500 mt-2'>记录生活的点点滴滴</p>
      </div>
      
      <div className='relative'>
        <div className='absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500' />
        
        <div className='space-y-8'>
          {mutters.map((mutter) => (
            <div key={mutter.id} className='relative pl-12'>
              <div className='absolute left-2.5 top-2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900 shadow-lg' />
              
              <div className='group'>
                <div className='bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all'>
                  <p className='text-base text-gray-800 dark:text-gray-200 leading-relaxed'>
                    {mutter.content}
                  </p>
                  <div className='flex items-center gap-2 mt-3 text-xs text-gray-500'>
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd' />
                    </svg>
                    <span>{mutter.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {mutters.length === 0 && (
          <div className='text-center py-12 text-gray-500'>
            <svg className='w-16 h-16 mx-auto mb-4 opacity-50' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
            </svg>
            <p>还没有碎碎念</p>
          </div>
        )}
      </div>
    </div>
  );
}
