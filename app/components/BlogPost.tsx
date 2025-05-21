import React from 'react';
import type { BlogPost } from '~/data/blogPosts';

interface BlogPostProps {
  post: BlogPost;
}

const defaultStyles = {
  titleSize: '2.5rem',
  paragraphSize: '1.1rem',
  headingSize: '1.8rem',
  maxWidth: '800px',
  backgroundColor: 'transparent',
  textColor: 'rgba(255, 255, 255, 0.9)'
} as const;

export default function BlogPost({ post }: BlogPostProps) {
  const {
    title,
    content,
    date,
    customStyles = defaultStyles
  } = post;

  return (
    <article 
      className="blog-post"
      style={{
        maxWidth: customStyles.maxWidth,
        backgroundColor: customStyles.backgroundColor,
        color: customStyles.textColor
      }}
    >
      <h1 
        className="blog-post-title"
        style={{ fontSize: customStyles.titleSize }}
      >
        {title}
      </h1>
      {date && <div className="blog-post-date">{date}</div>}
      <div 
        className="blog-post-content"
        style={{ fontSize: customStyles.paragraphSize }}
      >
        {content}
      </div>
    </article>
  );
} 