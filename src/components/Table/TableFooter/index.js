import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {tableConnect} from '../TableContext'
import Row from '../Row'
import Column from '../Column'
import check from "check-types";

class TableFooter extends PureComponent {
    tfootInnerStyles = (tableContext) => {
        const {jssSheet: {classes: css}} = tableContext
        return [css.tableFooter, css.tableFooterDc]
    }
    tableInnerStyles = (tableContext) => {
        const {jssSheet: {classes: css}} = tableContext
        return [css.table, css.tableHeaderSz]
    }

    /**
     * wrap children into Row tag if need
     * @param children
     * @param {function} filterComponentsByType
     * @returns {*}
     */
    childrenWrapper = (children, filterComponentsByType ) => {
        if (React.Children.count(children) === 0) {
            return <Row/>
        }
        const rows = filterComponentsByType(children, Row, {isFooter: true})
        if (rows.length > 0) {
            return rows
        }
        if (rows.length === 0) {
            return (
                <Row isFooter={true} index={0}>{children}</Row>
            )
        } else {
            return <Row/>
        }
    }
    parseData = (data) => {
        const {tableContext: {columnsParams}} = this.props
        if (check.not.array(data)) return null

        return data.map((rowData, rowIndex) => {
            return (
                <Row isFooter index={rowIndex} key={rowIndex} cssClasses={this.props.cssClasses}>
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

    buildTableFooterHeader = () => {
        const {columnsCss, jssSheet: {classes: css}} = this.props.tableContext
        if (columnsCss.length === 0) {
            console.log("Body lvl: columns css array is empty! Can't build header in tableFooter!")
            return null
        }
        return (<Row isFooter>
            {columnsCss.map((column, index) => {
                return <Column cssClasses={css[column.columnSizeClass]} key={index}>{index}</Column>
            })}
        </Row>)
    }

    render() {
        const {data, tableContext, tableContext: {jssSheet: {classes}}} = this.props
        return (
            <table className={this.tableInnerStyles(tableContext).join(" ")}>
                <thead className={classes.hideHeader}>
                {this.buildTableFooterHeader()}
                </thead>
                <tfoot className={this.tfootInnerStyles(tableContext).join(" ")}>
                {data ? this.parseData(data) : this.props.children}
                </tfoot>
            </table>
        )
    }
}

TableFooter.propTypes = {
    cssClasses: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string
    ]), //custom css classes
}
TableFooter.defaultProps = {}

export default tableConnect(TableFooter)
