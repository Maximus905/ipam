import {
    SET_CURSOR,
    SET_FILTER,
    SHOW_RESULT_ITEM,
    BACKUP_NET_ITEMS
} from '../constants/actions'

const initialFilterStore = {
    itemList: [],
    hostIdBackupList: [],
    netIdBackupList: [],
    hostItemsBackup: {},
    netItemsBackup: {},
    cursor: 0,
}

const filter = (store = initialFilterStore, action) => {
    const {type, payload} = action
    // const {itemList, hostStateBackups, netStateBackup, cursor} = store

    switch (type) {
        case SET_FILTER:
            const {searchResult} = payload
            return {...store, itemList: searchResult, cursor: 0}
        case SET_CURSOR:
            const {position} = payload
            return {...store, cursor: position}
        case BACKUP_NET_ITEMS:
            const {itemsState} = payload
            const netIdBackupList = Object.keys(itemsState).map(id => parseInt(id))
            return {...store, netItemsBackup: itemsState, netIdBackupList}
        case SHOW_RESULT_ITEM:
        default:
            return store
    }
}
export default filter