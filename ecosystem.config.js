module.exports = {
  apps: [
    {
      name: "foody-deli",
      script: "./src/index.js",
      interpreter: "babel-node",
      env: {
        // NETWORK: 'testnet',
      },
      env_mainnet: {
        // NETWORK: 'mainnet',
      },
    },
  ],
};
