const ImageKit = require("imagekit");

const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;

if (!PRIVATE_KEY || !PUBLIC_KEY || !URL_ENDPOINT) {
  console.error(
    "Missing ImageKit env keys. Please set IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY and IMAGEKIT_URL_ENDPOINT",
  );
  throw new Error(
    "Missing ImageKit configuration. Check environment variables",
  );
}

const client = new ImageKit({
  privateKey: PRIVATE_KEY,
  publicKey: PUBLIC_KEY,
  urlEndpoint: URL_ENDPOINT,
});

async function uploadFile(file, fileName) {
  const result = await client.upload({
    file: file,
    fileName: fileName,
  });

  return result;
}

module.exports = {
  uploadFile,
};
