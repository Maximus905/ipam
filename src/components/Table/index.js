import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import check from 'check-types'
import ScrollbarSize from 'react-scrollbar-size'
import {darkenColor} from './Theme/Utils'

import Header from './Header'
import Body from './Body'
import TableFooter from './TableFooter'
import Footer from './Footer'
import Row from './Row'
import Column from './Column'
import Pagination from './Pagination'
import Pagination2 from './Pagination2'
import Pagination3 from './Pagination3'
import './fontAwesome/faLibrary.js'

import {TableProvider} from './TableContext'
import {DEFAULT_VALUES, DEFAULT_TABLE_STYLE, DEFAULT_CSS_CLASS_NAMES} from './tableConstants'
import theme from './Theme'

import jss from './jssInstance'

class Table extends PureComponent {

    state = {
        tableBodyData: [],
        tableFooterData: [],
    }

    tableRefs = {
        container: React.createRef(),
        bodyContainer: React.createRef(),
        rows: {}
    }
    scroll = {
        width: 17,
        height: 17,
        cellWidth: 17,
        bodyCellWidth: 0,
    }

    tableStyles = {
        //LVL 0
        container: {
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            '& table, & thead, & tbody, & tfoot, & tr, & th, & td': {boxSizing: 'border-box',}
        },
        // LVL 1
        tableContainer: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            overflowX: 'auto',
            boxSizing: 'border-box',
        },
        footerContainer: {
            display: 'flex',
            flexGrow: 0,
            flexShrink: 0,
            justifyContent: 'space-between',
            boxSizing: 'border-box',
        },
        // LVL 2
        tableHeaderBodyContainer: {
            display: 'flex',
            flexDirection: 'column',
            flexBasis: 1,
            flexGrow: 1,
            flexShrink: 0,
        },
        tableFooterContainer: {
            flexGrow: 0,
            flexShrink: 0,
        },
        // LVL 3
        tableHeaderContainer: {
            flexGrow: 0,
            flexShrink: 0,
        },
        tableBodyContainer: {
            //position: 'relative',
            flexBasis: 1,
            flexGrow: 1,
            flexShrink: 0,
            overflowY: 'scroll'
        },
        // LVL 4
        table: {
            tableLayout: 'fixed'
        },

        tableHeader: {

        },
        tableBody: {
        },
        tableFooter: {},

// DECORATION STYLES
        tableContainerDc: {
            backgroundColor: theme.tableBgColor,
            color: theme.tableTextColor,
        },
        tableBodyContainerDc: {
            backgroundColor: theme.bodyBgColor,
        },
        tableHeaderRowDc: {
            backgroundColor: theme.headerBgColor,
            color: theme.headerTextColor,
            '& th': {
                padding: theme.paddingHeaderCell
            },
        },
        tableBodyDc:{
            backgroundColor: theme.bodyBgColor,
            color: theme.bodyTextColor
        },
        tableBodyRowDc: {
            backgroundColor: theme.bodyBgColor,
            '&:nth-child(odd)': {
                backgroundColor: this.props.bodyStriped ? darkenColor(theme.bodyBgColor, theme.stripedColorFactor) : theme.bodyBgColor
            },
            '& td': {
                padding: theme.paddingBodyCell,
                wordWrap: 'break-word'
            },
            '& td.scrollBodyCell': {
                padding: 0
            },
            '&:hover': {
                backgroundColor: darkenColor(theme.bodyBgColor, theme.hoverColorFactor)
            }
        },
        tableFooterDc: {
            backgroundColor: theme.tableFooterBgColor,
            color: theme.tableFooterTextColor,
        },
        tableFooterRowDc: {
            backgroundColor: theme.tableFooterBgColor,
            '&:nth-child(odd)': {
                backgroundColor: this.props.bodyStriped ?
                    darkenColor(theme.tableFooterBgColor, theme.stripedColorFactor)
                    : theme.tableFooterBgColor
            },
            '& td': {
                padding: theme.paddingTableFooterCell
            },
            '&:hover': {
                backgroundColor: darkenColor(theme.tableFooterBgColor, theme.hoverColorFactor)
            }
        },
        footerContainerDc: {
            padding: '5px 5px',
            backgroundColor: theme.footerBgColor
        },
// SIZE STYLES
        containerSz: {
            height: '100%'
        },
        tableBodyContainerSz: {width: null},
        tableFooterContainerSz: {width: null},
        tableHeaderSz: {width: null},
        tableBodySz: {width: null},
        scrollSz: {width: null},
        scrollBodySz: {},
// SPECIAL STYLES
        hideHeader: {
            fontSize: [[0], '!important'],
            height: [[0], '!important'],
            '& tr': {
                border: [['none'], '!important'],
                padding: [[0], '!important'],
            },
            '& td': {
                border: [['none'], '!important'],
                padding: [[0], '!important'],
            },
            '& th': {
                border: [['none'], '!important'],
                padding: [[0], '!important'],
            }
        },
        selectedRow: {
            backgroundColor: theme.selectedRowBgColor + ' !important',
            color: theme.selectedRowTextColor + ' !important',
        }
    }
    jssSheet = jss.createStyleSheet(this.tableStyles, {link: true})

    /**
     * join inner and external css classes lists into array
     * @param {(string|string[])} innerCssClasses
     * @param {(string|string[])} extCssClasses
     * @returns {string[]}
     */
    static joinCss(innerCssClasses, extCssClasses) {
        // convert  innerCssClasses to array
        innerCssClasses = check.array(innerCssClasses) ? innerCssClasses : (
            check.nonEmptyString(innerCssClasses) ? [innerCssClasses] : []
        )
        // convert extCssClasses to array
        extCssClasses = check.nonEmptyString(extCssClasses) ? [extCssClasses] : (
            check.array(extCssClasses) ? extCssClasses : []
        )

        return [...innerCssClasses, ...extCssClasses]
    }

    /**
     * @param children
     * @param {Object} component that instances should be filtered
     * @param {Object} injectedProps this props will be injected into filtered children
     * @param {boolean} injectIndex if true - prop index will be injected
     * @returns {Array}
     */
    filterComponentsByType(children, component, injectedProps = {}, injectIndex = true) {
        const result = []
        React.Children.forEach(children, (child, index) => {
            if (child.type === component) {
                if (injectIndex) injectedProps.index = index
                result.push(React.cloneElement(child, {...injectedProps, key: index}))
            }
        })
        return result
    }

    updateColumnsSizesInDOM = () => {
        const {dimensions, dimensions: {columnsSizes}, columnsCss} = this.tableContext
        columnsCss.forEach((columnSet, index) => {
            this.jssSheet.getRule(columnSet.columnSizeClass).prop('width', columnsSizes[index].width)
        })
        this.jssSheet.getRule('tableHeaderSz').prop('width', dimensions.columnsWidth + this.scroll.cellWidth)
        this.jssSheet.getRule('tableBodySz').prop('width', dimensions.columnsWidth + this.scroll.bodyCellWidth)
        this.jssSheet.getRule('tableBodyContainerSz').prop('width', dimensions.columnsWidth + this.scroll.cellWidth)
        this.jssSheet.getRule('scrollSz').prop('width', this.scroll.cellWidth)
        this.jssSheet.getRule('scrollBodySz').prop('width', this.scroll.bodyCellWidth)
    }

    updateDimensions = () => {

        const {dimensions, dimensions: {columnsSizes}} = this.tableContext
        dimensions.containerWidth = this.tableRefs.container.current.clientWidth
        const sumOfMinWidth = columnsSizes.reduce((sum, column) => {
            return sum + column.minWidth
        }, 0 )
        const scrollSize = this.scroll.width
        window.scrollSize = scrollSize

        //calculate free space for distribute
        let freeSpace = Math.trunc(dimensions.containerWidth - sumOfMinWidth - scrollSize)
        // if (freeSpace <=0) {
        //     console.log('no free space')
        //     console.log('--finished', Date.now() - startTime, this.tableContext.dimensions)
        // }

        // let counter = 0
        let numberOfExtendableColumns = 0
        //reset width of columns to minWidth
        columnsSizes.forEach(column => column.width = column.minWidth)

        while (freeSpace > 0) {
            //if don't have columns that can be extended - break cycle
            numberOfExtendableColumns = columnsSizes.reduce((sum, column) => {
                return column.fixed || column.width >= column.maxWidth ? sum : ++sum
            }, 0)
            if (numberOfExtendableColumns === 0) {
                break
            }
            //if few free space - distribute by 1 per column
            if (freeSpace < numberOfExtendableColumns) {
                for (const column of columnsSizes) {
                    if (column.fixed || column.width >= column.maxWidth) continue
                    column.width++
                    freeSpace--
                    if (freeSpace <= 0) {
                        // console.log('distributed by 1 per column')
                        break
                    }
                }
            }

            //if free space enough to distribute between extendable columns
            const spacePerColumn = Math.trunc(freeSpace/numberOfExtendableColumns)
            for (let column of columnsSizes) {
                if (column.fixed || column.width >= column.maxWidth) continue
                let additionWidth = column.maxWidth - column.width >= spacePerColumn ? spacePerColumn : column.maxWidth - column.width
                freeSpace -= additionWidth
                column.width += additionWidth
            }
            // ++counter
        }
        //calculate new scroll cell width, table width
        const columnsWidth = columnsSizes.reduce((sum, column) => {return sum + column.width}, 0)
        this.scroll.cellWidth =
            columnsWidth + this.scroll.width > dimensions.containerWidth ?
                this.scroll.width :
                dimensions.containerWidth - columnsWidth
        this.scroll.bodyCellWidth = this.scroll.cellWidth - this.scroll.width
        dimensions.columnsWidth = columnsWidth
    }

    updateColumns = () => {
        this.updateDimensions()
        this.updateColumnsSizesInDOM()
    }



    /**
     * parse result of fetchData function.
     * If it object:
     *  1) find key 'body'. If key exists and type of value is Array, write to state.tableBodyData
     *  2) find key 'footer'. If key exists and type of value is Array, write to state.tableFooterData
     * If it array, consider it as body data and write to state.tableBodyData
     * @param data
     */
    parseFetchedResult(data) {
        const {bodyDataKey, footerDataKey} = this.props
        if (check.object(data)) {
            if (data[bodyDataKey])  this.setState({tableBodyData: data[bodyDataKey]})
            if (data[footerDataKey])  this.setState({tableFooterData: data[footerDataKey]})
        } else if (check.array(data)) {
            this.setState({tableBodyData: data})
        } else {
            throw new Error('Invalid data format')
        }
    }

    /**
     * fetch data using this.props.fetchData function and update Body of Table
     * @returns {Promise<void>}
     */
    updateData = async () => {
        try {
            const data = this.props.data ? this.props.data : await this.props.fetchData(this.tableContext.states.pagination)
            this.parseFetchedResult(data)
        } catch (e) {
            console.log('---!!! Table: fetch data error! ', e)
        }
    }

    formBodyData = (data, columnsParams) => {
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

    createRowRef = (id, rowType) => {
        if (check.number(id) && !this.tableRefs.rows[`${id}_${rowType}`]) {
            const ref = React.createRef()
            this.tableRefs.rows[`${id}_${rowType}`] = ref
            // console.log('created', id, rowType)
            return ref
        }
        // console.log('exists', id, rowType)
        return this.tableRefs.rows[`${id}_${rowType}`]
    }

    deleteRowRef = (id, rowType) => {
        if (check.number(id) && this.tableRefs.rows[`${id}_${rowType}`]) {
            delete this.tableRefs.rows[`${id}_${rowType}`]
            // console.log('deleted', id, rowType)
        }
    }
    getRowRef(id, rowType) {
        return this.tableRefs.rows[`${id}_${rowType}`]
    }

    setColumnsCss(header) {
        const {columnsCss} = this.tableContext
        const {children: hdChildren} = header.props
        // case if Header have rows as children
        const rows = this.filterComponentsByType(hdChildren, Row)
        let columns = []
        if (rows.length > 0) {
        //    get last Row as source of header format info
            const lastRowChildren = rows[rows.length - 1].props.children
            columns = this.filterComponentsByType(lastRowChildren, Column)
        } else {
        //  if direct children of Header are Column's instances
            columns = this.filterComponentsByType(hdChildren, Column)
        }

        if (columns.length === 0) {
            console.log("Header doesn't have any Column's components as children" )
            return []
        }

        const columnCssPrefix = DEFAULT_CSS_CLASS_NAMES.column
        const columnSizeCssPrefix = DEFAULT_CSS_CLASS_NAMES.columnSz
        const columnDecoCssPrefix = DEFAULT_CSS_CLASS_NAMES.columnDc

        columns.forEach((column, index) => {
            const params = {
                    columnClass: columnCssPrefix + index,
                    columnSizeClass: columnSizeCssPrefix + index,
                    columnDecoClass: columnDecoCssPrefix + index
            }
            this.jssSheet.addRules({
                [params.columnClass] : {},
                [params.columnSizeClass] : {width: null},
                [params.columnDecoClass] : {},
            })
            columnsCss[index] = params
        })
    }

    scrollbarSizeLoad = (scrollSizes) => {
        this.scroll.width = scrollSizes.scrollbarWidth
        this.scroll.height = scrollSizes.scrollbarHeight
    }

    // scrollToRow(rowId, alignment, offset = 0) {
    //     const row = this.tableRefs.rows[rowId]
    //     if (!row) return
    //     const body = this.tableRefs.bodyContainer
    //     const bodyXY = body.current.getBoundingClientRect()
    //     const rowXY = row.current.getBoundingClientRect()
    //     // body.current.scrollTop = rowXY.y - bodyXY.y - offset
    //     body.current.scrollBy(0, rowXY.y - bodyXY.y - offset)
    // }
    scrollToRow(rowId, rowType, alignment, offset = 0) {
        const rowRef = this.getRowRef(rowId, rowType)
        const bodyRef = this.tableRefs.bodyContainer
        if (!rowRef || !bodyRef) return
        this.scrollAt(bodyRef, rowRef, alignment, offset)
    }

    /**
     *
     * @param {Object} container - box that will be scrolled (ref)
     * @param {Object} element - element that will be positioned relative top or bottom of box(ref)
     * @param {('top'|'bottom')} position - where's measured offset from
     * @param {number} [offset] - offset from 'position' in px
     */
    scrollAt(container, element, position, offset = 0) {
        if (!(position && (position === 'top' || position === 'bottom') && container && container.current && element && element.current)) return
        let yScroll = 0
        const el = element.current.getBoundingClientRect()
        const box = container.current.getBoundingClientRect()
        switch (position.toLowerCase()) {
            case 'top':
                yScroll = el.top - box.top - offset
                break
            case 'bottom':
                yScroll = el.bottom - box.bottom + offset
                break
            default:

        }
        if (yScroll === 0) return
        container.current.scrollBy(0, yScroll)
    }

    tableContext = {
        theme: theme,
        states: {},
        shareState: (state,name) => {this.tableContext.states[name] = state},
        getState: (name) => this.tableContext.states[name],
        updateData: this.updateData,
        formBodyData: this.props.formBodyData ? this.props.formBodyData : this.formBodyData,
        cssStyles: this.tableStyles,
        dimensions: {
            containerWidth: 0,
            columnsSizes: [],
            columnsWidth: 0, // sum of current columns width
        },
        columnsCss: [],
        columnsParams: [],
        jssSheet: this.jssSheet,
        filterComponentsByType: this.filterComponentsByType,
        joinCss: Table.joinCss,
        createRowRef: this.createRowRef,
        deleteRowRef: this.deleteRowRef,
        tableRefs: this.tableRefs,
        scrollPosition: this.props.scrollPosition,
        scrollToRow: this.scrollToRow
    }


    render() {
        // const store = window.store.getState()
        const {classes: css} = this.jssSheet
        const {children} = this.props
        this.setColumnsCss(this.filterComponentsByType(children, Header)[0])
        return (
            <TableProvider value={this.tableContext}>
                <ScrollbarSize
                    onLoad={this.scrollbarSizeLoad}
                />
                <div className={[css.container, css.containerSz].join(" ")} ref={this.tableRefs.container}>
                    <div className={[css.tableContainer, css.tableContainerDc].join(" ")}>
                        <div className={[css.tableHeaderBodyContainer].join(" ")}>
                            <div className={[css.tableHeaderContainer]}>
                                {this.filterComponentsByType(children, Header)}
                            </div>
                            <div className={[css.tableBodyContainer, css.tableBodyContainerSz, css.tableBodyContainerDc].join(" ")} ref={this.tableRefs.bodyContainer}>
                                {this.filterComponentsByType(children, Body, {data: this.state.tableBodyData, scrollPosition: this.props.scrollPosition})}
                            </div>
                        </div>
                        <div className={[css.tableFooterContainer, css.tableFooterContainerSz].join(" ")}>
                            {this.filterComponentsByType(children, TableFooter, {data: this.state.tableFooterData})}
                        </div>
                    </div>
                        {this.filterComponentsByType(children, Footer)}
                </div>
            </TableProvider>
        );
    }

    async componentDidMount() {
        this.jssSheet.attach()
        window.addEventListener('resize', this.updateColumns)

        this.updateColumns()
        await this.updateData()
        // this.scrollToRow(this.props.scrollPosition)
        // this.scrollAt(bodyContainer, targetRow, 'bottom', 0)

        window.tabRefs = this.tableRefs
    }

    //should be called only when pass data via props and this data change
    async componentDidUpdate(prevProps) {
        const {data: prevData, scrollPosition: prevScrollPosition} = prevProps
        const {data, scrollPosition} = this.props
        if (prevData !== data) {
             await this.updateData()
        }
        // this.scrollToRow(this.props.scrollPosition)
        // console.log('table didupdate', this.getRowRef(scrollPosition.id, scrollPosition.rec_type),prevScrollPosition !== scrollPosition ? 'true' : 'false')
        const targetRow = this.getRowRef(scrollPosition.id, scrollPosition.rec_type)
        if (scrollPosition && scrollPosition.id && targetRow) {
            const bodyContainer = this.tableRefs.bodyContainer
            // console.log('scroll to ', targetRow)
            this.scrollAt(bodyContainer, targetRow, 'top', 60)
        }
        // if (prevScrollPosition !== scrollPosition) {
        //     const targetRow = this.getRowRef(scrollPosition.id, scrollPosition.rec_type)
        //     if (scrollPosition && scrollPosition.id && targetRow) {
        //         const bodyContainer = this.tableRefs.bodyContainer
        //         // console.log('scroll to ', targetRow)
        //         this.scrollAt(bodyContainer, targetRow, 'top', 60)
        //     }
        // }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateColumns)
    }
}

Table.Caption = (props) => {
    return <caption>{props.children}</caption>
}


Table.propTypes = {
    fetchData: PropTypes.func, //function that will be fetch data from remote source. Has to be async and return Promise
    formBodyData: PropTypes.func, //function that will be used to form Body content from fetched data
    bodyDataKey: PropTypes.string, // name of key for body data in object that return fetchData function
    footerDataKey: PropTypes.string, // name of key for footer data in object that return fetchData function

    width: PropTypes.string, //width of table's container
    height: PropTypes.string, //height of table's container
    miWidth: PropTypes.string, //min width of table container
    minHeight: PropTypes.string, //min height of table container

    bordered: PropTypes.bool,
    bodyStriped: PropTypes.bool,

    isStretch: PropTypes.bool, //allow stretch table

    scrollPosition: PropTypes.shape({
        id: PropTypes.number,
        ip: PropTypes.string,
        rec_type: PropTypes.string,
        ip_path: PropTypes.string
    })
};
Table.defaultProps = {
    fetchData: DEFAULT_VALUES.fetchData.method,
    bodyDataKey: DEFAULT_VALUES.fetchData.bodyDataKey,
    footerDataKey: DEFAULT_VALUES.fetchData.footerDataKey,

    width: DEFAULT_TABLE_STYLE.tableWidth,
    minWidth: DEFAULT_TABLE_STYLE.tableMinWidth,
    height: DEFAULT_TABLE_STYLE.tableHeight,
    minHeight: DEFAULT_TABLE_STYLE.tableMinHeight,

    bordered: true,
    bodyStriped: true,

    isStretch: true
};


export {Header, Body, TableFooter, Footer, Row, Column, Pagination, Pagination2, Pagination3}
export default Table;
