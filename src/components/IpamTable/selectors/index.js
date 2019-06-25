import {createSelector} from 'reselect'

const getRoots = state => state.rootElementsIds
const getRootNetsIds = state => state.rootElementsIds.netsIds
const getRootHostsIds = state => state.rootElementsIds.hostsIds

const getNetworksDataStore = state => state.netData.networks
const getHostsDataStore = state => state.netData.hosts

export const getFilterItemList = state => state.filter.itemList
export const getFilterCursor = state => state.filter.cursor

export const getCurrentFilteredItem = createSelector(
    [getFilterItemList, getFilterCursor],
    (filterItemList, filterCursor) => filterItemList[filterCursor]
)


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
    [getRoots],
    (roots) => {
        return {netsIds: roots.netsIds, hostsIds: roots.hostsIds}
    }
)


