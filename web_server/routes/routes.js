// test 가능하게 해보기

const ipfs = require('../util/ipfs');
const sorting = require('../util/sorting');
const {web3, contractInstance} = require('../util/web3');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
// const Buffer = require('buffer/').Buffer;
/* Database에 저장되어야 하는 정보들
*  User의 정보
*  1) Wallet 주소
*  2) Name (ID) <<- 뺄 수도
*  3) 게시글 ID
*  4) 키
*  5) 몸무게
*  6) 나이
*  7) 성별  */
var event_epoch = 0;
const DEF_DELAY = 1000;


router.use((req, res, next) => {
    next();
});

/* GET users listing. */
router.get('/userlist', async (req, res) => {
    User.findall({})
        .then(data => {
            data = sorting(data);
            res.send(data);
        });
});

router.get('/test', async (req, res) => {
    let num = await web3.eth.getBlockNumber();
    console.log(num);
})
/* POST Data to DataBase */

/* ipfs_hash 는 block에서 읽어오기
   block에서 읽어온 데이터들을 db에 저장하기
   listener가 event listen 하고 ipfs_hash 값을 return 받음
   게시글작성 저장 부분
   사용자에 관한 정보를 ipfs에 같이 쓰는 것이 올바른 듯
 */
// post method
router.get('/create', async (req, res) => {
    let ipfsHash_get, wallet_address_get, post_num_get;
    let check = false;
    let flag;
    while (true) {
        await contractInstance.getPastEvents('ListingCreated', {
            fromBlock: 0,
            toBlock: 'latest'
        }, function (error, events) {
            for (let i = 0; i < events.length; i++) {
                var eventObj = events[i];
                console.log('ipfshash: ' + eventObj.returnValues.ipfsHash);
                console.log('wallet_address : ' + eventObj.returnValues.party);
                console.log('post_num : ' + eventObj.returnValues.listingID);
                if (i == event_epoch) {
                    event_epoch = event_epoch + 1;
                    ipfsHash_get = eventObj.returnValues.ipfsHash;
                    wallet_address_get = eventObj.returnValues.party;
                    post_num_get = eventObj.returnValues.listingID;
                    ipfs.get(ipfsHash_get, (err, files) => {
                        files.forEach(async (file) => {
                            var temp = JSON.parse(file.content);
                            console.log(temp);
                            let user = new User({
                                wallet_address: wallet_address_get,
                                nickname: temp.nickname,
                                height: temp.height,
                                weight: temp.weight,
                                age: temp.age,
                                sex: temp.sex,
                                post_nums: [post_num_get], // 게시글 번호
                            });
                            user.save((err, user) => {
                                if (err) {
                                    console.log(err);
                                    if (err.code === 11000) { // duplication check
                                        User.updatebyWallet(wallet_address_get, post_num_get);
                                        flag = "1"; // ok signal
                                        check = true;
                                    } else {
                                        flag = "-1"; // bad signal
                                        check = true;
                                    }
                                } else {
                                    flag = "1";// ok signal
                                    check = true;
                                }
                            });
                        })
                    });
                    break;
                }// ipfshash를 받음
            }
        });
        if (check == true) {
            break;
        }
        await sleep(1000);
    }
    res.send(flag);
});

/* GET Users data from db */
// 특정 유저에 대한 post_nums return // nickname
router.get('/userid/:userId', async (req, res) => {
    let name = req.body.userId;
    let data = User.findbyName(name);
    res.send(data);
});

// Search system // post
router.post('/search', (req, res) => {
    console.log(req.body);
    let content = req.body.content;
    let age = content.age;
    let sex = content.sex;
    let height_min = content.height_min;
    let height_max = content.height_max;
    let weight_min = content.weight_min;
    let weight_max = content.weight_max;

    // let age = 0;
    // let sex = 0;
    // let height_min = 0;
    // let height_max = 200;
    // let weight_min = 0;
    // let weight_max = 160;

    User.findbyCategory({
        age: age,
        sex: sex,
        height_min: height_min,
        height_max: height_max,
        weight_min: weight_min,
        weight_max: weight_max
    })
        .then((data) => {
            if(data){ data = sorting(data)};
            console.log(data);
            res.json(data);
        });
});


/* Browser check function ( chrome and Firefox ) */
function browser_check(req) {
    const reqHeaders = req.headers;
    let flag = false;
    if (reqHeaders['user-agent'].includes('Firefox')) {
        flag = true;
    } else if (reqHeaders['user-agent'].includes('Chrome')) {
        flag = true;
    }
    return flag;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

module.exports = router;
