current savings calculations

COMPRESSED_SIZE_PER_ASSET = 40;
UNCOMPRESSED_SIZE_PER_ASSET = 926;
  
compressedBytes = numAssets * COMPRESSED_SIZE_PER_ASSET + (numAssets ? 128 : 0);
compressedCostlamports = numAssets * COMPRESSED_SIZE_PER_ASSET * 3480 * 2;
uncompressedBytes = numAssets * (UNCOMPRESSED_SIZE_PER_ASSET + 128);
uncompressedCostlamports = numAssets * UNCOMPRESSED_SIZE_PER_ASSET * 3480 * 2;
