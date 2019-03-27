import check from 'check-types'
/**
 * convert string to int array and return items that >= 0
 * @param dataString
 * @returns {Array}
 */
export function convertToIntArray(dataString) {
    if (check.array(dataString)) return dataString
    if (!check.string(dataString)) return []

    const idArray = dataString.split(",")
    const filteredIds = []
    for (let id of idArray) {
        id = parseInt(id.trim(), 10)
        if (id >= 0) filteredIds.push(id)
    }
    return filteredIds
}

export function isItterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

