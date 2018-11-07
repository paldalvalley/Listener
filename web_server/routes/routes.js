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
*  7) 성별 (boolean) */


router.use((req, res, next) => {
    next();
})

/* GET users listing. */
router.get('/userlist', async (req, res) => {
    User.findall({})
        .then(data => {
            data = sorting(data);
            res.send(data);
        });
});

/* POST Data to DataBase */

/* ipfs_hash 는 block에서 읽어오기
   block에서 읽어온 데이터들을 db에 저장하기
   listener가 event listen 하고 ipfs_hash 값을 return 받음
   게시글작성 저장 부분
   사용자에 관한 정보를 ipfs에 같이 쓰는 것이 올바른 듯
 */
// post method
router.get('/create', (req, res) => {
    let ipfsHash_get = "QmR63mBkE9isWAAnvc5NmH4qfRmkYNZNgxHKHdpbCmnFiK";
    // contractInstance.events.DietData({}).then((err, event) => {
    //     event.returnValues.ipfsHash; //ipfshash
    // }).then((ipfsHash_get) => {
    ipfs.get(ipfsHash_get, (err, files) => {
        console.log(err);
        files.forEach(async (file) => {
            var temp = JSON.parse(file.content);
            console.log(temp);
            let user = new User({
                wallet_address: temp.wallet_address,
                name: temp.name,
                tall: temp.tall,
                weight: temp.weight,
                age: temp.age,
                gender: temp.gender,
                post_nums: [temp.post_nums], // 게시글 번호
            });
            user.save((err, user) => {
                if (err) {
                    if (err.code === 11000) { // duplication check
                        User.updatebyWallet(temp.wallet_address, temp.post_nums);
                        res.send("1"); // ok signal
                    } else {
                        res.send('-1'); // bad signal
                    }
                } else {
                    console.dir(user);
                    res.send('1');// ok signal
                }
            });
            // }
        });
    }); // ipfshash를 받음
    // });
});

/* GET Users data from db */
// 특정 유저에 대한 post_nums return
router.get('/userid/:userId', async (req, res) => {
    let name = req.body.userId;
    let data = User.findbyName(name);
    res.send(data);
});

// Search system
router.get('/search/:content', (req, res) => {
    // let content = req.body.content;
    /* let age = content.age;
    * let gender = content.gender;
    *  let tall_min = content.tall_min;
    *  let tall_max = content.tall_max;
    *  let weight_min = content.weight_min;
    *  let weight_max = content.weight_max;
     */
    let age = 20;
    let gender = -1;
    let tall_min = 0;
    let tall_max = 300;
    let weight_min = 0;
    let weight_max = 200;

    User.findbyCategory({age: age, gender: gender, tall_min: tall_min, tall_max: tall_max, weight_min: weight_min, weight_max: weight_max})
        .then((data) => {
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


module.exports = router;
