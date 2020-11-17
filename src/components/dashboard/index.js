import React from 'react';
import PropTypes from 'prop-types';
import TabBar from "../tab-bar";
import View from "./view";

require('./style.scss');

class Dashboard extends React.Component {

    static propTypes = {
        views: PropTypes.array.isRequired
    };

    static defaultProps = {
        views: [
            {
                title: 'View 1',
                pods: [
                    {title: 'Pod 1'},
                    {title: 'Pod 2'},
                    {title: 'Pod 3'},
                    {title: 'Pod 4'},
                    {title: 'Pod 5'},
                    {title: 'Pod 6'}
                ],
                layout: 'pod'
            },
            {
                title: 'View 2'
            },
            {
                title: 'View 3'
            }
        ]
    };

    onSelect = () => {
        console.log('onSelect');
    };

    render() {
        const {views} = this.props;
        return (
            <div className="dashboard-component">
                <TabBar
                    tabs={views}
                    select={this.onSelect} />
                <View
                    view={views[0]} />
            </div>
        );
    }
}

export default Dashboard;