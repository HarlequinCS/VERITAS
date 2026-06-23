/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Cloudflare Turnstile iframe to load
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
              "frame-src https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com",
              "img-src 'self' data:",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
