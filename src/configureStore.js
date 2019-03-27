import {createStore, applyMiddleware, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducer'

export default function configureStore() {
    if (window.__REDUX_DEVTOOLS_EXTENSION__) {
        return createStore(
            reducer,
            compose(
                applyMiddleware(
                    thunkMiddleware
                ),
                window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
            )

        )
    }
    return createStore(
        reducer,
        applyMiddleware(thunkMiddleware)
    )

}