

exports.bubble = (origin, asc = true) => {
    const arr = [...origin];
    for (let i = 0; i < arr.length; i += 1) {
        let prev = arr[i];
        for (let j = i + 1; j < arr.length; j += 1) {
            let cur = arr[j];
    
            if ((asc && prev > cur) || (!asc && prev < cur)) {
                [prev, cur] = [cur, prev];
            }
        }
    }
    return arr;
}


exports.quick = require('./quicksort').default;