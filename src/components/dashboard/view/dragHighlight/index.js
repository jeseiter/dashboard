import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

require('./style.scss');

const DragHighlight = ({top, left, width, height, dragging}) => {

    return (
        <div
            className={classnames('highlight-component', {
                dragging: dragging
            })}
            style={{
                top: top,
                left: left,
                width: width,
                height: height
            }} />
    );
};

DragHighlight.propTypes = {
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    dragging: PropTypes.bool.isRequired
};

DragHighlight.defaultProps = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    dragging: false
};

export default DragHighlight;
