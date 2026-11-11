/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true' || process.env.CI === 'true';

const nextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/proyeksi-nataru-modern" : "",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
