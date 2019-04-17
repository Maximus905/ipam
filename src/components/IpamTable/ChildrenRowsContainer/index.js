import React, {PureComponent} from 'react';
import RowsContainer from '../RowsContainer'
import PropTypes from 'prop-types';

class ChildrenRowsContainer extends PureComponent {
    render() {
        const {parentNetId, netsIds, hostsIds, lvl} = this.props
        return (
           <RowsContainer netsIds={netsIds} hostsIds={hostsIds} lvl={lvl} parentNetId={parentNetId} />
        );
    }
}

ChildrenRowsContainer.propTypes = {
    parentNetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    netsIds: PropTypes.array,
    hostsIds: PropTypes.array,
    lvl: PropTypes.number,
};

export default ChildrenRowsContainer;

