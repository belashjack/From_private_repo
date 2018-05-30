const sumOfOther = function (arr) {
    if (arr.length === 1) {
        return [0];
    }
    return (arr.map((curr, i) => arr.slice(0, i).concat(arr.slice(i + 1, arr.length)).reduce((sum, curr) => sum + curr)));
};

sumOfOther();
