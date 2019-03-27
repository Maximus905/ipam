import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {tableConnect} from '../TableContext'
import injectSheet from 'react-jss'
import styles from './styles'

class Pagination2 extends PureComponent {
    state = {
        // currentItemIdx: 1,
        itemNumberInput: '1',
        lastItemIdx: 0,
    }
    currentItemIdx = 0

    resetState = ((prevItemList) => (currentItemList) => {
        if (prevItemList === currentItemList) return
        //TODO restore state of tree
        if (currentItemList.length && currentItemList.length > 0) {
            prevItemList = currentItemList
            this.setState({
                itemNumberInput: '1',
                lastItemIdx: currentItemList.length - 1,
            })
            this.currentItemIdx  = 0

        } else {
            prevItemList = currentItemList
            this.setState({
                itemNumberInput: '0',
                lastItemIdx: -1,
            })
            this.currentItemIdx  = 0
        }
    })([])

    updateCurrentItemInput = ((prevIdx) => () => {
        const {filterCursor} = this.props
        if (filterCursor === undefined) return
        if (filterCursor === prevIdx)  return
        prevIdx = filterCursor
        if (this.currentItemIdx !== filterCursor) this.currentItemIdx = filterCursor
        if (this.state.itemNumberInput !== '' + (filterCursor + 1)) this.setState({itemNumberInput: '' + (filterCursor + 1)})
    })(null)

    currentNumberBlock = (classes) => {
        return (
            <div className={[classes.pageNumber, classes.pageNumber].join(" ")}>
                <input type="text" onChange={this.onChangePageNumberBlock} onKeyUp={this.onKeyUpPageNumberBlock} value={this.state.itemNumberInput}/><span>of {this.state.lastItemIdx + 1}</span>
            </div>
        )
    }

    onChangePageNumberBlock = (e) => {
        const {value} = e.target
        this.setState((prevState) => {
            return {itemNumberInput: ((value === "" || parseInt(value) > 0) && (parseInt(value) <= prevState.lastItemIdx + 1)) ? value : prevState.itemNumberInput}
        })
    }
    onKeyUpPageNumberBlock = (e) => {
        if (e.keyCode === 13) {
            const {setFilterCursor} = this.props
            const newState = {itemNumberInput: this.state.itemNumberInput === "" ? "1" : this.state.itemNumberInput}
            this.currentItemIdx = this.state.itemNumberInput === "" ? 0 : parseInt(this.state.itemNumberInput) - 1
            this.setState(newState)
            setFilterCursor(this.currentItemIdx)
        }
    }

    onClickNextPage = () => {
        const {setFilterCursor} = this.props
        this.currentItemIdx = this.currentItemIdx === this.state.lastItemIdx ? this.currentItemIdx : this.currentItemIdx + 1
        setFilterCursor(this.currentItemIdx)
    }
    onClickPrevPage = () => {
        const {setFilterCursor} = this.props
        this.currentItemIdx = this.currentItemIdx === 0 ? this.currentItemIdx : this.currentItemIdx - 1
        setFilterCursor(this.currentItemIdx)
    }

    onClickFirstPage = () => {
        const {setFilterCursor} = this.props
        this.currentItemIdx = 0
        setFilterCursor(this.currentItemIdx)
    }
    onClickLastPage = () => {
        const {setFilterCursor} = this.props
        this.currentItemIdx = this.state.lastItemIdx
        setFilterCursor(this.currentItemIdx)
    }

    render() {
        if (this.state.lastItemIdx < 0) return null
        const {classes} = this.props
        const {lastItemIdx} = this.state
        return (
            <div className={[classes.container, classes.containerDc].join(" ")}>
                <button className={classes.navButton} disabled={this.currentItemIdx === 0} onClick={this.onClickFirstPage}>
                    <FontAwesomeIcon icon="fast-backward" className={this.currentItemIdx === 0 ? classes.disabled : '' } />
                </button>
                <button className={classes.navButton} disabled={this.currentItemIdx === 0} onClick={this.onClickPrevPage}>
                    <FontAwesomeIcon icon="backward" className={this.currentItemIdx === 0 ? classes.disabled : '' } />
                </button>
                {this.currentNumberBlock(classes)}
                <button className={classes.navButton} disabled={this.currentItemIdx === lastItemIdx} onClick={this.onClickNextPage}>
                    <FontAwesomeIcon icon="forward" className={this.currentItemIdx === lastItemIdx ? classes.disabled : '' } />
                </button>
                <button className={classes.navButton} disabled={this.currentItemIdx === lastItemIdx} onClick={this.onClickLastPage}>
                    <FontAwesomeIcon icon="fast-forward" className={this.currentItemIdx === lastItemIdx ? classes.disabled : '' } />
                </button>
            </div>
        );
    }

    componentDidMount() {
        const {filterItemList = []} = this.props
        this.resetState(filterItemList)
        this.updateCurrentItemInput()
        if (this.state.lastItemIdx >= 0) this.props.onChange(this.currentItemIdx)
    }
    componentDidUpdate() {
        const {filterItemList = []} = this.props
        this.resetState(filterItemList)
        this.updateCurrentItemInput()
        if (this.state.lastItemIdx >= 0) this.props.onChange(this.currentItemIdx)
    }
}

Pagination2.propTypes = {
    filterItemList: PropTypes.array,
    filterCursor: PropTypes.number,
    setFilterCursor: PropTypes.func,
    onChange: PropTypes.func,

    filterResults: PropTypes.shape({
        itemList: PropTypes.array,
        hostStateBackups: PropTypes.object,
        netStateBackups: PropTypes.object,
        cursor: PropTypes.number
    }),
    lastItemIdx: PropTypes.number,
};
Pagination2.defaultProps = {
    lastItemIdx: -1,
    onChange: (current) => {console.log('current - ', current)}
};

export default tableConnect(injectSheet(styles)(Pagination2));
