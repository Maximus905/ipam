import {convertToIntArray} from '../helperFunctions'
import {
    REQUEST_ROOT_ELEMENTS_ID,
    RECEIVE_ROOT_ELEMENTS_ID,
    INVALIDATE_ROOT_ELEMENTS_ID,
} from '../constants/actions'

const initialState = {
    netsIds: [],
    hostsIds: [],
    isFetching: false,
    didInvalidate: false
}

const rootElementsIds = (rootElements = initialState, action) => {
    const {type, payload} = action
    switch (type) {
        case REQUEST_ROOT_ELEMENTS_ID:
            return Object.assign({}, rootElements, {
                isFetching: true,
                didInvalidate: false
            })
        case RECEIVE_ROOT_ELEMENTS_ID:
            const {netsIds, hostsIds} = payload
            return Object.assign({}, rootElements, {
                netsIds: convertToIntArray(netsIds),
                hostsIds: convertToIntArray(hostsIds),
                isFetching: false,
                didInvalidate: false
            })
        case INVALIDATE_ROOT_ELEMENTS_ID:
            return Object.assign({}, rootElements, {
                isFetching: false,
                didInvalidate: true
            })
        default:
            return rootElements
    }
}
export default rootElementsIds