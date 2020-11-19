import React from 'react';
import PropTypes from 'prop-types';
import TabBar from "../../components/tab-bar";
import View from "../../components/view";
import {connect} from 'react-redux';
import Actions from './actions';

require('./style.scss');

class Dashboard extends React.Component {

    static propTypes = {
        views: PropTypes.array.isRequired,
        loadViews: PropTypes.func
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
                title: 'View 2',
                pods: []
            },
            {
                title: 'View 3',
                pods: []
            }
        ]
    };

    componentDidMount = () => {
        // this.props.loadViews();
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


export const mapStateToProps = (state) => ({
    views: state.views
});

export const mapDispatchToProps = (dispatch) => {
    return {
        loadViews: () => dispatch({type: Actions.LOAD_VIEWS}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
