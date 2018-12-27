var express = require('express');
var router = express.Router();
const userlog = require('../models/userlog');
const {contractInstance} = require('../util/web3');
const ipfs = require('../util/ipfs');
const sorting = require('../util/sorting');

/* GET home page. */
router.use(function(req,res,next){
    next();
});

router.get('/', async (req, res, next) => {
    //  wallet address가 query문으로 작성되어 날아올 경우 아래 사용 (지갑주소를 알고있어야 데이터 등록시 코인 지급 가능)
    //    let{wallet_address, idx, masterkey, Type, LedMode, use_s_time, use_e_time, kind, crdate, DelYN, device_ver, device} = req.query;
    let{idx, masterkey, Type, LedMode, use_s_time, use_e_time, kind, crdate, DelYN, device_ver, device} = req.query;
    let wallet_address = "0xB603C9Ca252ce89901C151Aedf24a41B95E33409"; // 임의로 부여
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
    // 돈주는 부분 코드 contract보고 참고 (병헌이형 contract참조)
    // contractInstance.methods.buyListing()
    console.log(data);
    let bufferedString = makebuffer(data);
    console.log(bufferedString);
    await ipfs.add(bufferedString, (err, ipfsHash) => {
        console.log(ipfsHash[0].hash);
        contractInstance.methods.createListing(ipfsHash[0].hash).send({
            gas: 3000000,
            value: 0,
            from: wallet_address
        }).then(() => {
            res.status(200).send();
        });
        let listing_id;
        contractInstance.methods.totalListings().call({
        })
            .then(listing_Id=>{
                listing_id = listing_Id - 1;
                let newUserlog = new userlog({
                    index: idx,
                    masterkey: masterkey,
                    kind: kind, // 접속국가코드 KR: 한국 , SG: 싱가폴
                    crdate: crdate, // 해당 자료가 등록된 시간
                    wallet_address: wallet_address,
                    listing_id: listing_id
                });
                console.log(listing_id);
                newUserlog.save();
                res.status(200).send();
            });
    });
});

router.get('/search',function (req,res,next) {
    let dd = new Date("2018-12-02");
    userlog.find({crdate:{
            $gte: dd
        }}).exec(
        function (err,logs) {
            let data = sorting(logs);
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
