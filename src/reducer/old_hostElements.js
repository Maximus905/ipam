import {
    REQUEST_ELEMENTS,
    RECEIVE_ELEMENTS,
    INVALIDATE_ELEMENTS,
} from '../constants/actions'
import {convertToIntArray} from '../helperFunctions'

const initialState = {}
const hostElementInitialState = {
    ipAddress: "",
    comment: "",
    didInvalidate: false,
    isFetching: false,
    isExpanded: false,
}
/**
 * helper function for change state of one network element
 * @param stateOfElement
 * @param actionType
 * @param hostData
 * @returns {*} changed state of element
 */
const handleOneElement = (stateOfElement = hostElementInitialState, actionType, hostData) => {

    switch (actionType) {
        case REQUEST_ELEMENTS:
            return Object.assign({}, stateOfElement, {
                didInvalidate: false,
                isFetching: true
            })
        case RECEIVE_ELEMENTS:
            const {__id: id, ipAddress, comment, macAddress} = hostData
            return Object.assign({}, stateOfElement, {
                id,
                ipAddress,
                comment,
                macAddress,
                didInvalidate: false,
                isFetching: false
            })
        case INVALIDATE_ELEMENTS:
            return Object.assign({}, stateOfElement, {
                didInvalidate: true,
            })
        default:
            return stateOfElement
    }
}

const hostElements = (hostStore = initialState, action) => {
    const {type, payload} = action
    // if there are not hosts id or host data in payload - return netStore
    if (!(payload && (payload.hostsIds || payload.hostsData))) return hostStore
    const {hostsIds, hostsData} = payload

    switch (type) {
        case REQUEST_ELEMENTS:
        case INVALIDATE_ELEMENTS:
            const updatedElements = {}
            hostsIds.forEach(id => {
                updatedElements[id] = handleOneElement(hostStore[id], type)
            })
            return Object.assign({}, hostStore, updatedElements)
        case RECEIVE_ELEMENTS:
            const receivedElements = {}
            hostsData.forEach(data => {
                const {__id: id} = data
                receivedElements[id] = handleOneElement(hostStore[id], type, data)
            })
            return Object.assign({}, hostStore, receivedElements)
        default:
            return hostStore
    }
}
export default hostElements