import React, {PureComponent} from 'react';
import RowsContainer from '../RowsContainer'
import PropTypes from 'prop-types';

class ChildrenRowsContainer extends PureComponent {
    render() {
        const {netsIds, hostsIds, lvl} = this.props
        return (
           <RowsContainer netsIds={netsIds} hostsIds={hostsIds} lvl={lvl} />
        );
    }
}

ChildrenRowsContainer.propTypes = {
    netsIds: PropTypes.array,
    hostsIds: PropTypes.array,
    lvl: PropTypes.number,
};

export default ChildrenRowsContainer;

