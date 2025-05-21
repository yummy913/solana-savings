import React from 'react';
import { Link } from 'react-router';
import { blogPosts } from '~/data/blogPosts/index';
import '../home.css';
import '../../styles/blog.css';

// Helper to extract the first <p> from a React fragment or array
function getFirstParagraph(node: React.ReactNode): React.ReactElement | null {
  const children = React.Children.toArray(node);
  for (const child of children) {
    if (React.isValidElement(child) && child.type === 'p') {
      return child;
    }
    // If the child is a fragment, search recursively
    if (
      React.isValidElement(child) &&
      child.type === React.Fragment &&
      child.props &&
      typeof child.props === 'object' &&
      'children' in child.props
    ) {
      const para = getFirstParagraph(child.props.children as React.ReactNode);
      if (para) return para;
    }
  }
  return null;
}

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="Home-Nav">
        <a href="/" className="Home-Header-Name">solsavings</a>
        <a href="/blog" className="Home-Header-Blogs">blogs</a>
      </div>
      <div className="Home">
        <div className="Home-Content">
          <span className="Home-Content-Title">Blog Posts</span>
          <div className="blog-posts">
            {blogPosts.map(post => {
              const firstParagraph = getFirstParagraph(post.content);
              return (
                <a href={`/blog/${post.slug}`} key={post.id} className="blog-post-preview-link">
                  <article className="blog-post-preview">
                    <h2 className="blog-post-preview-title">
                      {post.title}
                    </h2>
                    <div className="blog-post-preview-date">{post.date}</div>
                    <div className="blog-post-preview-excerpt">
                      {firstParagraph}
                    </div>
                  </article>
                </a>
              );
            })}
          </div>
        </div>
        <div className="Home-Footer">
          <span className="Home-Footer-Text">Built by NAB Labs</span>
        </div>
      </div>
    </div>
  );
} 