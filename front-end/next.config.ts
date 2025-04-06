import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['*', 'localhost', 's.yimg.com', 'npr.brightspotcdn.com', 'media-cldnry.s-nbcnews.com', 'www.washingtonpost.com', 'a4.espncdn.com'
      , 'dims.apnews.com', 'www.ft.com', 'images.axios.com', 'www.cnbc.com', 'www.bbc.co.uk', 'www.theguardian.com', 'www.nytimes.com', 'www.reuters.com'
      , 'www.foxnews.com', 'www.wsj.com', 'www.bloomberg.com', 'www.politico.com', 'www.nbcnews.com', 'www.cnn.com', 'www.usatoday.com'
      , 'www.latimes.com', 'www.forbes.com', 'www.huffpost.com', 'www.vox.com', 'www.businessinsider.com', 'www.vice.com', 'www.salon.com'
      , 'www.washingtonexaminer.com', 'www.npr.org', 'www.pbs.org', 'www.c-span.org', 'www.c-span.org', 'www.c-span.org', 'www.c-span.org'
    ], 
  },
};

module.exports = nextConfig;