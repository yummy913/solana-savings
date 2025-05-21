import React from 'react';

interface BlogPostProps {
  title: string;
  content: string;
  date?: string;
}

export default function BlogPost({ title, content, date }: BlogPostProps) {
  return (
    <article className="blog-post">
      <h1 className="blog-post-title">{title}</h1>
      {date && <div className="blog-post-date">{date}</div>}
      <div className="blog-post-content">
        {content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
} 