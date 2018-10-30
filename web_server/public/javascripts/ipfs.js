const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: '13.209.8.64', port: 80, protocol: 'https' });

module.exports = ipfs;