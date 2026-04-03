/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/territory", destination: "/", permanent: false }];
  },
};

module.exports = nextConfig;
