import React from 'react';
import PropTypes from 'prop-types';
import Tab from './tab';

require('./style.scss');

const TabBar = ({tabs, selectedIndex, select}) => {

    const onSelect = (tab) => {
        select(tab)
    };

    return (
        <div className="tab-bar-component">
            {
                tabs.map((tab, index) => {
                    return (
                        <Tab
                            tab={tab}
                            key={index}
                            selected={index === selectedIndex}
                            select={onSelect} />
                    );
                })
            }
        </div>
    );
};

TabBar.propTypes = {
    tabs: PropTypes.array.isRequired,
    selectedIndex: PropTypes.number.isRequired,
    select: PropTypes.func.isRequired
};

TabBar.defaultProps = {
    tabs: [],
    selectedIndex: 0
}

export default TabBar;
