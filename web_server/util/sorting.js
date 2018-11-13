/* 숫자 내림차순 정렬 */


let sorting = (data) => {
    let temp = [];
    for (let i = 0; i < data.length; i++) {
        if (i == 0) {
            temp = data[i].post_nums;
        } else {
            temp = temp.concat(data[i].post_nums);
        }
    }
    if (temp) {
        temp = temp.sort(function (a, b) {
            return b - a;
        });
    }
    return temp;
};


module.exports = sorting;