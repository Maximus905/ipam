import {combineReducers} from 'redux'
import rootElementsIds from './rootElementsIds'
import netData from './netData'
import filter from './filter'

export default combineReducers({
    rootElementsIds,
    netData,
    filter
})
