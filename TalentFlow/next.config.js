/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure consistent port usage
  env: {
    PORT: '3000',
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
