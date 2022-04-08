module.exports = {
  apps: [
    {
      name: "foody-deli",
      script: "./src/now.js",
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
