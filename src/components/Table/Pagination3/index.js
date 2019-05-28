import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import check from 'check-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {tableConnect} from '../TableContext'
import injectSheet from 'react-jss'
import styles from './styles'

class Pagination3 extends PureComponent {
    state = {
        itemNumberInput: '',
        isVisible: false,
        current: 0, // index of current item in filteredItemsList. Start from 0!
        itemsList: {}
    }

    updateState = ((prevItemList) => (newItemList) => {
        if (prevItemList === newItemList && check.array(newItemList) && newItemList.length > 0) {
            this.props.onChange(this.state.current)
            return
        }
        if (prevItemList === newItemList && !this.state.isVisible) {
            this.props.onHideFilter()
            return
        }
        if (check.array(newItemList) && newItemList.length > 0) {
            prevItemList = newItemList
            const newState = {
                itemNumberInput: '1',
                isVisible: true,
                current: 0,
                itemsList: newItemList
            }
            this.setState(newState)
            this.props.onNewItemsList()
        } else {
            prevItemList = newItemList
            this.setState({
                itemNumberInput: '0',
                isVisible: false,
                current: 0,
                itemsList: newItemList
            })
        }
    })()

    currentNumberBlock = (classes) => {
        const listLength = this.props.filteredItemsList.length
        return (
            <div className={[classes.pageNumber, classes.pageNumber].join(" ")}>
                <input type="text" onChange={this.onChangePageNumberBlock} onKeyUp={this.onKeyUpPageNumberBlock} value={this.state.itemNumberInput}/><span>of {listLength}</span>
            </div>
        )
    }

    /**
     * only change text in input field of current page number, but doesn't change value of 'current' in state!
     * @param e
     */
    onChangePageNumberBlock = (e) => {
        const {value} = e.target
        const inputListLength = check.array(this.props.filteredItemsList) ?  this.props.filteredItemsList.length : 0
        this.setState((prevState) => {
            return {itemNumberInput: (value === "" || (parseInt(value) > 0 && parseInt(value) <= inputListLength)) ? value : prevState.itemNumberInput}
        })
    }
    /**
     * change text in input field and value of 'current' in state
     * @param e
     */
    onKeyUpPageNumberBlock = (e) => {
        if (e.keyCode === 13) {
            this.setState((prevState) => {
                const itemNumberInput = prevState.itemNumberInput === "" ? "1" : prevState.itemNumberInput
                return {itemNumberInput, current: parseInt(itemNumberInput) - 1}
            })
        }
    }

    onClickNextPage = () => {
        const {setFilterCursor} = this.props
        const {current} = this.state
        const listLength = this.props.filteredItemsList.length
        if (current < listLength) {
            const newCurrent = current + 1
            this.setState({
                itemNumberInput: (newCurrent + 1).toString(),
                current: newCurrent
            })
        }
    }
    onClickPrevPage = () => {
        const {setFilterCursor} = this.props
        const {current} = this.state
        if (current > 0) {
            const newCurrent = current - 1
            this.setState({
                itemNumberInput: (newCurrent + 1).toString(),
                current: newCurrent
            })
        }

    }

    onClickFirstPage = () => {
        const {setFilterCursor} = this.props
        const newCurrent = 0
        this.setState({
            itemNumberInput: (newCurrent + 1).toString(),
            current: newCurrent
        })
    }
    onClickLastPage = () => {
        const {setFilterCursor} = this.props
        const newCurrent = this.props.filteredItemsList.length - 1
        this.setState({
            itemNumberInput: (newCurrent + 1).toString(),
            current: newCurrent
        })
    }

    render() {
        const {classes, filteredItemsList} = this.props
        const listLength = check.array(filteredItemsList) ?  filteredItemsList.length : 0
        const {current} = this.state
        if (listLength === 0) return null
        return (
            <div className={[classes.container, classes.containerDc].join(" ")}>
                <button className={classes.navButton} disabled={current === 0} onClick={this.onClickFirstPage}>
                    <FontAwesomeIcon icon="fast-backward" className={current === 0 ? classes.disabled : '' } />
                </button>
                <button className={classes.navButton} disabled={current === 0} onClick={this.onClickPrevPage}>
                    <FontAwesomeIcon icon="backward" className={current === 0 ? classes.disabled : '' } />
                </button>
                {this.currentNumberBlock(classes)}
                <button className={classes.navButton} disabled={current === listLength - 1} onClick={this.onClickNextPage}>
                    <FontAwesomeIcon icon="forward" className={(current === listLength - 1) ? classes.disabled : '' } />
                </button>
                <button className={classes.navButton} disabled={current === listLength - 1} onClick={this.onClickLastPage}>
                    <FontAwesomeIcon icon="fast-forward" className={(current === listLength - 1) ? classes.disabled : '' } />
                </button>
            </div>
        );
    }

    componentDidMount() {
        const {filteredItemsList} = this.props
        this.updateState(filteredItemsList)
    }
    componentDidUpdate() {
        const {filteredItemsList} = this.props
        this.updateState(filteredItemsList)
        console.log(this.props.filterCursor)
    }
}

Pagination3.propTypes = {
    filteredItemsList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            ip: PropTypes.string,
            rec_type: PropTypes.string,
            ip_path: PropTypes.string
        })
    ),
    setFilterCursor: PropTypes.func,
    filterCursor: PropTypes.number,
    onChange: PropTypes.func,
    onHideFilter: PropTypes.func,
    onNewItemsList: PropTypes.func
};
Pagination3.defaultProps = {
    /**
     * is invoked for non empty filteredItemsList
     * @param current
     */
    onChange: (current) => console.log('ON CHANGE FILTER: current - ', current),
    /**
     * is invoked if filteredItemsList got empty and paginator will be hide
     */
    onHideFilter: () => console.log('ON HIDE FILTER: default function'),
    /**
     * is invoked when pass new filteredItemsList (new search result)
     */
    onNewItemsList: () => console.log('ON NEW ITEMS LIST')
};

export default tableConnect(injectSheet(styles)(Pagination3));
