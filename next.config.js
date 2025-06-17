/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'ipfs.io',
      'gateway.pinata.cloud',
      'nft-cdn.alchemy.com',
      'res.cloudinary.com'
    ],
  },
  env: {
    NEXT_PUBLIC_COVALENT_API_KEY: process.env.NEXT_PUBLIC_COVALENT_API_KEY,
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  },
}

module.exports = nextConfig
