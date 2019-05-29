import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {tableConnect} from '../TableContext'
import {DEFAULT_TABLE_STYLE} from "../tableConstants";

class Column extends Component {

    innerStyles = () => {
        // const {jssSheet: {classes: css}} = this.props.tableContext
        return []
    }

    saveColumnParams() {
        const {index, minWidth, maxWidth, fixed, accessor, filterable, sortable,  tableContext: {columnsParams, dimensions: {columnsSizes}}} = this.props
        columnsSizes[index] = {
            minWidth: parseInt(minWidth),
            width: parseInt(minWidth),
            maxWidth: parseInt(maxWidth),
            fixed,
        }
        columnsParams[index] = {
            accessor,
            filterable,
            sortable
        }
    }

    render() {
        const {title, cssClasses, children, isHeader, writeParams, tableContext: {joinCss}} = this.props
        const innerStyles = this.innerStyles()
            if (isHeader) {
                if (writeParams) this.saveColumnParams()
                return <th className={joinCss(innerStyles, cssClasses).join(" ")}>{title ? title : children}</th>
            } else {
                return <td className={joinCss(innerStyles, cssClasses).join(" ")} title={this.props.hint}>{children}</td>
            }
    }
}

Column.propTypes = {
    //from Row
    isHeader: PropTypes.bool, //injected by Row
    //from Header
    writeParams: PropTypes.bool, // for internal use only! if set column have to write its params into tableContext.columnsParams (params like width ...)
    //
    title: PropTypes.string, //if not set will be used children
    hint: PropTypes.string, //if not set will be used children
    accessor: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string
    ]),
    minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), //min column width in px (if number, convert to px)
    maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), //min column width in px (if number, convert to px)
    padding: PropTypes.string,
    fixed: PropTypes.bool, // fix size of column
    sortable: PropTypes.bool,
    filterable: PropTypes.bool,
    cssClasses: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string
    ]), //custom css classes
    order: PropTypes.number, //can be used for columns reorder
    index: PropTypes.number, //index number of column in config array
}
Column.defaultProps = {
    minWidth: DEFAULT_TABLE_STYLE.columnMinWidth,
    maxWidth: DEFAULT_TABLE_STYLE.columnMaxWidth,
    padding: DEFAULT_TABLE_STYLE.columnPadding,
    fixed: false,
    changeWidth: true,
    sortable: false,
    filterable: false,
    order: 0,
}

export default tableConnect(Column)