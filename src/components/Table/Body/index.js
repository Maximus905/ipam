import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {tableConnect} from '../TableContext'
import check from 'check-types'

import Row from '../Row'
import Column from '../Column'

// import scrollToComponent from 'react-scroll-to-component'


class Body extends PureComponent {


    tbodyInnerStyles = (tableContext) => {
        const {jssSheet: {classes: css}} = tableContext
        return [css.tableBody, css.tableBodyDc]
    }
    tableInnerStyles = (tableContext) => {
        const {jssSheet: {classes: css}} = tableContext
        return [css.table, css.tableBodySz]
    }

    parseData = (data) => {
        const {tableContext: {columnsParams}} = this.props
        if (check.not.array(data)) return null

        return data.map((rowData, rowIndex) => {
            return (
                <Row index={rowIndex} key={rowIndex}>
                    {
                        columnsParams.map(({accessor}, colIndex) => {
                            return (
                                <Column index={colIndex} key={colIndex}>
                                    {rowData[accessor]}
                                </Column>
                            )
                        })
                    }
                </Row>
            )
        })
    }
    buildBodyHeader = () => {
        const {columnsCss, jssSheet: {classes: css}} = this.props.tableContext
        if (columnsCss.length === 0) {
            console.log("Body lvl: columns css array is empty! Can't build header!")
            return null
        }
        return (<tr>
            {columnsCss.map((column, index) => {
                const cssClass = css[column.columnSizeClass]
                return <th className={cssClass} key={index}>{index}</th>
            })}
        </tr>)
    }
    //
    // scrollIntoView = (node, offset = 0) => {
    //     // console.log('offset', node.scrollIntoView(true))
    //     console.log('offset', this.tbodyRef.current)
    // }
    //
    // scrollToRow = (rowId) => {
    //     const {tableRefs: {rows, bodyContainer}} = this.props.tableContext
    //     const id = rows[rowId]
    //
    //     if (id) {
    //         console.log('--row', ReactDOM.findDOMNode(id.current))
    //         console.log(rowId, ': ', id)
    //         window.rowref = id
    //         window.bodyContainer = bodyContainer
    //         const rowNode = ReactDOM.findDOMNode(id.current)
    //         if (rowNode) {
    //             // this.scrollIntoView(rowNode)
    //             scrollToComponent(id.current)
    //         }
    //     }
    //
    //     console.log('---scroll to row: ', this.props.scrollPosition)
    // }

    render() {
        window.bodyref = this.tbodyRef

        const {data, tableContext, tableContext: {jssSheet, joinCss, formBodyData, columnsParams}} = this.props
        const {classes: css} = jssSheet
        return (
                <table className={this.tableInnerStyles(tableContext).join(" ")}>
                    <thead className={css.hideHeader}>
                    {this.buildBodyHeader()}
                    </thead>
                    <tbody className={joinCss(this.tbodyInnerStyles(tableContext), this.props.cssClasses).join(" ")}>
                    {data ? formBodyData(data, columnsParams) : this.props.children}
                    </tbody>
                </table>
        )
    }
}

Body.propTypes = {
    cssClasses: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string
    ]), //custom css classes
    data: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]), //data from server
}
Body.defaultProps = {}

export default tableConnect(Body)