import type { BlogPost } from '../../types/blog';
import CompressedNFTsGuide from './compressed-nfts-guide';
import ZkCompressionGuide from './zk-compression-guide';
import ReducingGasFeesonSolanawithzkCompression from './reducing-gas-fees-on-solana-with-zk-compression';


export type { BlogPost };

export const blogPosts: BlogPost[] = [
  CompressedNFTsGuide,
  ZkCompressionGuide,
  ReducingGasFeesonSolanawithzkCompression
]; 
