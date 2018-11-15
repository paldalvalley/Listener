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
/* Event listener
*   event DietData(address indexed party, bytes32 ipfsHash); //party ---> msg.sender라고 생각하면 될 듯
*   event OfferCreated (address indexed party, uint indexed offerID, string ipfsHash);
*   event OfferAccepted (address indexed party, uint indexed offerID, string ipfsHash);
*   event OfferFinalized (address indexed party, uint indexed offerID, string ipfsHash);
*   event OfferData (address indexed party, uint indexed offerID, string ipfsHash);
* */
