const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('13.209.8.64', '80', {protocol: 'https'});
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.etherscan.io/ef6f0c88c7214044b408e87817b0f1ae')); // API KEY
//const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const listen = require('/public/javascripts/listener');

MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser:true},
    (err, client) => {
        var db = client.db('Database');
        var collection = db.collection('User_info');
        var wallet_address;
        var name = req.body.name;
        var contact_num = req.body.contact;
        collection.insertOne({name:name, contact:contact_num},(err, result) => {
            console.log("inserted one document");
            client.close();
            res.redirect('/');
        })
    });

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
/* ipfs_hash 는 block에서 읽어오기
   block에서 읽어온 데이터들을 db에 저장하기
   listener가 event listen 하고 ipfs_hash 값을 return 받음
 */
router.post('/create',async (req,res)=>{
    let flag = browser_check(req);
    if(flag) {
        let ipfsHash_get = listen; // ipfshash를 받음
        let name, age, tall, weight, wallet_address;
        await ipfs.get(ipfsHash_get, (err, files) => {
            files.forEach((file) => {
                var temp = JSON.parse(file.content);
                name = temp.data.name;
                age = temp.data.age;
                tall = temp.data.tall;
                weight = temp.data.weight;
                wallet_address = temp.data.wallet_address;
            })
        })
        MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true},
            (err, client) => {
                var db = client.db('Database');
                var collection = db.collection('User_info');
                collection.insertOne({
                    name: name,
                    age: age,
                    tall: tall,
                    weight: weight,
                    wallet_address: wallet_address
                }, (err, result) => {
                    console.log("inserted one document");
                    client.close();
                    res.redirect('/');
                })
            })
    }else{
        res.send('<h1>plz connect with Chrome/Firefox</h1>');
    }
});

/* GET Users data from db */
router.get('/:userId',(req,res) => {
    let flag = browser_check(req);
    if(flag){
        ipfs.files.get(ipfs_hash, (err, files)=>{
            let body = files;
            res.header('Access-Control-Allow-Origin', "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
            res.send(body)
        });
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
