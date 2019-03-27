import React, {Component} from 'react'
import AppContext from './appContext'
import PropTypes from 'prop-types'

import {create} from 'jss'
import preset from 'jss-preset-default'
import styles from './styles'

import '../../globalStyles/bootstrap/custBootstrap.scss'

const jss = create(preset())
const cssSheet = jss
    .createStyleSheet(styles)
    .attach()

class App extends Component{
    appRefs = {
        app: null,
        header: null,
        body: null,
        footer: null
    }

    render() {
        const {classes: css} = cssSheet
        return (
            <div className={css.app} ref={el => this.appRefs.app = el}>
                <AppContext.Provider value={{
                    appRefs: this.appRefs,
                    css
                }}>
                    {this.props.children}
                </AppContext.Provider>
            </div>
        )
    }

    componentDidMount() {
    }
    componentWillUnmount() {
    }
}

App.Header = class Header extends Component {
    render() {
        return (
            <AppContext.Consumer>
                {({appRefs, css}) => {
                    return <div className={css.header} ref={el => appRefs.header = el}>{this.props.children}</div>
                }}
            </AppContext.Consumer>
        )
    }
}

App.Body = class Body extends Component {
    render() {
        return (
            <AppContext.Consumer>
                {({appRefs, css}) => {
                    return <div className={css.body} ref={el => appRefs.body = el}>{this.props.children}</div>
                }}
            </AppContext.Consumer>
        )
    }
}

App.Footer = class Footer extends Component {
    render() {
        return (
            <AppContext.Consumer>
                {({appRefs, css}) => {
                    return <div className={css.footer} ref={el => appRefs.footer = el}>{this.props.children}</div>
                }}
            </AppContext.Consumer>
        )
    }
}

App.propTypes = {
    appRefs: PropTypes.shape({
        app: PropTypes.node,
        header: PropTypes.node,
        body: PropTypes.node,
        footer: PropTypes.node
    })
}

export default App
