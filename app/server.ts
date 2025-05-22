import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const app = express();

// Serve static files
app.use(express.static('public'));

// Special handler for sitemap.xml
app.get('/sitemap.xml', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/xml');
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  res.send(sitemapContent);
});

// Your other routes and middleware here...

export default app; 