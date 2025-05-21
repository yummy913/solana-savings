import { useParams } from 'react-router';
import { blogPosts } from '~/data/blogPosts/index';
import BlogPost from '~/components/BlogPost';
import '../home.css';
import '../../styles/blog.css';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="Home-Nav">
          <a href="/" className="Home-Header-Name" tabIndex={-1}>solsavings</a>
          <a href="/blog" className="Home-Header-Blogs" tabIndex={-1}>blogs</a>
        </div>
        <div className="Home">
          <div className="Home-Content">
            <h1>Post not found</h1>
            <p>The blog post you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="Home-Nav">
        <a href="/" className="Home-Header-Name" tabIndex={-1}>solsavings</a>
        <a href="/blog" className="Home-Header-Blogs" tabIndex={-1}>blogs</a>
      </div>
      <div className="Home">
        <div className="Home-Content">
          <BlogPost post={post} />
        </div>
        <div className="Home-Footer">
          <span className="Home-Footer-Text">Built by NAB Labs</span>
        </div>
      </div>
    </div>
  );
} 