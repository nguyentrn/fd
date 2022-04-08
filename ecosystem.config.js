module.exports = {
  apps: [
    {
      name: "foody-deli",
      script: "./now.js",
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
