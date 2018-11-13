const Web3 = require('web3');
// import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/ef6f0c88c7214044b408e87817b0f1ae')); // API KEY
// const web3 = new Web3(new Web3.providers.WebsocketProvider('https://ropsten.etherscan.io/ef6f0c88c7214044b408e87817b0f1ae')); // API KEY
// const web3 = new Web3(window.web3.currentProvider); // metamask
/* Event listener
*   event DietData(address indexed party, bytes32 ipfsHash); //party ---> msg.sender라고 생각하면 될 듯
*   event OfferCreated (address indexed party, uint indexed offerID, string ipfsHash);
*   event OfferAccepted (address indexed party, uint indexed offerID, string ipfsHash);
*   event OfferFinalized (address indexed party, uint indexed offerID, string ipfsHash);
*   event OfferData (address indexed party, uint indexed offerID, string ipfsHash);
* */

// insert contract data
const address = '0x723b17a897c770a69f67b256275424530639d3e6';
const abi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "addData1",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "listingID",
                "type": "uint256"
            },
            {
                "name": "offerID",
                "type": "uint256"
            },
            {
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "addData2",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "listingID",
                "type": "uint256"
            },
            {
                "name": "offerID",
                "type": "uint256"
            },
            {
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "addData3",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
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
        "inputs": [
            {
                "name": "listingID",
                "type": "uint256"
            },
            {
                "name": "offerID",
                "type": "uint256"
            },
            {
                "name": "_ipfsHash",
                "type": "string"
            }
        ],
        "name": "finalize",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "listingID",
                "type": "uint256"
            },
            {
                "name": "_ipfsHash",
                "type": "string"
            }
        ],
        "name": "makeOffer",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
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
// const contractInstance = contracts.at(address);
//
// contractInstance.events.DietData({}, (err,event)=>{
//     console.log(event);
//     event.returnValues.ipfsHash; //ipfshash
// }); // seller 가 data를 등록
//
// contractInstance.events.OfferCreated({}, (err,event)=>{
//     console.log(event); //
// }); // buyer 가 구매하고해서 구매신청
//
// contractInstance.events.OfferAccepted({}, (err,event)=>{
//     console.log(event);
// }); // buyer가 seller에게 구매의사를 표해서 성사됨
//
// contractInstance.events.OfferFinalized({}, (err,event)=>{
//     console.log(event);
// }); // 거래완료 ( 실제 돈이 감 )
//
// contractInstance.events.OfferData({}, (err,event)=>{
//     console.log(event);
// }); // msg.sender 가 offer data return

module.exports =  {web3,contractInstance};

