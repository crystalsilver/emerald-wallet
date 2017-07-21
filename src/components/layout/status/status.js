import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import NetworkSelector from './networkSelector';

const Render = ({ block, progress, peerCount, showDetails, connecting }) => {
    const styles = {
        details: {
            color: '#47B04B',
            fontSize: '14px',
            lineHeight: '16px',
        },
        block: {
            display: 'flex',
            alignItems: 'center',
        },
    };

    let details = null;
    if (connecting) {
        details =
            <div style={styles.details}>
                <i className="fa fa-spin fa-spinner"/> Connecting...
            </div>;
    } else if (showDetails) {
        details =
            <div style={styles.details}>
                {peerCount} {peerCount === 1 ? 'peer' : 'peers'}, {block} blocks
            </div>;
    } else {
        details =
            <div style={styles.details}>
                {block} blocks
            </div>;
    }

    return (
        <div>
            <div style={styles.block}>
                {details}
                <div>
                    <NetworkSelector />
                </div>
            </div>
            {showDetails && <div><LinearProgress mode="determinate" color="green" value={progress} /></div>}
        </div>
    );
};

Render.propTypes = {
    block: PropTypes.number.isRequired,
    progress: PropTypes.number,
    peerCount: PropTypes.number,
    showDetails: PropTypes.bool.isRequired,
    connecting: PropTypes.bool.isRequired,
};

const Status = connect(
    (state, ownProps) => {
        const curBlock = state.network.getIn(['currentBlock', 'height'], -1);
        const showDetails = state.launcher.getIn(['chain', 'rpc']) === 'local';
        const props = {
            block: curBlock,
            showDetails,
            connecting: state.launcher.get('connecting'),
        };
        if (showDetails) {
            const tip = state.network.getIn(['sync', 'highestBlock'], -1);
            const peerCount = state.network.get('peerCount');
            const progress = (curBlock / tip) * 100;
            return {
                progress: isNaN(progress) ? 100 : progress,
                peerCount,
                ...props,
            };
        }
        return props;
    },
    (dispatch, ownProps) => ({})
)(Render);

export default Status;