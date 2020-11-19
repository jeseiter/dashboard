import React from 'react';
import PropTypes from 'prop-types';

require('./style.scss');

const DragHighlight = ({highlight}) => {

    const {index, top, left, width, height} = highlight;
    return (
        <div
            className="highlight-component"
            data-index={index}
            style={{
                top: top,
                left: left,
                width: width,
                height: height
            }} />
    );
};

DragHighlight.propTypes = {
    index: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
};

DragHighlight.defaultProps = {
    index: 0,
    top: 0,
    left: 0,
    width: 0,
    height: 0
};

export default DragHighlight;
