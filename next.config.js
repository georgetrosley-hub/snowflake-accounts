/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/territory", destination: "/", permanent: false },
      { source: "/gtm", destination: "/operating-system", permanent: false },
    ];
  },
};

module.exports = nextConfig;
