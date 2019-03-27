import {createSelector} from 'reselect'

const defaultNetRecordItemData = {
    ipAddress: "",
    comment: "",
    isFetching: false,
    isExpanded: false,
    didInvalidate: true,
    netChildren: [],
    hostChildren: []
}
const defaultNetRecordItemStore = {}

export const getNetworkItemsStore = state => {
    return state.netData.networks
}

const getNetworkItemStore2 = (state, props) => {
    const itemStore = state.netData.networks[props.id]
    return itemStore ? itemStore : defaultNetRecordItemStore
}
const getNetworkItemStore = (netStore, props) => {

    const itemStore = netStore[props.id]
    // const itemStore = defaultNetRecordItemData
    return itemStore ? itemStore : defaultNetRecordItemStore
}

export const makeGetNetworkItemData = () => {
    // console.log('--create selector')
    return createSelector(
        getNetworkItemStore,
        (networkItemStore) => {
            return Object.assign({}, defaultNetRecordItemData, networkItemStore)
        }
    )
}