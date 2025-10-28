/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure consistent port usage
  env: {
    PORT: '3000',
  },
  // Fix workspace root detection
  outputFileTracingRoot: __dirname,
  // Disable static export for now - use regular build
  // output: 'export',
  // trailingSlash: true,
  
  // Temporarily disable ESLint during build for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports for HR platform
    optimizePackageImports: [
      'lucide-react',           // Icons
      '@fullcalendar/react',    // Calendar components
      'framer-motion',         // Animations
      'react-hook-form',       // Forms
      'date-fns',              // Date utilities
      'axios',                 // HTTP client
      'zustand'                // State management
    ],
    // Optimize CSS for better performance
    optimizeCss: true,
    // Enable server components for better SEO
    // serverComponentsExternalPackages: ['@fullcalendar/core'], // Moved to serverExternalPackages
    // Optimize for HR platform specific needs
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Optimize for faster navigation
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable static optimization
  trailingSlash: false,
  
  // Server external packages for better performance
  serverExternalPackages: ['@fullcalendar/core', 'pdfmake'],
  // Optimize images for static export
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
  // Headers removed for static export compatibility
  // Optimize bundles for HR platform
  webpack: (config, { dev, isServer }) => {
    // Додаємо підтримку pdfmake
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          // HR-specific optimizations
          calendar: {
            test: /[\\/]node_modules[\\/]@fullcalendar[\\/]/,
            name: 'calendar',
            priority: 10,
            chunks: 'all',
          },
          forms: {
            test: /[\\/]node_modules[\\/](react-hook-form|@hookform)[\\/]/,
            name: 'forms',
            priority: 10,
            chunks: 'all',
          },
          ui: {
            test: /[\\/]node_modules[\\/](lucide-react|framer-motion)[\\/]/,
            name: 'ui',
            priority: 10,
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig
