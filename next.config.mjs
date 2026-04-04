/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '**',
            },
        ],
    },
    // This code for vercel deployment 
    eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
  config.ignoreWarnings = [
    { module: /node_modules\/next/ },
  ];
  return config;
},
};


export default nextConfig;


