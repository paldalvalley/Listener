const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: '13.209.8.64', port: 80, protocol: 'http' }); // 병헌이형 AWS IPFS SERVER

/* Write 코드
const buffer = ipfs.Buffer;
let obj = {wallet_address:"44",
    name: "김치헌",
    tall: 180,
    weight: 70,
    age: 25,
    gender: 1,
    post_nums: 2, // 게시글 번호
};
let objectString = JSON.stringify(obj);
let bufferedString = buffer.from(objectString);
ipfs.add(bufferedString, (err,ipfshash)=>{
    console.log(err);
    console.log(ipfshash);
})*/

// const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
module.exports = ipfs;