const mongoose = require('mongoose');

/* Database에 저장되어야 하는 정보들
*  User의 정보
*  1) Wallet 주소
*  2) Name (ID)
*  4) 게시글 ID
*  5) 키
*  6) 몸무게
*  7) 나이
*  8) 성별 (boolean) */

// Define Schemes
const userSchema = new mongoose.Schema({
    wallet_address: {type: String, required: true, unique: true},
    nickname: {type: String, required: true},
    post_nums: {type: [Number]}, // 게시글 번호
    height: {type: Number, required: true}, // 단위 cm // str
    weight: {type: Number, required: true}, // 단위 kg //str
    age: {type: Number, required: true}, // str
    sex: {type: Number, required: true} // 0 여성 , 1 남성
}, {
    versionKey: false
});

// wallet_address에 해당하는 정보 return

userSchema.statics.findall = function () {
    return this.find({}, {'_id': 0, 'post_nums': 1}).select('post_nums');
};


userSchema.statics.findbyWallet_address = function (wallet_address) {
    return this.findOne({"wallet_address": wallet_address});
};

userSchema.statics.findbyName = function (name) {
    return this.findOne({"nickname": name});
};

userSchema.statics.findbyPost_num = function (post_num) {
    return this.findOne({"post_nums": post_num});
};

/* category search */ // i.e) context = ({ height:180, age: 23, ....})
// 해당 context에 들어있지 않는 정보의 경우 default 값으로 모든 데이터 선택이 들어가 있어야함 << 해결점
// 범위로 찾는 것 i.e) 20대, 30대 .... // front에서 선택 x시 전체를 부르는 쿼리를 요청
userSchema.statics.findbyCategory = function (context) {
    console.log(context);
    let data = this.find({},{'_id': 0});
    if (context.age > 0) {
        data = data.find().gte("age", context.age).lte("age", context.age + 9); // 20대 검색시 20 ~ 29살 까지 출력
    }
    if (context.sex > -1) {
        data = data.find({"sex": context.sex});
    }
    data = data.find().gte("height", context.height_min).lte("height", context.height_max);
    data = data.find({}).gte("weight", context.weight_min).lte("weight", context.weight_max);
    data = data.find().select('post_nums');

    return data
};

// Update by wallet_addreses //, post_num, ipfs_hash
userSchema.statics.updatebyWallet = function (wallet_address, post_num) {
    return this.findOneAndUpdate(
        {"wallet_address": wallet_address},
        {$addToSet: {"post_nums": post_num}}, //addToSet : 중복되지 않는 post_num 만 추가
        function (err, success) {
            if (err) {
                console.log(err);
            } else {
                console.log(success);
            }
        });
};

// Create Model & Export
module.exports = mongoose.model('User', userSchema, 'User_info');