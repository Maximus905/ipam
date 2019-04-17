const DEVELOPED_BASE_URL = 'netcmdb-loc.rs.ru:8082'
// console.log('location ', window.location)
// const DEVELOPED_BASE_URL = 'netcmdb.rs.ru'
const BASE_URL = (() => {
    const protocol = window.location.protocol
    const hostname = window.location.hostname
    const port = window.location.port
    const developMode = hostname === 'localhost'
    return developMode ? `${protocol}//${DEVELOPED_BASE_URL}` : `${protocol}//${hostname}${port==='' ? '' : ':'}${port}`
})()

export const URL_REQUEST_ROOT_ELEMENTS_ID = `${BASE_URL}/networks/rootElements.json`
export const URL_REQUEST_NET_ELEMENTS_BY_ID = `${BASE_URL}/networks/netElementsByIds.json`
export const URL_REQUEST_HOST_ELEMENTS_BY_ID = `${BASE_URL}/networks/hostElementsByIds.json`
export const URL_FILTERED_SEARCH = `${BASE_URL}/networks/filteredSearch.json`
export const NET_DATA_URL = `${BASE_URL}/api/getNetData.json`
export const VRF_LIST_URL= `${BASE_URL}/api/getVrfList.json`
export const NET_SUBMIT_URL = `${BASE_URL}/api/saveNetData.json`
export const CHECK_ABILITY_DELETE_NETWORK = `${BASE_URL}/api/saveNetData.json`
export const GET_NET_PARENT = `${BASE_URL}/api/getNetParent.json`