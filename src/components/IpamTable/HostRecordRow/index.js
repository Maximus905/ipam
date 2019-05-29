import React, {PureComponent} from 'react';
import injectSheet from 'react-jss'
import PropTypes from 'prop-types';
import dateFormat from 'dateformat'
import {MAX_DEV_AGE, LAST_UPDATE_SHIFT_HOURS} from '../../../constants/IpamTable'

import {Row, Column} from '../../Table'
import style, {LVL_INDENT_WIDTH} from './styles'

class HostRecordRow extends PureComponent {

    lvlIndent = () => {
        const {lvl, classes} = this.props
        return (<div className={classes.lvlBlock} style={{width: LVL_INDENT_WIDTH * lvl}} />)
    }

    convertLastUpdate = () => {
        const {lastUpdate, lastUpdateMs} = this.props
        if (lastUpdate) {
            const date = new Date(parseInt(lastUpdateMs))
            date.setHours(date.getHours() - LAST_UPDATE_SHIFT_HOURS)
            return 'Last update: ' + dateFormat(date, "d.mm.yyyy H:MM")
        }
        return ""
    }

    render() {
        // const {id, ipAddress, macAddress, comment, isFetching, isExpanded, isSelected, rowId} = this.props
        const {id, ip, masklen, mask, ipCidr, location, portComment, portDescr, portName, devName, devType, hostname, age, vrfName, dns, isFetching, isSelected, rowId, classes} = this.props
        const rowProps = {id, rowId, isSelected, rowType: 'host'}
        if (isFetching) {
            return (
                <Row {...rowProps}>
                    <Column>{this.lvlIndent()}...loading</Column>
                    <Column>...loading</Column>
                    <Column>...loading</Column>
                    <Column>...loading</Column>
                    <Column>...loading</Column>
                    <Column>...loading</Column>
                    <Column>...loading</Column>
                    <Column>...loading</Column>
                    <Column>...loading</Column>
                    <Column>...loading</Column>
                    <Column>...loading</Column>
                    <Column>...loading</Column>
                </Row>
            );
        } else {
            return (
                <Row {...rowProps}>
                    <Column>{this.lvlIndent()}{ipCidr}</Column>
                    {/*<Column>{this.lvlIndent()}{ipCidr} - {id}</Column>*/}
                    <Column></Column>
                    <Column>{mask}</Column>
                    <Column>{location}</Column>
                    <Column>{portDescr}</Column>
                    <Column>{portName}</Column>
                    <Column cssClasses={age > MAX_DEV_AGE ? classes.bgOldDevice : ''} hint={this.convertLastUpdate()}>{devName}</Column>
                    <Column>{vrfName}</Column>
                    <Column></Column>
                    <Column>{devType}</Column>
                    <Column>{hostname}</Column>
                    <Column>{dns}</Column>
                </Row>
            );
        }
    }
}

HostRecordRow.propTypes = {
    lvl: PropTypes.number,
    id: PropTypes.number,
    isFetching: PropTypes.bool,
    isExpanded: PropTypes.bool,
    isSelected: PropTypes.bool,
    ipAddress: PropTypes.string,
    macAddress: PropTypes.string,
    comment: PropTypes.string,
    rowId: PropTypes.any, //for creation of rowId
    //from injectSheet
    classes: PropTypes.object,
};
HostRecordRow.defaultProps = {
    lvl: 0,
    isExpanded: false,
};

export default injectSheet(style)(HostRecordRow)

