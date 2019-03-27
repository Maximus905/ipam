import {
    REQUEST_ELEMENTS,
    RECEIVE_ELEMENTS,
    INVALIDATE_ELEMENTS,
} from '../constants/actions'
import {convertToIntArray} from '../helperFunctions'

const initialState = {}
const initialDataStore = {
    networks: {},
    hosts: {},
}
const networkElementInitialState = {
    ipAddress: "",
    comment: "",
    netChildren: [],
    hostChildren: [],
    didInvalidate: false,
    isFetching: false,
    isExpanded: false,
}
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
 * @param netData
 * @returns {*} changed state of element
 */
const handleNetworkElement = (stateOfElement = networkElementInitialState, actionType, netData) => {

    switch (actionType) {
        case REQUEST_ELEMENTS:
            return Object.assign({}, stateOfElement, {
                didInvalidate: false,
                isFetching: true
            })
        case RECEIVE_ELEMENTS:
            const {__id: id, address: ipAddress, comment, net_children: netChildren, host_children: hostChildren} = netData
            return Object.assign({}, stateOfElement, {
                id,
                ipAddress,
                comment,
                netChildren: convertToIntArray(netChildren),
                hostChildren: convertToIntArray(hostChildren),
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

const handleHostElement = (stateOfElement = hostElementInitialState, actionType, hostData) => {

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

const dataStore = (store = initialDataStore, action) => {
    const {type, payload} = action
    const {networks, hosts} = store

    const {netsIds = [], networksData = {}, hostsIds = [], hostsData = {}} = payload

    switch (type) {
        case REQUEST_ELEMENTS:
        case INVALIDATE_ELEMENTS:
        case RECEIVE_ELEMENTS:
            const updatedNetworkElements = {}
            const updatedHostElements = {}
            netsIds.forEach(id => {
                updatedNetworkElements[id] = handleNetworkElement(networks[id], type,networksData)
            })
            hostsIds.forEach(id => {
                updatedHostElements[id] = handleHostElement(hosts[id], type, hostsData)
            })
            return Object.assign({}, {networks: Object.assign({}, networks, updatedNetworkElements), hosts: Object.assign({}, hosts, updatedHostElements)})
        default:
            return store
    }
}

export default dataStore

const networkElements = (netStore = initialState, action) => {
    const {type, payload} = action
    // if there are not network ids or network data in payload - return netStore
    if (!(payload && (payload.netsIds || payload.networksData))) return netStore
    const {netsIds, networksData} = payload

    switch (type) {
        case REQUEST_ELEMENTS:
        case INVALIDATE_ELEMENTS:
            const updatedElements = {}
            netsIds.forEach(id => {
                updatedElements[id] = handleOneElement(netStore[id], type)
            })
            return Object.assign({}, netStore, updatedElements)
        case RECEIVE_ELEMENTS:
            const receivedElements = {}
            networksData.forEach(data => {
                const {__id: id} = data
                receivedElements[id] = handleOneElement(netStore[id], type, data)
            })
            return Object.assign({}, netStore, receivedElements)
        default:
            return netStore
    }
}
// export default networkElements