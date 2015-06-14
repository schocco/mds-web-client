module.exports = function(start, end, step, block) {
    var accum = '';
    for(var i = start; i <= end; i=i+step)
        accum += block.fn(i);
    return accum;
}