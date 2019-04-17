import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {tableConnect} from '../TableContext'
import Row from '../Row'
import Column from '../Column'
import {ContextMenu, ContextMenuTrigger, MenuItem} from 'react-contextmenu'



class Header extends PureComponent {

    tableInnerStyles = () => {
        const {jssSheet: {classes: css}} = this.props.tableContext
        return [css.table, css.tableHeaderSz]
    }
    headerInnerStyles = () => {
        // const {jssSheet: {classes: css}} = this.props.tableContext
        return []
    }

    /**
     * wrap columns in Row if need
     * join inner css classes with users classes
     *
     * @returns Array array of rows that can be rendered
     */
    buildHeaderRows() {
        const {children, tableContext: {filterComponentsByType, columnsCss, jssSheet, joinCss}} = this.props
        const {classes: css} = jssSheet

        if (columnsCss.length === 0) {
            console.log("Header lvl: columns css array is empty! Can't build header!")
            return null
        }

        const rows = filterComponentsByType(children, Row, {isHeader: true})
        if (rows.length > 0) {
        //    add appropriated css classes from columnsParams to each column in last row
            let lastRow = rows[rows.length - 1]
            let columns = filterComponentsByType(lastRow.props.children, Column)
            columns = columns.map(column => {
                const {index} = column.props
                //get css classes for this column from tableContext.columnsParams
                const columnClasses = columnsCss[index]
                const innerCss = [
                    css[columnClasses.columnClass],
                    css[columnClasses.columnSizeClass],
                    css[columnClasses.columnDecoClass],
                ]
                //join with cssClasses of column
                const cssClasses = joinCss(innerCss, column.props.cssClasses)
                return React.cloneElement(column, {cssClasses: cssClasses.join(" "), writeParams: true})
            })
            // build new last row and replace it in rows array
            rows[rows.length - 1] = React.cloneElement(
                lastRow,
                {},
                [...columns]
            )
        }
        return rows
    }

    render() {
        const {cssClasses, tableContext: {joinCss}} = this.props
        return (
            <table className={this.tableInnerStyles().join(" ")}>
                <thead className={joinCss(this.headerInnerStyles(), cssClasses)}>
                {this.buildHeaderRows()}
                </thead>
            </table>
        )
        //return (
        //    <ContextMenuTrigger id={"headerTableMenu"} renderTag="table" attributes={{className: joinCss(this.headerInnerStyles(), cssClasses)}} collect={()=>({'baz': 'test'})}>
        //        <thead className={joinCss(this.headerInnerStyles(), cssClasses)}>
        //        {this.buildHeaderRows()}
        //        </thead>
        //    </ContextMenuTrigger>
        //)
    }
}

Header.propTypes = {
    cssClasses: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string
    ]), //custom css classes
    style: PropTypes.object,
}
Header.defaultProps = {}

export default tableConnect(Header)