const Web3 = require('web3');
// import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/ef6f0c88c7214044b408e87817b0f1ae')); // API KEY
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
const address = '0x1fe6f46db87d7e3c90eb260bdde503f3c76e7f81';
const abi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_ipfsHash",
                "type": "string"
            }
        ],
        "name": "createListing",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "totalListings",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
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
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "offers",
        "outputs": [
            {
                "name": "buyer",
                "type": "address"
            },
            {
                "name": "status",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "listingID",
                "type": "uint256"
            }
        ],
        "name": "totalOffers",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

var contractInstance = new web3.eth.Contract(abi,address);

module.exports =  {web3,contractInstance};

