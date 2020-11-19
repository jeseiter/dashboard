import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import {Bar, Line, Doughnut, HorizontalBar} from 'react-chartjs-2';
import classnames from 'classnames';

//import ViewStack from './ViewStack';
// import PodActions from '../actions/PodActions';
// import AppStore from '../stores/AppStore';

// import $ from 'jquery';

//var Chart = require('../../libs/Chart.min.js').Chart;

//require(['./libs/Chart.min.js'], function(Chart){
//    //var Chartjs = Chart.noConflict();
//});

require('./style.scss');

const Pod = ({pod, dragStart, maximize}) => {

    const node = useRef(null);

    // const loadPod = () => {
    //     let canvas, chartData, options, podModel, chart;
    //
    //     podModel = this.props.pod;
    //
    //     if (podModel.chartTool == "chart.js") {
    //
    //         let podContent;
    //
    //         podContent = this.node.current.childNodes[1];
    //
    //         podModel = this.props.pod;
    //
    //         $(podContent).load(podModel.url, function () {
    //             console.log('pod loaded');
    //
    //             let ctx;
    //
    //             canvas = $(this.node.current).find('canvas')[0];
    //
    //             ctx = canvas.getContext("2d");
    //             ctx.canvas.width = $(canvas).width();
    //             ctx.canvas.height = $(canvas).height();
    //
    //             options = {
    //                 responsive: true,
    //                 maintainAspectRatio: true
    //             }
    //
    //             switch (podModel.chartType) {
    //
    //                 case "bar" :
    //
    //                     chartData = podModel.chartData;
    //                     chart = new Chart(ctx).Bar(chartData, options);
    //                     break;
    //
    //                 case "pie" :
    //
    //                     chartData = podModel.chartData.datasets;
    //                     chart = new Chart(ctx).Pie(chartData, options);
    //                     break;
    //
    //                 case "line" :
    //
    //                     chartData = podModel.chartData;
    //                     chart = new Chart(ctx).Line(chartData, options);
    //                     break;
    //
    //                 case "polar-area" :
    //
    //                     chartData = podModel.chartData.datasets;
    //                     chart = new Chart(ctx).PolarArea(chartData, options);
    //                     break;
    //
    //                 case "radar" :
    //
    //                     chartData = podModel.chartData;
    //                     chart = new Chart(ctx).Radar(chartData, options);
    //                     break;
    //
    //                 case "doughnut" :
    //
    //                     chartData = podModel.chartData.datasets;
    //                     chart = new Chart(ctx).Doughnut(chartData, options);
    //                     break;
    //             }
    //         });
    //     }
    //
    //     if (podModel.chartTool == "google") {
    //
    //         let podCanvas;
    //
    //         let divs = this.node.current.getElementsByTagName('div');
    //
    //         podCanvas = this.node.current.getElementsByTagName('div')[4];
    //
    //         //let w = $(podCanvas).width() - 20;
    //         //let h = $(podCanvas).height() - 20;
    //
    //         //podCanvas.width = 433;//$(pod).width();
    //         //podCanvas.height = 272;//$(pod).height() - 40;
    //
    //         //let w = podCanvas.clientWidth; //$(podCanvas).parent().width() - 20;
    //         //let h = podCanvas.clientHeight; //$(podCanvas).parent().height() - 20;
    //
    //         //chartData = google.visualization.arrayToDataTable([
    //         //    ['Gender', 'Overall'],
    //         //    ['M', 110],
    //         //    ['F', 20]
    //         //]);
    //
    //         //chartData = google.visualization.arrayToDataTable(podModel.chartData);
    //
    //         //options = {
    //         //    legend: 'none',
    //         //    width: '100%',
    //         //    height: '100%',
    //         //    title: 'Google Pie Chart',
    //         //    pieSliceText: 'percentage',
    //         //    colors: ['#0598d8', '#f97263'],
    //         //    chartArea: {
    //         //        left: "5%",
    //         //        top: "5%",
    //         //        height: "90%",
    //         //        width: "90%"
    //         //    }
    //         //};
    //
    //         switch (podModel.chartType){
    //
    //             case "bar" :
    //                 //chart = new Chart(ctx).Bar(chartData, options);
    //                 break;
    //
    //             case "pie" :
    //                 // console.log('draw google pie chart')
    //                 // let chartData = google.visualization.arrayToDataTable([
    //                 //     ['Task', 'Hours per Day'],
    //                 //     ['Work',     11],
    //                 //     ['Eat',      2],
    //                 //     ['Commute',  2],
    //                 //     ['Watch TV', 2],
    //                 //     ['Sleep',    7]
    //                 // ]);
    //                 //
    //                 // let options = {
    //                 //     title: 'My Daily Activities',
    //                 //     is3D: true
    //                 // };
    //                 //
    //                 // chart = new google.visualization.PieChart(podCanvas);
    //                 break;
    //
    //             case "line" :
    //                 //chart = new Chart(ctx).Line(chartData, options);
    //                 break;
    //
    //             case "polar-area" :
    //                 //chart = new Chart(ctx).PolarArea(chartData, options);
    //                 break;
    //
    //             case "geo" :
    //                 // console.log('draw google geo chart')
    //                 //
    //                 // let chartData = google.visualization.arrayToDataTable([
    //                 //     ['Country', 'Popularity'],
    //                 //     ['Germany', 200],
    //                 //     ['United States', 300],
    //                 //     ['Brazil', 400],
    //                 //     ['Canada', 500],
    //                 //     ['France', 600],
    //                 //     ['RU', 700]
    //                 // ]);
    //                 //
    //                 // let options = {};
    //                 //
    //                 // let chart = new google.visualization.GeoChart(podCanvas);
    //                 break;
    //         }
    //
    //         chart.draw(chartData, options);
    //     }
    //
    //     if (podModel.url.substr(0, 11) == "pods/google") {
    //
    //         console.log('POD: draw google chart')
    //
    //         $.get(podModel.url, function (data) {
    //
    //             let podContent = this.node.current.getElementsByClassName("pod-content")[0];
    //             $(podContent).html(data);
    //         });
    //     }
    //
    //     if (podModel.url.substr(0, 15) == "pods/highcharts") {
    //
    //         $.get(podModel.url, function (data) {
    //             let podContent = this.node.current.getElementsByClassName("pod-content")[0];
    //             $(podContent).html(data);
    //         });
    //     }
    //
    //     if (podModel.url.substr(0, 7) == "pods/c3") {
    //
    //         $.get(podModel.url, function (data) {
    //             let podContent = this.node.current.getElementsByClassName("pod-content")[0];
    //             $(podContent).html(data);
    //         });
    //     }
    // };

    const onMinMaxBtnClick = () => {
        maximize(pod.index);
    };

    /* eslint-disable no-unused-vars */
    const onDragHandleMouseDown = (e) => {
        e.persist();

        // Get startY
        dragStart(node.current, e.clientX, e.clientY);
    };

    const onDragHandleMouseUp = () => {
        // Get startY
        //let startY = e.clientY;
        //dragStart(startY);
    };

    const onDeleteBtnClick = () => {
        // let pod = React.findDOMNode(this);
        //PodActions.deletePod(this.props.pod);
    };

    return (
        <div
            ref={node}
            className={classnames('pod-component', {
                dragging: pod.dragging
            })}
            data-index={pod.index}
            style={{
                width: pod.width,
                height: pod.height,
                top: pod.top,
                left: pod.left,
                zIndex: pod.zIndex
            }} >
            <span
                className="pod-header"  >
                <div
                    id="drag-handle"
                    className={classnames('drag-handle', {
                        disabled: pod.maximized
                    })}
                    onMouseUp={onDragHandleMouseUp}
                    onMouseDown={onDragHandleMouseDown} />
                <div className="pod-title">
                    {pod.title}
                </div>
                <div className="separator" />
                <div>
                    <button
                        className={classnames('maximize-btn', {
                            minimize: pod.maximized
                        })}
                        title={pod.maximized ? 'Minimize' : 'Maximize'}
                        onClick={onMinMaxBtnClick} />
                    <button
                        className="delete-btn"
                        title="Remove"
                        onClick={onDeleteBtnClick} />
                </div>
            </span>
            <div className="pod-canvas" >
                {pod.type === 'bar' ?
                    <Bar
                        data={pod.data}
                        options={pod.options} />
                    : null
                }
                {pod.type === 'line' ?
                    <Line
                        data={pod.data}
                        options={pod.options} />
                    : null
                }
                {pod.type === 'doughnut' ?
                    <Doughnut
                        data={pod.data}
                        options={pod.options} />
                    : null
                }
                {pod.type === 'horizontalBar' ?
                    <HorizontalBar
                        data={pod.data}
                        options={pod.options} />
                    : null
                }
            </div>
        </div>
    )
};

Pod.propTypes = {
    pod: PropTypes.object.isRequired,
    dragStart: PropTypes.func.isRequired,
    maximize: PropTypes.func.isRequired
};

Pod.defaultProps = {
    pod: {}
};

export default Pod;
