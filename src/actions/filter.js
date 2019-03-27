import check from 'check-types'
import {
    SET_FILTER,
    SET_CURSOR,
    BACKUP_NET_ITEMS,
} from '../constants/actions'
import {fetchElementsIfNeeded, netItemsExpand, selectNetItems, deselectNetItems, selectHostItems, deselectHostItems, updateNetItems} from '../actions/netItems'

export const setFilter = ({searchResult}) => ({type: SET_FILTER, payload: {searchResult}})
export const setCursor = (position) => ({type: SET_CURSOR, payload: {position}})
export const backupNetItems = (itemsState) => ({type: BACKUP_NET_ITEMS, payload: {itemsState}})
// export const refreshStateAndBackup = (backupList, restoreList) => ({type: REFRESH_STATE_AND_BACKUP, payload: {backupList, restoreList}})

const netItemsDataSlice = (itemsIds, store) => {
    const {netData, filter: {netItemsBackup}} = store
    const result = {}
    itemsIds.forEach((itemId) => {
        if (netItemsBackup[itemId]) {
            const {isSelected, isExpanded} = netItemsBackup[itemId]
            result[itemId] = {isSelected, isExpanded}
        } else {
            const {isSelected, isExpanded} = netData.networks[itemId]
            result[itemId] = {isSelected, isExpanded}
        }

    })
    return result
}
const netItemsFilterStoreSlice = (itemsIds, store) => {
    const {filter} = store
    const result = {}
    itemsIds.forEach((itemId) => {
        if (filter.netItemsBackup[itemId]) {
            const {isSelected, isExpanded} = filter.netItemsBackup[itemId]
            result[itemId] = {isSelected, isExpanded}
        }
    })
    return result
}
const hostItemsDataSlice = (itemsIds, store) => {
    const {netData} = store
    const result = {}
    itemsIds.forEach((itemId) => {
        const {id, isSelected, isExpanded} = netData.hosts[itemId]
        result[id] = {isSelected, isExpanded}
    })
    return result
}

export const showFilteredItem = ((prevItemList, prevIdx) => (idx) => {
    // if (prevIdx === idx) return () => {}

    return (dispatch, getState) => {
        const {filter, netData} = getState()
        const {itemList, cursor, hostIdBackupList, netIdBackupList, hostItemsBackup, netItemsBackup} = filter
        if (!itemList || (itemList.length && itemList.length === 0)) return
        const currentItem = itemList[idx]
        const prewItem = prevIdx !==undefined ? itemList[prevIdx] : {}

        if (check.not.object(currentItem)) return

        const {id, ip, rec_type, ip_path} = currentItem
        const path = check.string(ip_path) ? ip_path.split(',').map((item) => parseInt(item)) : []
        const netPathIds = [...path]
        const hostsIds = []
        if (rec_type === 'network') {
            netPathIds.push(id)
        } else if (rec_type === 'host') {
            hostsIds.push(id)
        }
        dispatch(fetchElementsIfNeeded({netsIds: netPathIds, hostsIds}))
        //backup states
        const restoreNetIdList = netIdBackupList.filter(netId => !netPathIds.includes(netId))
        const restBackupNetIdList = netIdBackupList.filter(netId => !restoreNetIdList.includes(netId))
        const backupNetIdList = netPathIds.filter(netId => !restBackupNetIdList.includes(netId)).concat(restBackupNetIdList)

        const netItemsForRestoring = netItemsFilterStoreSlice(restoreNetIdList, getState())
        const netItemsForBackuping = netItemsDataSlice(backupNetIdList, getState())
        if (check.not.emptyObject(netItemsForRestoring)) {
            dispatch(updateNetItems(netItemsForRestoring))
        }
        if (check.not.emptyObject(netItemsForBackuping)) {
            dispatch(backupNetItems(netItemsForBackuping))
        }
        dispatch(netItemsExpand(path))
        if (prewItem && prewItem.id !== undefined) {
            if (prewItem.rec_type === 'network') {
                dispatch(deselectNetItems([prewItem.id]))
            } else if (prewItem.rec_type === 'host') {
                dispatch(deselectHostItems([prewItem.id]))
            }
        }
        if (rec_type === 'network') {
            dispatch(selectNetItems([id]))
        } else if (rec_type === 'host') {
            dispatch(selectHostItems([id]))
        }

        prevIdx = idx
    }
})()

export function restoreSavedStates () {
    return (dispatch, getState) => {
        const {filter, netData} = getState()
        const {hostIdBackupList, netIdBackupList, hostItemsBackup, netItemsBackup} = filter
        const {selectedNets, selectedHosts} = netData
        // if (selectedNets.length > 0) dispatch(deselectNetItems(selectedNets))
        // if (selectedHosts.length > 0) dispatch(deselectHostItems(selectedHosts))
        if (check.nonEmptyObject(netItemsBackup)) {
            // console.log('restoreSavedStates')
            dispatch(updateNetItems(netItemsBackup))
            dispatch(backupNetItems({}))
        }
    }
}
