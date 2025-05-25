import type { BlogPost } from '../../types/blog';
import ReducingGasFeesOnSolanaWithZkCompression from './reducing-gas-fees-on-solana-with-zk-compression';
import CompressedNFTsGuide from './compressed-nfts-guide';
import ZkCompressionGuide from './zk-compression-guide';


export type { BlogPost };

export const blogPosts: BlogPost[] = [
  CompressedNFTsGuide,
  ZkCompressionGuide,
  ReducingGasFeesOnSolanaWithZkCompression
]; 
