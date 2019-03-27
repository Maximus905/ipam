import {
    REQUEST_ROOT_ELEMENTS_ID,
    RECEIVE_ROOT_ELEMENTS_ID,
    INVALIDATE_ROOT_ELEMENTS_ID,
} from '../constants/actions'
import {fetchElementsIfNeeded} from './netItems'
import {URL_REQUEST_ROOT_ELEMENTS_ID} from '../constants/IpamTable'

export function requestRootElementsId() {
    return {type: REQUEST_ROOT_ELEMENTS_ID}
}

export function receiveRootElementsId(data) {
    const {netsIds, hostsIds} = data
    return {type: RECEIVE_ROOT_ELEMENTS_ID, payload: {netsIds, hostsIds}}
}
export function invalidateRootElementsId() {
    return {type: INVALIDATE_ROOT_ELEMENTS_ID}
}
function fetchRootElementsId() {
    return async (dispatch) => {
        dispatch(requestRootElementsId())
        const request = new Request(URL_REQUEST_ROOT_ELEMENTS_ID, {
            mode: 'cors',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
        const response = await fetch(request)
        const {rootElementsIds} = await response.json()
        dispatch(receiveRootElementsId(rootElementsIds))
    }
}
function shouldFetchRootElementsId(state) {
    const {rootElements} = state
    return !rootElements || rootElements.didInvalidate
}

export function fetchRootElementsIdIfNeeded() {
    return async (dispatch, getState) => {
        if (shouldFetchRootElementsId(getState())) {
            await dispatch(fetchRootElementsId())
            return Promise.resolve()
        } else {
            return Promise.resolve()
        }
    }
}
export function forceUpdateRootElements() {
    return async (dispatch, getState) => {
        // dispatch(invalidateRootElementsId())
        await dispatch(fetchRootElementsId())
        const {rootElementsIds: {netsIds, hostsIds}} = getState()
        dispatch(fetchElementsIfNeeded({netsIds, hostsIds}))
    }
}
export function forceUpdateRootElementsIds() {
    return async (dispatch, getState) => {
        // dispatch(invalidateRootElementsId())
        dispatch(fetchRootElementsId())
    }
}