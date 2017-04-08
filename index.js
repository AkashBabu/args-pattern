

/**
 * Check if the given value if Undefined or null
 * 
 * @param {any} d - param whose values has to be checked
 * @returns {boolean} 
 */
function isUndefined (d) {
    return (d == undefined || d == null)
}


/**
 * Validates the Arguments Parsing Pattern
 */
function validatePattern(pattern) {
    return ((pattern.match(/\[/g) || []).length == (pattern.match(/\]/g) || []).length)
}


/**
 * Parses the pattern provided
 * 
 * @param {string} pattern - arguments parsing pattern  
 * @returns {Array.<Array.<Object>>}
 */
function parsePattern(pattern) {
    var args = pattern.split(",")

    var argsWithLevel = []
    var flatArgs = []
    var level = 0
    args.forEach((arg, i) => {
        var match = arg.match(/(\W*)\w*(\W*)/) // Match the braces before and after the variable name 
        var headGrp = match[1]
        var tailGrp = match[2]

        level += (headGrp.match(/\[/g) || []).length - (headGrp.match(/\]/g) || []).length // Change level value before assigning level

        var name = arg.replace(/ /g, '').replace(/\[/g, '').replace(/\]/g, '') // trim namespace

        if (!argsWithLevel[level]) { // Create empty array if it doesnt exist
            for (var j = argsWithLevel.length; j <= level; j++) {
                argsWithLevel.push([])
            }
        }

        argsWithLevel[level].push({
            name: name,
            index: i,
        })

        level += (tailGrp.match(/\[/g) || []).length - (tailGrp.match(/\]/g) || []).length // Change level value after assign level
    })

    args = null;

    return argsWithLevel
}

/**
 * Assign Values to parsed Names
 * 
 * @param {Array} args - arguments to parse
 * @param {Array.<Array.<Object>>} parsedNames - parsed pattern names
 * @param {Object} defaults
 * @param {Array.<any>} defaults.args - default values to be assigned
 * @returns {Array.<any>}
 */
function assignValues(args, parsedPattern, defaults) {
    var argsLen = args.length;

    var flattenParsed = []

    // Flatten the parsed Array of Arrays
    parsedPattern.forEach((argsLevel) => {
        flattenParsed = flattenParsed.concat(argsLevel)
    })

    // Sort only the part till the argument length 
    flattenParsed = flattenParsed.slice(0, argsLen).sort((a, b) => {
        if(a.index > b.index) return 1
        else if (a.index < b.index) return -1
        return 0 
    }).concat(flattenParsed.slice(argsLen))
    
    // Assign the passed arguments
    args.forEach((arg, i) => {
        (flattenParsed[i] || {}).value = arg
    })

    // Assign default value to the variables which were not passed any values, and sort 
    flattenParsed = flattenParsed.sort((a, b) => {
        if (a.index > b.index) return 1
        else if (a.index < b.index) return -1
        return 0;
    }).map(a => isUndefined(a.value) ? ((defaults || {}).args || {})[a.index]: a.value)

    return flattenParsed
}


/**
 * Parses arguments based on the pattern given
 * 
 * @param {array} args - arguments to be parsed
 * @param {string} pattern - Parsing pattern
 * @param {object} defaults 
 * @param {array} defaults.args - defaults values to be assigned
 * @return {array} parsed data 
 */
function parseArgs(args, pattern, defaults) {
    args = Array.prototype.slice.call(args)
    pattern = pattern || "";
    defaults = defaults || {}

    if (!validatePattern(pattern)) {
        throw new Error("Invalid Pattern")
    }
    let parsedPattern = parsePattern(pattern) 
    var assignedValues = assignValues(args, parsedPattern, defaults)
    return assignedValues
}

module.exports = parseArgs