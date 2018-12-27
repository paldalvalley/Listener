const Web3 = require('web3');
// import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/ef6f0c88c7214044b408e87817b0f1ae')); // API KEY
// const web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.43.50:8545')); // API KEY
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); // geth 주소

/* Event listener
*   event DietData(address indexed party, bytes32 ipfsHash); //party ---> msg.sender라고 생각하면 될 듯
*   event OfferCreated (address indexed party, uint indexed offerID, string ipfsHash);
*   event OfferAccepted (address indexed party, uint indexed offerID, string ipfsHash);
*   event OfferFinalized (address indexed party, uint indexed offerID, string ipfsHash);
*   event OfferData (address indexed party, uint indexed offerID, string ipfsHash);
* */

// insert contract data
const address = '0x44cfc4550625d14f33e952b9f065046830c9e04e';
const abi = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "_listingID",
                "type": "uint256"
            }
        ],
        "name": "checkBuyerOwnership",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_listingID",
                "type": "uint256"
            },
            {
                "name": "seller",
                "type": "address"
            }
        ],
        "name": "buyListing",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_tokenAddr",
                "type": "address"
            }
        ],
        "name": "setTokenAddr",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_ipfsHash",
                "type": "string"
            },
            {
                "name": "_useraddress",
                "type": "address"
            }
        ],
        "name": "createListing",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "listings",
        "outputs": [
            {
                "name": "seller",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "token",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_tokenAddr",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "party",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "DietData",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "party",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "listingID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "ListingCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "party",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "listingID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "ListingUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "party",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "listingID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "ListingData",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "party",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "listingID",
                "type": "uint256"
            },
            {
                "indexed": true,
                "name": "offerID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "OfferCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "party",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "listingID",
                "type": "uint256"
            },
            {
                "indexed": true,
                "name": "offerID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "OfferAccepted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "party",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "listingID",
                "type": "uint256"
            },
            {
                "indexed": true,
                "name": "offerID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "OfferFinalized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "party",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "listingID",
                "type": "uint256"
            },
            {
                "indexed": true,
                "name": "offerID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "OfferData",
        "type": "event"
    }
];

var contractInstance = new web3.eth.Contract(abi,address);

module.exports =  {web3,contractInstance};

