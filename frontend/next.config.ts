/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (process.env.BACKEND_API_URL) {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.BACKEND_API_URL}/api/:path*`,
        },
      ]
    }
    return []
  },
}

module.exports = nextConfig
