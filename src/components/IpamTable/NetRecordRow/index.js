import React, {PureComponent} from 'react';
import injectSheet from 'react-jss'
import PropTypes from 'prop-types';
import check from 'check-types'

import {Row, Column} from '../../Table'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import style, {LVL_INDENT_WIDTH} from './styles'
import './style.css'

class NetRecordRow extends PureComponent {

    lvlIndent = () => {
        const {lvl, classes} = this.props
        return (<div className={classes.lvlBlock} style={{width: LVL_INDENT_WIDTH * lvl}} />)
    }

    render() {
        let {id, classes, ip, netmask, comment, vrfName, bgpAs, netLocations, netChildren, hostChildren, isFetching, isExpanded, isSelected, toggleIconHandler, rowId} = this.props
        const rowProps = {id, rowId, isSelected, rowType: 'network'}
        if (isFetching) {
            return (
                <Row {...rowProps}>
                    <Column>{this.lvlIndent()}...loading</Column>
                    <Column></Column>
                    <Column></Column>
                    <Column></Column>
                    <Column></Column>
                    <Column></Column>
                    <Column></Column>
                    <Column></Column>
                    <Column></Column>
                    <Column></Column>
                    <Column></Column>
                    <Column></Column>
                </Row>
            );
        } else {
            let locations = []
            netLocations = check.object(netLocations) ? netLocations : {}
            for (let location of Object.values(netLocations)) {
                locations.push(location)
            }
            const icon = isExpanded ?
                <FontAwesomeIcon icon={"minus"} className={classes.icon} onClick={toggleIconHandler(id)}/> :
                <FontAwesomeIcon icon={"plus"}  className={classes.icon} onClick={toggleIconHandler(id)}/>
            return (
                <Row {...rowProps}>
                    <Column>{this.lvlIndent()}{icon}{ip}</Column>
                    {/*<Column>{this.lvlIndent()}{icon}{ip} - {rowId}</Column>*/}
                    <Column>{netChildren.length}/{hostChildren.length}</Column>
                    <Column>{netmask}</Column>
                    <Column>{locations.join("; ")}</Column>
                    <Column>{comment}</Column>
                    <Column></Column>
                    <Column></Column>
                    <Column>{vrfName}</Column>
                    <Column>{bgpAs}</Column>
                    <Column></Column>
                    <Column></Column>
                    <Column></Column>
                </Row>
            );
        }

    }
}

NetRecordRow.propTypes = {
    lvl: PropTypes.number,
    id: PropTypes.number,
    isExpanded: PropTypes.bool,
    isSelected: PropTypes.bool,
    isFetching: PropTypes.bool,
    ipAddress: PropTypes.string,
    comment: PropTypes.string,
    netChildren: PropTypes.array,
    hostChildren: PropTypes.array,
    netLocations: PropTypes.object,
    toggleIconHandler: PropTypes.func,
    rowId: PropTypes.any, //for creation of rowId
    //from injectSheet
    classes: PropTypes.object,
};
NetRecordRow.defaultProps = {
    lvl: 0,
    isExpanded: false,
    netChildren: [],
    hostChildren: [],
};

export default injectSheet(style)(NetRecordRow)

