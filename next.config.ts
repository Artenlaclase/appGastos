import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    const { NormalModuleReplacementPlugin } = require("webpack");
    
    config.resolve = {
      ...config.resolve,
      fallback: {
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util"),
        crypto: require.resolve("crypto-browserify"),
        path: require.resolve("path-browserify"),
        fs: false,
        os: false
      },
      alias: {
        ...config.resolve?.alias,
        "node:process": isServer ? "process" : "process/browser",
        "node:stream": "stream-browserify"
      }
    };

    config.plugins.push(
      new NormalModuleReplacementPlugin(/^node:/, (resource: { request: string }) => {
        resource.request = resource.request.replace(/^node:/, "");
      })
    );

    return config;
  }
};

export default nextConfig;