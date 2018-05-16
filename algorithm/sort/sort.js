

exports.bubble = (arr, asc = true) => {
    for (let i = 0; i < arr.length; i += 1) {
        let prev = arr[i];
        for (let j = i + 1; j < arr.length; j += 1) {
            let cur = arr[j];
    
            if ((asc && cur < prev) || (!asc && cur < prev)) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                prev = arr[i];
            }
        }
    }
    return arr;
}


exports.quick = require('./quicksort').quickSort;