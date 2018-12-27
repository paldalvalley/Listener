var mongoose = require("mongoose");

var userLogSchema = mongoose.Schema({
    index: {type: Number},
    masterkey: {type: Number},
    kind: {type: String}, // 접속국가코드 KR: 한국 , SG: 싱가폴
    crdate: {type: Date}, // 해당 자료가 등록된 시간
    wallet_address: {type: String},
    listing_id: {type: Number} // 데이터 번호
}, {
    versionKey: false
});



var UserLog = mongoose.model("UserLog", userLogSchema, "userloglist");
module.exports = UserLog;
