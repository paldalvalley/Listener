pragma solidity ^0.4.24;

//import "../../../../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract DietManager {

    event DietData(address indexed party, string ipfsHash); //party ---> msg.sender라고 생각하면 될 듯
    event ListingCreated(address indexed party, uint indexed listingID, string ipfsHash);
    event ListingUpdated(address indexed party, uint indexed listingID, string ipfsHash);
    event ListingData(address indexed party, uint indexed listingID, string ipfsHash);    
    event OfferCreated (address indexed party, uint indexed listingID, uint indexed offerID, string ipfsHash);
    event OfferAccepted (address indexed party, uint indexed listingID, uint indexed offerID, string ipfsHash);
    event OfferFinalized (address indexed party, uint indexed listingID, uint indexed offerID, string ipfsHash);
    event OfferData(address indexed party,uint indexed listingID, uint indexed offerID, string ipfsHash);


   // uint256 value = 1;
    
    struct Listing {
        address seller;
    }

    struct Offer{
        //uint value;
        address buyer;
        //uint finalizes; //Timestamp offer finalizes
        uint8 status; // 0: Undefined, 1: Created, 2:Completed
    }
    
    Listing[] public listings;
    mapping(uint => Offer[]) public offers; //listingID => Offers
    //Offer[] public offers;

    
    function totalOffers(uint listingID) public view returns (uint) {
        return offers[listingID].length;
    }

    function totalListings() returns(uint) {
        return listings.length;
    }
    
    function createListing (string _ipfsHash) public {
        _createListing(msg.sender, _ipfsHash);
    }

    function _createListing (address _seller, string _ipfsHash) internal {
        listings.push(Listing({
            seller : _seller
            }));

        emit ListingCreated(_seller, listings.length-1, _ipfsHash);
    }
    
    /*function updateListing(
        uint listingID,
        string _ipfsHash) public {    
        _updateListing(msg.sender, listingID, _ipfsHash);
    }


    function _updateListing(
        address _seller,
        uint listingID,
        string _ipfsHash) private {
        
        Listing storage listing = listings[listingID];

        require (listing.seller == _seller, "Seller must call");

        emit ListingUpdated(listing.seller, listingID, _ipfsHash);             
    }
    
    */
    function makeOffer(
        uint listingID,
        string _ipfsHash  // IPFS hash containing offer data
        //uint _finalizes,
        /*uint _value*/) public payable {
        
        offers[listingID].push(Offer({
            status: 1,
            buyer: msg.sender
          //  finalizes: _finalizes,
            /*value: _value*/
        }));
        
        emit OfferCreated(msg.sender, listingID, offers[listingID].length-1, _ipfsHash);        
   
    }
    
/*     function acceptOffer(uint listingID, uint offerID, string _ipfsHash) public {
        Listing storage listing = listings[listingID];
        Offer storage offer = offers[listingID][offerID];
        require(msg.sender == listing.seller, "Seller must accept"); 
        // if(offer.finalizes <1000000000 ){
        //     offer.finalizes= now+offer.finalizes;
        // }
        offer.status = 2;
        
        emit OfferAccepted(msg.sender, listingID, offerID, _ipfsHash);
    } */
    
    function finalize(uint listingID, uint offerID, string _ipfsHash) public payable {
        Listing storage listing = listings[listingID];
        Offer storage offer = offers[listingID][offerID];
        // if(now <= offer.finalizes){
        //     require(msg.sender == offer.buyer,"Only buyer can finalize");
        // }

        require(msg.sender == offer.buyer, "Only buyer can finalize");
        //offer.status = 2;
        require(offer.status == 1, "status != created");
        //paySeller
        //offer.seller.transfer(offer.value);
        listing.seller.transfer(msg.value);
        offer.status = 2;
        //listing.seller.transfer(value);
        emit OfferFinalized(msg.sender, listingID, offerID, _ipfsHash);
        //delete offers[listingID][offerID];
    }
    
    function addData1(string ipfsHash) public {
        emit DietData(msg.sender, ipfsHash);
    }
    
    function addData2(uint listingID, uint offerID, string ipfsHash) public {
        emit ListingData(msg.sender, listingID, ipfsHash);
    }
    
    function addData3(uint listingID, uint offerID, string ipfsHash) public {
        emit OfferData(msg.sender, listingID, offerID, ipfsHash);
    }
    
}