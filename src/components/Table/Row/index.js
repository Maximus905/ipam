import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {tableConnect} from '../TableContext'
import Column from '../Column'

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
    rowId = null

    render() {
        const {isHeader, isFooter, rowRef: rowId} = this.props
        const injectedProps = isHeader ? {isHeader: true, } : (isFooter ? {isFooter: true, } : {})
        const {tableContext: {filterComponentsByType, joinCss, jssSheet: {classes: css}, createRowRef}} = this.props

        return (
            <tr className={joinCss(this.innerStyles(), this.props.cssClasses).join(" ")} data-id={rowId} ref={rowId ? createRowRef(rowId) : null}>
                {filterComponentsByType(this.props.children, Column, injectedProps)}
                {isHeader || isFooter ? <td className={css.scrollSz} /> : <td className={css.scrollBodySz} />}
            </tr>
        )
    }
    componentDidMount() {
        this.rowId = this.props.rowId
    }

    componentWillUnmount() {
        // console.log('unmount ', this.rowId)
        //TODO implement removing ref of row in DidUnmount
    }
}

Row.propTypes = {
    cssClasses: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string
    ]), //custom css classes
    rowId: PropTypes.any, //if exists - invoke createRowRef to create ref
    isSelected: PropTypes.bool,
}
Row.defaultProps = {}

export default tableConnect(Row)
