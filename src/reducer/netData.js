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
            const {net_id: id, net_ip: ip, net_mask: netmask, net_comment: comment, vrf_id: vrfId, vrf_name: vrfName,vrf_rd:  vrfRd, net_children: netChildren, host_children: hostChildren, net_location: netLocations, bgp_as: bgpAs} = netData
            return Object.assign({}, stateOfElement, {
                id,
                ip,
                netmask,
                comment,
                vrfId,
                vrfName,
                vrfRd,
                bgpAs,
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
            const {port_id: id, port_ip: ip, port_masklen: maskLen, port_mask: mask, port_ip_cidr: ipCidr, port_mac: mac, dev_location: location, port_comment: portComment, port_desc: portDescr, port_name: portName, dev_title: devName, dev_type: devType, dev_hostname: hostname, dev_last_update: lastUpdate, dev_last_update_ms: lastUpdateMs, dev_age_h: age, vrf_name: vrfName, dns } = hostData
            return Object.assign({}, stateOfElement, {
                id,
                ip,
                maskLen,
                mask,
                ipCidr,
                mac,
                location,
                portComment,
                portDescr,
                portName,
                devName,
                devType,
                hostname,
                lastUpdate,
                lastUpdateMs,
                age,
                vrfName,
                dns,
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
                    const {net_id: id} = data
                    updatedNetworkElements[id] = handleNetworkElement(networks[id], type,data)
                }
            }
            if (isItterable(hostsData)) {
                for (const data of hostsData) {
                    const {port_id: id} = data
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
