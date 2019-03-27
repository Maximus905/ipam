// import {convertToIntArray, isDebug} from '../helperFunctions'

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
    UPDATE_NET_ITEMS
} from '../constants/actions'
import {
    URL_REQUEST_NET_ELEMENTS_BY_ID, //should return JSON object like {netData: [array of data for each net ID]}
    URL_REQUEST_HOST_ELEMENTS_BY_ID, //should return JSON object like {hostData: [array of data for each net ID]}
} from '../constants/IpamTable'

/**
 *
 * @param ids object like {netsIds: [array of int ID], hostsIds: [array of int ID}
 * @returns {{type: string, payload: {ids: *}}}
 */
export function requestElements({netsIds, hostsIds}) {
    return {type: REQUEST_ELEMENTS, payload: {netsIds, hostsIds}}
}

export function invalidateElements({netsIds, hostsIds}) {
    return {type: INVALIDATE_ELEMENTS, payload: {netsIds, hostsIds}}
}

export function receiveElements({networksData, hostsData}) {
    return {type: RECEIVE_ELEMENTS, payload: {networksData, hostsData}}
}

export function netItemToggleExpandCollapse(netItemId) {
    return {type: NET_ITEM_TOGGLE_EXPAND_COLLAPSE, payload: {id: netItemId}}
}

/**
 *
 * @param {number[]} netsIds
 * @return {{type: string, payload: {netsIds: number[]}}}
 */
export function selectNetItems(netsIds) {
    return {type: SELECT_NET_ITEMS, payload: {netsIds}}
}
export function deselectNetItems(netsIds) {
    return {type: DESELECT_NET_ITEMS, payload: {netsIds}}
}

export function updateNetItems(itemsState) {
    return {type: UPDATE_NET_ITEMS, payload: {itemsState}}
}

/**
 *
 * @param {number[]} hostsIds
 * @return {{type: string, payload: {hostsIds: number[]}}}
 */
export function selectHostItems(hostsIds) {
    return {type: SELECT_HOST_ITEMS, payload: {hostsIds}}
}
export function deselectHostItems(hostsIds) {
    return {type: DESELECT_HOST_ITEMS, payload: {hostsIds}}
}

/**
 *
 * @param {number[]} netsIds
 * @return {{type: string, payload: {netsIds: number[]}}}
 */
export function netItemsExpand(netsIds) {
    return {type: NET_ITEMS_EXPAND, payload: {netsIds}}
}



/**
 * check each element according elementsId in a given part of store and return array of ids that should be update
 * @param store object
 * @param elementsIds array
 */
function getInvalidatedData(store, elementsIds) {
    if (!elementsIds || elementsIds.length === 0) return []
    return elementsIds.filter(id => {
        return !store[id] || store[id].didInvalidate
    })
}

/**
 *
 * @param ids object like {netsIds: [array of ids], hostsIds: [array of ids]}
 * @returns function
 */
export function fetchElementsIfNeeded({netsIds, hostsIds}) {
    return (dispatch, getState) => {
        const filteredNetsIds = getInvalidatedData(getState().netData.networks ,netsIds)
        const filteredHostsIds = getInvalidatedData(getState().netData.hosts ,hostsIds)
        if (filteredNetsIds.length > 0 || filteredHostsIds.length > 0) {
            dispatch(fetchNetData({netsIds: filteredNetsIds, hostsIds: filteredHostsIds}))
        }
    }
}

function fetchNetData({netsIds, hostsIds}) {
    return async (dispatch) => {
        dispatch(requestElements({netsIds, hostsIds}))
        const requestsArray = []
        if (netsIds.length > 0) {
            const netsFormData = new FormData()
            netsFormData.append("netsIds", netsIds)
            const netsDataRequest = new Request(URL_REQUEST_NET_ELEMENTS_BY_ID, {
                mode: 'cors',
                method: "POST",
                body: netsFormData,
            })
            requestsArray.push(netsDataRequest)
        }
        if (hostsIds.length > 0) {
            const hostsFormData = new FormData()
            hostsFormData.append("hostsIds", hostsIds)
            const hostsDataRequest = new Request(URL_REQUEST_HOST_ELEMENTS_BY_ID, {
                mode: 'cors',
                method: "POST",
                body: hostsFormData,
            })
            requestsArray.push(hostsDataRequest)
        }
        if (requestsArray.length === 0) return

        try {
            const pArray = requestsArray.map(async request => {
                const response = await fetch(request)
                return response.json()
            })
            const fetchResult = await Promise.all(pArray)
            const result = fetchResult.reduce((acc, result) => {return Object.assign(acc, result)}, {})
            dispatch(receiveElements(result))
        } catch (error) {
            console.log('---FETCH ELEMENTS ERROR!: ', error.message)
        }

    }
}



