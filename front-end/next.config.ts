import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows all domains
      },
      {
        protocol: 'http',
        hostname: 'localhost', // Explicitly allow localhost
      },
    ],
  },
};

module.exports = nextConfig;