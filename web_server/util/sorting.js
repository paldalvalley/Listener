/* 숫자 내림차순 정렬 */


let sorting = (data) => {
    let temp = [];
    for (let i = 0; i < data.length; i++) {
        temp = temp.concat(data[i].listing_id);
    }
    if (temp) {
        console.log(temp)
        temp = temp.sort(function (a, b) {
            return b - a;
        });
    }
    return temp;
};


module.exports = sorting;
