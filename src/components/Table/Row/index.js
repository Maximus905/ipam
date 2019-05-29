import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {tableConnect} from '../TableContext'
import Column from '../Column'
import {ContextMenuTrigger} from "react-contextmenu"

class Row extends Component {
    innerStyles = () => {
        const {jssSheet: {classes: css}} = this.props.tableContext
        const {isHeader, isFooter, isSelected} = this.props
        let result = []
        if (!isHeader && !isFooter) {
            result.push(css.tableBodyRowDc)
        } else if (isHeader) {
            result.push(css.tableHeaderRowDc)
        } else if (isFooter) {
            result.push(css.tableFooterRowDc)
        }
        if (isSelected) result.push(css.selectedRow)
        return result

    }
    // rowId = null

    render() {
        const {isHeader, isFooter, rowType, rowId = null, id, tableContext: {filterComponentsByType, joinCss, jssSheet: {classes: css}, createRowRef}} = this.props
        // const {isHeader, isFooter, rowId} = this.props
        const injectedProps = isHeader ? {isHeader: true, } : (isFooter ? {isFooter: true, } : {})
        const contextMenuId = (rowType) => {
            if (rowType === 'network') return 'netRowMenu'
            if (rowType === 'host') return 'hostRowMenu'
            return ''
        }

        return (
            <ContextMenuTrigger disable={isHeader || isFooter} holdToDisplay={-1} id={contextMenuId(rowType)} renderTag="tr" attributes={{
                className: joinCss(this.innerStyles(), this.props.cssClasses).join(" "), "data-row-type": rowType, "data-id": id,
            }} collect={()=>({rowType, id})}>
                {filterComponentsByType(this.props.children, Column, injectedProps)}
                {isHeader || isFooter ? <td className={css.scrollSz} /> : <td className={'scrollBodyCell ' + css.scrollBodySz}  ref={id ? createRowRef(id, rowType) : null} />}
            </ContextMenuTrigger>
        )
    }
    componentDidMount() {
        //this.rowId = this.props.rowId
    }

    componentWillUnmount() {
        const {rowType, id = null, tableContext: {deleteRowRef}} = this.props
        // console.log('unmount ', this.rowId)
        //TODO implement removing ref of row in DidUnmount
        deleteRowRef(id, rowType)
    }
}

Row.propTypes = {
    cssClasses: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string
    ]), //custom css classes
    rowId: PropTypes.any, //if exists, is used by createRowRef for creating ref
    rowType: PropTypes.oneOf(['network', 'host']),
    id: PropTypes.number, //item's id (DB id)
    isSelected: PropTypes.bool,
}
Row.defaultProps = {}

export default tableConnect(Row)
