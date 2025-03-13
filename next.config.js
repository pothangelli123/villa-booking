/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['dummyimage.com'], // Allow images from dummyimage.com for our placeholders
  },
  env: {
    // Public environment variables can be used in the client-side code
    NEXT_PUBLIC_SITE_NAME: 'Luxury Beach Villa Booking',
    NEXT_PUBLIC_SITE_DESCRIPTION: 'Book your dream luxury beach villa directly with us.',
  },
};

module.exports = nextConfig; 