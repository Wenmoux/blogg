import { getBlog, getBlogList } from '@/actions/blog/action';
import { notFound } from 'next/navigation';
import { whiteList } from '@/app/white-list';
import { Metadata } from 'next';
import MDComponents from '@/components/md-components';

type Params = Promise<{
  slug: string;
}>;

// meta
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const blog = await getBlog(decodedSlug);
  if (!blog) {
    throw notFound();
  }
  return {
    title: `Blogs-${blog.title}`,
    description: blog.description || `${blog.title} ${blog.content.substring(0, 100)}`,
    keywords: blog.tags ? blog.tags.map(t => typeof t === 'object' ? t.name : t) : [blog.title],
    authors: [
      { name: 'Zwanan', url: 'https://blog.zwanan.top/about' },
      { name: 'Zwanan-github', url: 'https://github.com/zwanan-github' },
    ],
    openGraph: {
      title: `Blogs-${blog.title}`,
      description: blog.description || `${blog.title} ${blog.content.substring(0, 100)}`,
      images: [blog.cover || 'https://blog.zwanan.top/favicon.ico'],
    },
  };
}

// isr
export const dynamicParams = true;

// revalidate
export const revalidate = 60;

// ssg
export async function generateStaticParams() {
  return (await getBlogList()).map(blog => ({
    slug: blog.slug,
  }));
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const blog = await getBlog(decodedSlug);

  if (!blog) {
    throw notFound();
  }

  const matchingWhiteListItem = whiteList.find(item => item.name === blog.name);

  const displayTitle = matchingWhiteListItem
    ? matchingWhiteListItem.title
    : blog.title;

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-3xl font-bold'>{displayTitle}</h1>
      <p className='text-sm text-gray-500'>{`更新时间：${blog.date}`}</p>
      <MDComponents transparent={true} content={blog.content} />
    </div>
  );
}
