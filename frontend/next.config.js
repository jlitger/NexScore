/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'ddragon.leagueoflegends.com',
        port: '',
        pathname: '/cdn/13.14.1/img/profileicon/**',
      },
    ]
  }
}

module.exports = nextConfig
