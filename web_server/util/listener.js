const ipfs = require('./ipfs');
const {web3, contractInstance} = require('./web3');
const User = require('../models/user');
const fs = require('fs');
const mongoose = require('mongoose');

async function liveTracking(config) {

    let start;
    const checkIntervalSeconds = 5;

    // CONNECT TO MONGODB SERVE
    mongoose.connect('mongodb://localhost:27017/Database', { })
        .then(()=> console.log('Successfully connected to mongodb'))
        .catch(e => console.error(e));


    const check = async () => {
        let lastLogEvents = getLastEvent(config);
        start = new Date();
        let pastEvents = await contractInstance.getPastEvents('ListingCreated',{
            fromBlock: 0,
            toBlock: 'latest'
        }).catch(err => {console.log(err);});
        if(pastEvents){
            if (pastEvents.length == lastLogEvents) {
                console.log('No new Events');
                return scheduleNextCheck()
            }
            let newEvent = pastEvents[pastEvents.length - 1];
            console.log('New Events: ' + newEvent);
            if(newEvent){
                await saveData(newEvent);
            }
            setLastEvent(config,pastEvents.length);
        }
        return scheduleNextCheck()
    }
    const scheduleNextCheck = async () => {
        const elapsed = new Date() - start
        const delay = Math.max(checkIntervalSeconds * 1000 - elapsed, 1)
        setTimeout(check, delay)
    }

    check();
}

function getLastEvent(config) {
    if (config.continueFile == undefined || !fs.existsSync(config.continueFile)) {
        return 0
    }
    const json = fs.readFileSync(config.continueFile, { encoding: 'utf8' });
    const data = JSON.parse(json);
    if (data.lastLogEvent) {
        return data.lastLogEvent
    }
    return 0
}

function setLastEvent(config, eventNumber) {
    if (config.continueFile == undefined) {
        return
    }
    const json = JSON.stringify({ lastLogEvent: eventNumber});
    fs.writeFileSync(config.continueFile, json, { encoding: 'utf8' })
}

async function saveData(event){
    console.log('ipfshash: ' + event.returnValues.ipfsHash);
    console.log('wallet_address : ' + event.returnValues.party);
    console.log('post_num : ' + event.returnValues.listingID);
    let ipfsHash_get = event.returnValues.ipfsHash;
    let wallet_address_get = event.returnValues.party;
    let post_num_get = event.returnValues.listingID;
    await ipfs.get(ipfsHash_get, (err, files) => {
        files.forEach(async (file) => {
            var temp = JSON.parse(file.content);
            let user = new User({
                wallet_address: wallet_address_get,
                nickname: temp.nickname,
                height: temp.height,
                weight: temp.weight,
                age: temp.age,
                sex: temp.sex,
                post_nums: [post_num_get], // 게시글 번호
            });
            user.save();
        })
    });
}

const args = {};
process.argv.forEach(arg => {
    const t = arg.split('=');
    const argVal = t.length > 1 ? t[1] : true
    args[t[0]] = argVal
});

const config = {
    continueFile: args['--continue-file'] || "./pastevent.txt"
};

// Start the listener running
liveTracking(config);
