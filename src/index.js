import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import 'isomorphic-fetch'

import './globalStyles/bootstrap/custBootstrap.scss'

import App from "./components/App";
import AppNavbar from './components/AppNavbar'
import IpamTable from './components/IpamTable'
import './components/fontAwesome/faLibrary.js'
import configureStore from './configureStore'
import {URL_REQUEST_ROOT_ELEMENTS_ID, URL_REQUEST_NET_ELEMENTS_BY_ID, URL_REQUEST_HOST_ELEMENTS_BY_ID} from './constants/IpamTable'

const store = configureStore()
//debug only
window.store = store
console.log('API_GET_ROOT_IDS', URL_REQUEST_ROOT_ELEMENTS_ID)
console.log('API_GET_NET_ELEMENTS_BY_ID', URL_REQUEST_NET_ELEMENTS_BY_ID)
console.log('API_GET_HOST_ELEMENTS_BY_ID', URL_REQUEST_HOST_ELEMENTS_BY_ID)

render(
    <Provider store={store}>
        <App>
            <App.Header>
                <AppNavbar />
            </App.Header>
            <App.Body>
                <IpamTable/>
            </App.Body>
            {/*<App.Footer>*/}

            {/*</App.Footer>*/}
        </App>
    </Provider>,
    document.getElementById("root"));