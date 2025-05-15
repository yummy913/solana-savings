# Current Savings Calculations

This section contains the calculations related to the savings of compressed vs. uncompressed assets. Below is the code used to perform these calculations in the front-end.

## Constants

The following constants are used in the calculations:

- `COMPRESSED_SIZE_PER_ASSET` - Size of each compressed asset (in bytes).
- `UNCOMPRESSED_SIZE_PER_ASSET` - Size of each uncompressed asset (in bytes).

```javascript
const COMPRESSED_SIZE_PER_ASSET = 40; // Size of compressed asset (in bytes)
const UNCOMPRESSED_SIZE_PER_ASSET = 926; // Size of uncompressed asset (in bytes)

// Calculate the total number of bytes for compressed assets
const compressedBytes = numAssets * COMPRESSED_SIZE_PER_ASSET + (numAssets ? 128 : 0);

// Calculate the cost in lamports for compressed assets (assuming 3480 lamports per 40 bytes and multiplier of 2)
const compressedCostlamports = numAssets * COMPRESSED_SIZE_PER_ASSET * 3480 * 2;

// Calculate the total number of bytes for uncompressed assets (includes 128 bytes overhead)
const uncompressedBytes = numAssets * (UNCOMPRESSED_SIZE_PER_ASSET + 128);

// Calculate the cost in lamports for uncompressed assets (assuming 3480 lamports per 926 bytes and multiplier of 2)
const uncompressedCostlamports = numAssets * UNCOMPRESSED_SIZE_PER_ASSET * 3480 * 2;