import React, {PureComponent} from 'react';
import {connectAdvanced} from 'react-redux'
import PropTypes from 'prop-types';

import {fetchElementsIfNeeded, netItemToggleExpandCollapse} from '../../../actions'
import NetRecordRow from "../NetRecordRow";
import HostRecordRow from "../HostRecordRow";
import ChildrenRowsContainer from "../ChildrenRowsContainer";

class RowsContainer extends PureComponent {

    childrenNetsIds = []
    childrenHostsIds = []

    render() {
        const {netsData, hostsData, toggleIconHandler, lvl} = this.props
        const netRows = netsData.map(data => {
            if (data.isExpanded) {
                this.childrenNetsIds = this.childrenNetsIds.concat(data.netChildren)
                this.childrenHostsIds = this.childrenHostsIds.concat(data.hostChildren)
                return (
                    <React.Fragment key={'h' + data.id}>
                        <NetRecordRow {...data} lvl={lvl} toggleIconHandler={toggleIconHandler} rowId={'net-' + data.id}/>
                        <ChildrenRowsContainer netsIds={data.netChildren} hostsIds={data.hostChildren} lvl={lvl + 1} />
                    </React.Fragment>

                )
            } else {
                return (
                    <React.Fragment key={'h' + data.id}>
                        <NetRecordRow {...data} lvl={lvl} toggleIconHandler={toggleIconHandler} rowId={'net-' + data.id} />
                    </React.Fragment>
                )
            }})
        const hostRows = hostsData.map(data => {
            return (
                <HostRecordRow {...data} lvl={lvl} key={'n' + data.id} rowId={'host-' + data.id} />
            )})
        return (

            <React.Fragment>
                {netRows}
                {hostRows}
            </React.Fragment>
        );
    }

    componentDidMount() {
        const {updateDataIfNeeded} = this.props
        updateDataIfNeeded({netsIds: this.childrenNetsIds, hostsIds: this.childrenHostsIds})
    }
    componentDidUpdate() {
        const {updateDataIfNeeded} = this.props
        updateDataIfNeeded({netsIds: this.childrenNetsIds, hostsIds: this.childrenHostsIds})
    }
}

const selectorFactory = (dispatch) => {

    const updateDataIfNeeded = ({netsIds, hostsIds}) => {
        dispatch(fetchElementsIfNeeded({netsIds, hostsIds}))
    }
    const toggleIconHandler = (id) => () => {
        dispatch(netItemToggleExpandCollapse(id))
    }

    return (state, ownProps) => {
        const {netsIds, hostsIds, lvl} = ownProps
        const netsData = []
        const hostsData = []
        for (let id of netsIds) {
            const itemData = state.netData.networks[id]
            if (itemData) netsData.push(Object.assign({}, {...itemData}, {id}))
        }
        for (let id of hostsIds) {
            const itemData = state.netData.hosts[id]
            if (itemData) hostsData.push(Object.assign({}, {...itemData}, {id}))
        }

        return {netsData, hostsData, lvl, updateDataIfNeeded, toggleIconHandler}
    }
}

RowsContainer.propTypes = {
    netsIds: PropTypes.array,
    hostsIds: PropTypes.array,
    lvl: PropTypes.number,
};

RowsContainer.defaultProps = {
    netsIds: [],
    hostsIds: []
}

export default connectAdvanced(selectorFactory)(RowsContainer)