const repoName = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/^\/|\/$/g, "")
const basePathConfig = repoName
  ? {
      basePath: `/${repoName}`,
      assetPrefix: `/${repoName}/`,
    }
  : {}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  output: "export",
  ...basePathConfig,
}

export default nextConfig
