import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

require('./style.scss');

const Tab = ({tab, selected, select}) => {

    const onClick = (tab) => {
        select(tab)
    };

    return (
        <div
            className={classnames('tab-component', {
                selected: selected
            })}
            onClick={onClick} >
            {tab.title}
        </div>
    );
};

Tab.propTypes = {
    tab: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    select: PropTypes.func.isRequired
};

Tab.defaultProps = {
    tab: {
        index: 0,
        title: ''
    },
    selectedI: false
}

export default Tab;
