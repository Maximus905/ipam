import {createSelector} from 'reselect'

const getRootNetsIds = state => state.rootElementsIds.netsIds
const getRootHostsIds = state => state.rootElementsIds.hostsIds

const getNetworksDataStore = state => state.netData.networks
const getHostsDataStore = state => state.netData.hosts

const getFilterStore = state => state.filter
export const getFilterItemList = state => state.filter.itemList
export const getFilterCursor = state => state.filter.cursor

// const getNetworkItemDataStore = (state, props) => {
//
// }
//
// const makeGetNetworkData = () => {
//     return createSelector(
//         []
//     )
// }

export const getRootRowsData = createSelector(
    [getRootNetsIds, getRootHostsIds, getNetworksDataStore, getHostsDataStore],
    (rootNetsIds, rootHostsIds, networksData, hostsData) => {
        const rootNetsData = []
        for (let id of rootNetsIds) {
            const netData = networksData[id]
            if (netData) {
                netData.id = id
                rootNetsData.push(netData)
            }
        }
        const rootHostsData = []
        for (let id of rootHostsIds) {
            const hostData = hostsData[id]
            if (hostData) rootHostsData.push(hostData)
        }
        return {netsData: rootNetsData, hostsData: rootHostsData}
    }
)

export const getRootIds = createSelector(
    [getRootNetsIds, getRootHostsIds],
    (netsIds, hostsIds) => {
        return {netsIds: netsIds, hostsIds: hostsIds}
    }
)

export const getFilterResults = createSelector(
    [getFilterStore],
    (filter) => {
        return filter
    }
)

