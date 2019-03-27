import React, {PureComponent} from 'react'
const TableContext = React.createContext()

export const tableConnect = (Component)  => {
    return class WithTableContext extends PureComponent {
        render() {
            return (<TableContext.Consumer>
                {tableContext => <Component {...this.props} tableContext={tableContext} />}
            </TableContext.Consumer>)
        }
    }
}
// export const tableConnect = (Component)  => {
//     return function connectedComponent(props) {
//         return (<TableContext.Consumer>
//             {tableContext => <Component {...props} tableContext={tableContext} />}
//         </TableContext.Consumer>)
//     }
// }

export const TableProvider =  TableContext.Provider

