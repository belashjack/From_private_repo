const make = function (...val) {
    const args = [];

    // in case function passed directly into make() function, e.g. make(15, 20, sum)
    for (let i = 0; i < val.length; i++) {
        if (typeof val[i] === 'function') {
            return (args.reduce((prev, curr) => val[i](prev, curr)));
        }
        args.push(val[i]);
    }

    return function func(...val) {
        for (let i = 0; i < val.length; i++) {
            if (typeof val[i] === 'function') {
                return (args.reduce((prev, curr) => val[i](prev, curr)));
            }
            args.push(val[i]);
        }
        return func;
    };
};

make();
