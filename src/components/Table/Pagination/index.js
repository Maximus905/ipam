import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select'
import customStyles from './selectReactCustomStyle'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {tableConnect} from '../TableContext'
import injectSheet from 'react-jss'
import * as PAGINATION from './paginationConstants'
import theme from '../Theme'

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: PAGINATION.STYLE.paginationWidth,
        '& .rowsOnPage': {
            width: PAGINATION.STYLE.selectBlockWidth
        }
    },
    containerDc: {
        padding: 5,
        fontSize: 'smaller',
        backgroundColor: 'inherit',
    },
    pageNumber: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: PAGINATION.STYLE.pageBlockWidth,
        '& input': {
            width: PAGINATION.STYLE.pageBlockInputWidth,
        }
    },
    pageNumberDc: {
        '& input': {
            padding: 2,
            margin: 0,
            border: PAGINATION.STYLE.border,
            borderRadius: 3
        }
    },
    disabled: {
        color: [[theme.disabledColor], '!important']
    },
    navButton: {
        padding: [1, 3],
        color: theme.footerIconColor
    },
}

class Pagination extends PureComponent {

    defaultValueRecordsOnPage = () => {
        const {selectDefaultValueIndex} = this.props
        const index = (selectDefaultValueIndex > 0 && selectDefaultValueIndex <= PAGINATION.SELECT_OPTIONS.length) ? selectDefaultValueIndex : PAGINATION.DEFAULT_VALUE_INDEX
        return PAGINATION.SELECT_OPTIONS[index]
    }

    state = {
        selectOptions: this.props.selectOptions,
        currentPage: 1,
        pageNumberInput: '1',
        totalPages: 99,
        rowsOnPage: this.defaultValueRecordsOnPage().value,
    }

    pageNumberBlock = (classes) => {
        return (
            <div className={[classes.pageNumber, classes.pageNumber].join(" ")}>
                Page<input type="text" onChange={this.onChangePageNumberBlock} onKeyUp={this.onKeyUpPageNumberBlock} value={this.state.pageNumberInput}/><span>of {this.state.totalPages}</span>
            </div>
        )
    }

    onChangePageNumberBlock = (e) => {
        const {value} = e.target
        this.setState((prevState) => {
            return {pageNumberInput: ((value === "" || parseInt(value) > 0) && (parseInt(value) <= prevState.totalPages)) ? value : prevState.pageNumberInput}
        })
    }
    onKeyUpPageNumberBlock = (e) => {
        if (e.keyCode === 13) {
            this.setState({
                pageNumberInput: this.state.pageNumberInput === "" ? "1" : this.state.pageNumberInput,
                currentPage: this.state.pageNumberInput === "" ? 1 : parseInt(this.state.pageNumberInput)
            })
        }
    }

    onChangeSelect = (opt) => {
        this.setState({rowsOnPage: opt.value})
    }
    onClickNextPage = () => {this.setState(prevState => {
        const newPage = prevState.currentPage === prevState.totalPages ? prevState.currentPage : prevState.currentPage + 1
        return {currentPage: newPage, pageNumberInput: String(newPage)}
    })}
    onClickPrevPage = () => {this.setState(prevState => {
        const newPage = prevState.currentPage === 1 ? prevState.currentPage : prevState.currentPage - 1
        return {currentPage: newPage, pageNumberInput: String(newPage)}
    })}
    onClickFirstPage = () => {this.setState(prevState => {
        const newPage = 1
        return {currentPage: newPage, pageNumberInput: String(newPage)}
    })}
    onClickLastPage = () => {this.setState(prevState => {
        const newPage = prevState.totalPages
        return {currentPage: newPage, pageNumberInput: String(newPage)}
    })}

    render() {
        const {classes} = this.props
        const selectProps = {
            styles: customStyles,
            options: this.state.selectOptions,
            defaultValue: this.defaultValueRecordsOnPage(),
            menuPlacement: 'auto'
        }
        const {currentPage, totalPages} = this.state
        return (
            <div className={[classes.container, classes.containerDc].join(" ")}>
                <button className={classes.navButton} disabled={currentPage === 1} onClick={this.onClickFirstPage}>
                    <FontAwesomeIcon icon="fast-backward" className={currentPage === 1 ? classes.disabled : '' } />
                </button>
                <button className={classes.navButton} disabled={currentPage === 1} onClick={this.onClickPrevPage}>
                    <FontAwesomeIcon icon="backward" className={currentPage === 1 ? classes.disabled : '' } />
                </button>
                {this.pageNumberBlock(classes)}
                <div className="rowsOnPage"><Select {...selectProps} onChange={this.onChangeSelect} /></div>
                <button className={classes.navButton} disabled={currentPage === totalPages} onClick={this.onClickNextPage}>
                    <FontAwesomeIcon icon="forward" className={currentPage === totalPages ? classes.disabled : '' } />
                </button>
                <button className={classes.navButton} disabled={currentPage === totalPages} onClick={this.onClickLastPage}>
                    <FontAwesomeIcon icon="fast-forward" className={currentPage === totalPages ? classes.disabled : '' } />
                </button>
            </div>


        );
    }

    componentDidMount() {
        this.props.tableContext.shareState({currentPage: this.state.currentPage, rowsOnPage: this.state.rowsOnPage}, "pagination")
    }
    componentDidUpdate() {
        this.props.tableContext.shareState({currentPage: this.state.currentPage, rowsOnPage: this.state.rowsOnPage}, "pagination")
        this.props.tableContext.updateData()
    }
}

Pagination.propTypes = {
    selectWidth: PropTypes.number, //react-select width in px
    selectDefaultValueIndex: PropTypes.number,
    selectOptions: PropTypes.array,
};
Pagination.defaultProps = {
    selectWidth: 70,
    selectDefaultValueIndex: PAGINATION.DEFAULT_VALUE_INDEX,
    selectOptions: PAGINATION.SELECT_OPTIONS,
};

export default tableConnect(injectSheet(styles)(Pagination));
