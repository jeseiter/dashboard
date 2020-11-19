import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {createEpicMiddleware} from 'redux-observable';
import Dashboard from './containers/dashboard';
import reducer from './containers/dashboard/reducers';
import epics from './containers/dashboard/epics';
import {logger} from 'redux-logger';
import './index.css';

const initialState = {
    views: [
        {
            title: 'Charts',
            pods: [
                {
                    title: 'Bar Chart',
                    type: 'bar',
                    data: {
                        labels: ['January', 'February', 'March', 'April', 'May'],
                        datasets: [
                            {
                                label: 'Rainfall',
                                backgroundColor: 'rgba(75, 192, 192, 1)',
                                borderColor: 'rgba(0, 0, 0, 1)',
                                borderWidth: 2,
                                data: [65, 59, 80, 81, 56]
                            }
                        ]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Average Rainfall per month',
                            fontSize: 20
                        },
                        legend: {
                            display: true,
                            position: 'right'
                        }
                    }
                },
                {
                    title: 'Line Chart',
                    type: 'line',
                    data: {
                        labels: ['January', 'February', 'March', 'April', 'May'],
                        datasets: [
                            {
                                label: 'Rainfall',
                                fill: false,
                                lineTension: 0.5,
                                backgroundColor: 'rgba(75,192,192,1)',
                                borderColor: 'rgba(0,0,0,1)',
                                borderWidth: 2,
                                data: [65, 59, 80, 81, 56]
                            }
                        ]
                    },
                    options: {
                        title:{
                            display: true,
                            text: 'Average Rainfall per month',
                            fontSize: 20
                        },
                        legend:{
                            display: true,
                            position: 'right'
                        }
                    }
                },
                {
                    title: 'Doughnut Chart',
                    type: 'doughnut',
                    data: {
                        labels: ['January', 'February', 'March', 'April', 'May'],
                        datasets: [
                            {
                                label: 'Rainfall',
                                backgroundColor: [
                                    '#B21F00',
                                    '#C9DE00',
                                    '#2FDE00',
                                    '#00A6B4',
                                    '#6800B4'
                                ],
                                hoverBackgroundColor: [
                                    '#501800',
                                    '#4B5000',
                                    '#175000',
                                    '#003350',
                                    '#35014F'
                                ],
                                data: [65, 59, 80, 81, 56]
                            }
                        ]
                    },
                    options: {
                        title:{
                            display: true,
                            text: 'Average Rainfall per month',
                            fontSize: 20
                        },
                        legend:{
                            display: true,
                            position: 'right'
                        }
                    }
                },
                {
                    title: 'Horizontal Bar Chart',
                    type: 'horizontalBar',
                    data: {
                        labels: ['January', 'February', 'March', 'April', 'May'],
                        datasets: [
                            {
                                label: 'Rainfall',
                                backgroundColor: 'rgba(255, 0, 0, 0.3)',
                                borderColor: 'rgba(0, 0, 0, 0.3)',
                                borderWidth: 2,
                                data: [65, 59, 80, 81, 56]
                            }
                        ]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Average Rainfall per month',
                            fontSize: 20
                        },
                        legend: {
                            display: true,
                            position: 'right'
                        }
                    }
                }
            ],
            layout: 'pod'
        },
        {
            title: 'View 2',
            pods: [],
            layout: 'pod'
        },
        {
            title: 'View 3',
            pods: [],
            layout: 'pod'
        }
    ]
};

const epicMiddleware = createEpicMiddleware();
const store = createStore(
    reducer,
    initialState,
    applyMiddleware(epicMiddleware, logger)
);

epicMiddleware.run(epics);

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store} >
          <Dashboard />
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
