import React from 'react';
import { Link } from 'react-router';
import { blogPosts } from '~/data/blogPosts';
import '../home.css';
import '~/styles/blog.css';

export default function Blog() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="Home-Nav">
        <a href="/" className="Home-Header-Name">solsavings</a>
        <a href="/blog" className="Home-Header-Blogs">blogs</a>
      </div>
      <div className="Home">
        <div className="Home-Content">
          <span className="Home-Content-Title">Blog Posts</span>
          <span className="Home-Content-Desc">Latest updates and insights about Solana Savings</span>
          <div className="blog-posts">
            {blogPosts.map((post) => (
              <article key={post.id} className="blog-post-preview">
                <Link to={`/blog/${post.slug}`} className="blog-post-link">
                  <h2 className="blog-post-preview-title">{post.title}</h2>
                  <div className="blog-post-preview-date">{new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</div>
                  <p className="blog-post-preview-excerpt">
                    {post.content.split('\n\n')[0].slice(0, 200)}...
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </div>
        <div className="Home-Footer">
          <span className="Home-Footer-Text">Built by NAB Labs</span>
        </div>
      </div>
    </div>
  );
} 