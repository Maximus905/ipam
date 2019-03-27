import React, {PureComponent} from 'react';
import injectSheet from 'react-jss'
import PropTypes from 'prop-types';

import {Row, Column} from '../../Table'
import style, {LVL_INDENT_WIDTH} from './styles'

class HostRecordRow extends PureComponent {

    lvlIndent = () => {
        const {lvl, classes} = this.props
        return (<div className={classes.lvlBlock} style={{width: LVL_INDENT_WIDTH * lvl}} />)
    }

    render() {
        // const {id, ipAddress, macAddress, comment, isFetching, isExpanded, isSelected, rowId} = this.props
        const {ipAddress, isFetching, isSelected, rowId} = this.props

        if (isFetching) {
            return (
                <Row rowId={rowId} isSelected={isSelected}>
                    <Column>{this.lvlIndent()}...loading</Column>
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
                <Row rowId={rowId} isSelected={isSelected}>
                    {/*<Column>{this.lvlIndent()}{ipAddress} - {id}</Column>*/}
                    <Column>{this.lvlIndent()}{ipAddress}</Column>
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

