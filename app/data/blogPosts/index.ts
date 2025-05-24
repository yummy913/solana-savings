import type { BlogPost } from '../../types/blog';
import CompressedNFTsGuide from './compressed-nfts-guide';
import ZkCompressionGuide from './zk-compression-guide';


export type { BlogPost };

export const blogPosts: BlogPost[] = [
  CompressedNFTsGuide,
  ZkCompressionGuide
]; 