const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('13.209.8.64', '80', {protocol: 'https'});
var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');

/* Database에 저장되어야 하는 정보들
*  User의 정보
*  1) Wallet 주소
*  2) Ether 주소
*  3) Name (ID)
*  4) 키
*  5) 몸무게
*  6) 나이
*  7) 성별 (boolean) */

router.use((req,res,next) => {
  next();
})

/* GET users listing. */
router.get('/', (req, res)=> {
    res.send('respond with a resource');
});

/* POST Data to DataBase */
router.post('/create',(req,res)=>{
  res.redirect('/');
});

/* GET Users data from ipfs */
router.get('/:userId',(req,res) => {
    let flag = browser_check(req);
    if(flag){
        ipfs.files.get(ipfs_hash, (err, files)=>{
            let body = files;
            res.header('Access-Control-Allow-Origin', "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
            res.send(body)
        })
    }else{
        res.send('<h1>plz connect with Chrome/Firefox</h1>');
    }
    res.send('respond with a resource');
});

/* Browser check function ( chrome and Firefox ) */
function browser_check(req){
    const reqHeaders = req.headers;
    let flag = false
    if(!reqHeaders['accept'].includes('text')) {
        if (reqHeaders['user-agent'].includes('Firefox')) {
            if (reqHeaders['accept'].includes('audio')) {
                flag = true
            }
        } else if (reqHeaders['user-agent'].includes('Chrome')) {
            if (reqHeaders['accept'] === '*/*') {
                flag = true
            }
        }
    }
    return flag;
}


module.exports = router;
