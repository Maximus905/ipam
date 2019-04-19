import cloneDeep from 'lodash/cloneDeep'
import {
    REQUEST_ELEMENTS,
    RECEIVE_ELEMENTS,
    INVALIDATE_ELEMENTS,
    NET_ITEM_TOGGLE_EXPAND_COLLAPSE,
    NET_ITEMS_EXPAND,
    SELECT_NET_ITEMS,
    DESELECT_NET_ITEMS,
    SELECT_HOST_ITEMS,
    DESELECT_HOST_ITEMS,
    UPDATE_NET_ITEMS,
} from '../constants/actions'
import {convertToIntArray, isItterable} from '../helperFunctions'

const initialDataStore = {
    networks: {},
    hosts: {},
    selectedNets: [],
    selectedHosts: []
}
const networkElementInitialState = () => ({
    netLocations: {},
    netChildren: [],
    hostChildren: [],
    didInvalidate: false,
    isSelected: false,
    isFetching: false,
    isExpanded: false,
})
const hostElementInitialState = {
    didInvalidate: false,
    isSelected: false,
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
const handleNetworkElement = (stateOfElement = networkElementInitialState(), actionType, netData) => {

    switch (actionType) {
        case REQUEST_ELEMENTS:
            return Object.assign({}, stateOfElement, {
                didInvalidate: false,
                isFetching: true
            })
        case RECEIVE_ELEMENTS:
            const {netId: id, address: ipAddress, netmask, comment, vrfId, vrfName, vrfRd, netLocations, net_children: netChildren, host_children: hostChildren} = netData
            return Object.assign({}, stateOfElement, {
                id,
                ipAddress,
                netmask,
                comment,
                vrfId,
                vrfName,
                vrfRd,
                netLocations: JSON.parse(netLocations),
                netChildren: convertToIntArray(netChildren),
                hostChildren: convertToIntArray(hostChildren),
                didInvalidate: false,
                isFetching: false
            })
        case INVALIDATE_ELEMENTS:
            return Object.assign({}, stateOfElement, {
                didInvalidate: true,
            })
        case NET_ITEM_TOGGLE_EXPAND_COLLAPSE:
            return Object.assign({}, stateOfElement, {
                isExpanded: !stateOfElement.isExpanded,
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

const expandNetworkElement = (element) => {
    return Object.assign({...cloneDeep(element), isExpanded: true})
}
const selectItem = (item) => {
    return Object.assign({...cloneDeep(item), isSelected: true})
}
const deselectItem = (item) => {
    return Object.assign({...cloneDeep(item), isSelected: false})
}

const netData = (store = initialDataStore, action) => {
    const {type, payload = {}} = action
    const {networks, hosts, selectedNets, selectedHosts} = store

    const {netsIds = [], networksData = {}, hostsIds = [], hostsData = {}, id} = payload

    const updatedNetworkElements = {}
    const updatedHostElements = {}
    let updatedSelectedNets = []
    let updatedSelectedHosts = []

    switch (type) {
        case REQUEST_ELEMENTS:
        case INVALIDATE_ELEMENTS:
            netsIds.forEach(id => {
                updatedNetworkElements[id] = {...handleNetworkElement(networks[id], type), id}
            })
            hostsIds.forEach(id => {
                updatedHostElements[id] = {...handleHostElement(hosts[id], type), id}
            })
            return Object.assign({}, {...store, networks: Object.assign({}, networks, updatedNetworkElements), hosts: Object.assign({}, hosts, updatedHostElements)})
        case RECEIVE_ELEMENTS:
            if (isItterable(networksData)) {
                for (const data of networksData) {
                    const {netId: id} = data
                    updatedNetworkElements[id] = handleNetworkElement(networks[id], type,data)
                }
            }
            if (isItterable(hostsData)) {
                for (const data of hostsData) {
                    const {__id: id} = data
                    updatedHostElements[id] = handleHostElement(hosts[id], type,data)
                }
            }
            return Object.assign({}, {...store, networks: Object.assign({}, networks, updatedNetworkElements), hosts: Object.assign({}, hosts, updatedHostElements)})
        case NET_ITEM_TOGGLE_EXPAND_COLLAPSE:
            updatedNetworkElements[id] = handleNetworkElement(networks[id], type)
            return Object.assign({}, {...store, networks: Object.assign({}, networks, updatedNetworkElements)})
        case NET_ITEMS_EXPAND:
            netsIds.forEach(id => {
                updatedNetworkElements[id] = expandNetworkElement(networks[id])
            })
            return Object.assign({}, {...store, networks: Object.assign({}, networks, updatedNetworkElements)})
        case SELECT_NET_ITEMS:
            netsIds.forEach(id => {
                updatedNetworkElements[id] = selectItem(networks[id])
            })
            return Object.assign({}, {...store, networks: Object.assign({}, networks, updatedNetworkElements), selectedNets: netsIds})
         case DESELECT_NET_ITEMS:
            netsIds.forEach(id => {
                updatedNetworkElements[id] = deselectItem(networks[id])
            })
            updatedSelectedNets = selectedNets.filter(id => !netsIds.includes(id))
            return Object.assign({}, {...store, networks: Object.assign({}, networks, updatedNetworkElements), selectedNets: updatedSelectedNets})
        case SELECT_HOST_ITEMS:
            hostsIds.forEach(id => {
                updatedHostElements[id] = selectItem(hosts[id])
            })
            return Object.assign({}, {...store, hosts: Object.assign({}, hosts, updatedHostElements), selectedHosts: hostsIds})
        case DESELECT_HOST_ITEMS:
            hostsIds.forEach(id => {
                updatedHostElements[id] = deselectItem(hosts[id])
            })
            updatedSelectedHosts = selectedHosts.filter(id => !hostsIds.includes(id))
            return Object.assign({}, {...store, hosts: Object.assign({}, hosts, updatedHostElements), selectedHosts: updatedSelectedHosts})
        case UPDATE_NET_ITEMS:
            const {itemsState = {}} = payload
            for (const [id, item] of Object.entries(itemsState)) {
                const fromStore = store.networks[id]
                if (!fromStore) continue
                updatedNetworkElements[id] = Object.assign(cloneDeep(fromStore), item)
            }
            return Object.assign({}, {...store, networks: Object.assign({}, networks, updatedNetworkElements)})
        default:
            return store
    }
}

export default netData
