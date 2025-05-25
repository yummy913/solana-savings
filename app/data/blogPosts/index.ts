import type { BlogPost } from '../../types/blog';
import CompressedNFTsGuide from './compressed-nfts-guide';
import ZkCompressionGuide from './zk-compression-guide';
import zkCompressionvsTraditionalCompressionWhichisBetterforSolana from './zk-compression-vs-traditional-compression-which-is-better-for-solana';


export type { BlogPost };

export const blogPosts: BlogPost[] = [
  CompressedNFTsGuide,
  ZkCompressionGuide,
  zkCompressionvsTraditionalCompressionWhichisBetterforSolana
]; 
