import React from 'react';

export interface BlogPost {
  id: string;
  title: string;
  content: React.ReactNode;
  date: string;
  slug: string;
  customStyles?: {
    titleSize?: string;
    paragraphSize?: string;
    headingSize?: string;
    maxWidth?: string;
    backgroundColor?: string;
    textColor?: string;
  };
} 