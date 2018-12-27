var express = require('express');
var router = express.Router();
const userlog = require('../models/userlog');
const {web3,contractInstance} = require('../util/web3');
const ipfs = require('../util/ipfs');
const sorting = require('../util/sorting');
const Tx = require('ethereumjs-tx');
const privateKey = Buffer.from('EE717D5A90D0EAE8123C6637BCB9EC35A48B170C5B5A387807B59B30E521A7EC', 'hex'); // owner
const contractAddress = '0x44cfc4550625d14f33e952b9f065046830c9e04e';

// const privateKey = Buffer.from('B5C15A349A999DF26DA105316FD59E97B9DEDB15C3503D1D1811B6AC1C007BD5', 'hex');
/* GET home page. */
router.use(function(req,res,next){
    next();
});

router.get('/', async (req, res, next) => {
    //  wallet address가 query문으로 작성되어 날아올 경우 아래 사용 (지갑주소를 알고있어야 데이터 등록시 코인 지급 가능)
    //    let{wallet_address, idx, masterkey, Type, LedMode, use_s_time, use_e_time, kind, crdate, DelYN, device_ver, device} = req.query;
    let{idx, masterkey, Type, LedMode, use_s_time, use_e_time, kind, crdate, DelYN, device_ver, device} = req.query;
    let wallet_address = "0xB603C9Ca252ce89901C151Aedf24a41B95E33409";
    use_s_time = new Date(1000*Number(use_s_time));
    use_e_time = new Date(1000*Number(use_e_time));
    crdate = new Date(1000*Number(crdate));
    device_ver = new Date(1000*Number(device_ver));
    let data = {
        index: idx,
        masterkey: masterkey,
        type: Type,
        ledMode: LedMode,
        use_s_time: use_s_time,
        use_e_time: use_e_time,
        kind: kind,
        crdate: crdate,
        delYN: DelYN,
        device_ver: device_ver,
        device: device
    };

    console.log(data);
    let bufferedString = makebuffer(data);
    console.log(bufferedString);
    await ipfs.add(bufferedString, async (err, ipfsHash) => {
        console.log(ipfsHash[0].hash);
        let nonce;
        await web3.eth.getTransactionCount('0x98FE5eaFd3D61af18fB2b2322b8346dF05057202').then(_nonce=>{
            nonce = _nonce.toString(16);
            console.log("nonce:" + nonce);
        });
        let data = contractInstance.methods.createListing(ipfsHash[0].hash,wallet_address).encodeABI();
        let rawTx = {
            nonce: '0x'+nonce,
            to:contractAddress,
            data: data,
            gasPrice: web3.utils.toHex(web3.utils.toWei('4', 'gwei')),
            gasLimit: web3.utils.toHex(3000000),
            chainId: 3
        };
        let tx = new Tx(rawTx);
        tx.sign(privateKey);
        let serializedTx = tx.serialize();
        console.log("위");
        await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
            if (!err){
                console.log(hash);
                console.log('안쪽');
            }
        });
        let pastEvents = await contractInstance.getPastEvents('ListingCreated',{
            fromBlock: 0,
            toBlock: 'latest'
        });
        let newEvent = pastEvents[pastEvents.length - 1];
        console.log('New Events: ' + newEvent);
        console.log('post_num : ' + newEvent.returnValues.listingID);
        let listing_id = newEvent.returnValues.listingID;
        let newUserlog = new userlog({
            index: idx,
            masterkey: masterkey,
            kind: kind, // 접속국가코드 KR: 한국 , SG: 싱가폴
            crdate: crdate, // 해당 자료가 등록된 시간
            wallet_address: wallet_address,
            listing_id: listing_id
        });
        newUserlog.save();
        res.status(200).send();
    });
});

router.get('/search',function (req,res,next) {
    let date_from = req.body.date_from;
    let date_to = req.body.date_to;
    userlog.find({crdate:{
            $gte: date_from,
            $lte: date_to
        }}).exec(
        function (err,logs) {
            console.log(logs);
            let data = sorting(logs);
            console.log(data);
            res.send(data);
        }
    )
});

function makebuffer(data){
    const buffer = ipfs.Buffer;
    let someObject = {data};
    let objectString = JSON.stringify(someObject);
    let bufferedString = buffer.from(objectString);
    return bufferedString
}

module.exports = router;
