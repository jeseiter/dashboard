import React, {Component} from 'react';

//import ViewStack from './ViewStack';
// import PodActions from '../actions/PodActions';
// import AppStore from '../stores/AppStore';

//import $ from 'jquery';

//var Chart = require('../../libs/Chart.min.js').Chart;

//require(['./libs/Chart.min.js'], function(Chart){
//    //var Chartjs = Chart.noConflict();
//});

require('./style.scss');

class Pod extends Component {

    // mixins: [Reflux.connect(AppStore)],

    constructor(props) {
        super(props);

        this.node = React.createRef();

        this.state = {
            over : false,
            overButton : false,
            minimizedTop : 0,
            minimizedLeft : 0,
            minimizedWidth : 0,
            minimizedHeight : 0,
        };
    }

    // componentDidMount = () => {
    //     console.log('Pod: componentDidMount');
    //
    //     // this.loadPod();
    //
    //     // Listen for end of resize
    //     this.node.current.addEventListener('webkitTransitionEnd', this.onTransitionEnd, false);
    //     this.node.current.addEventListener('transitionend', this.onTransitionEnd, false);
    // };

    // componentWillUnmount = () => {
    //     console.log('Pod: componentWillUnmount');
    //
    //     // Remove event listeners
    //     this.node.current.removeEventListener('webkitTransitionEnd', this.onTransitionEnd, false);
    //     this.node.current.removeEventListener('transitionend', this.onTransitionEnd, false);
    // };

    // loadPod = () => {
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

    onMouseOver = () => {
        //console.log('Pod: onMouseOver');
        this.setState({
            over : true
        });
    };

    onMouseOut = () => {
        //console.log('Pod: onMouseOut');
        this.setState({
            over : false
        });
    };

    onMouseDown = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (this.state.overButton){
            return
        }

        // only left mouse button
        if (e.button !== 0){
            return
        }

        //console.log('Pod: onMouseDown');

        let dragElement; //, startX, startY;

        // Set pod class to dragging to remove transition css
        this.props.pod.dragging = true;

        // Get drag element
        dragElement = React.findDOMNode(this);
        dragElement.style.zIndex = 1;

        // Get startX and startY
        // startX = e.clientX;
        // startY = e.clientY;

        // PodActions.dragPodStart(dragElement, startX, startY);

    };

    onBtnMouseOver = (e) => {
        //console.log('Pod: onBtnMouseOver');
        this.setState({
            overButton : true
        });
    };

    onBtnMouseOut = (e) => {
        //console.log('Pod: onBtnMouseOut');
        this.setState({
            overButton : false
        });
    };

    onMinMaxBtnClick = (e) => {
        console.log('Pod: onMinMaxBtnClick');

        e.stopPropagation();
        e.preventDefault();

        const {pod} = this.props;

        if (pod.maximized) {

            // Set maximized pod width and height
            pod.top = this.state.minimizedTop;
            pod.left = this.state.minimizedLeft;
            pod.width = this.state.minimizedWidth;
            pod.height = this.state.minimizedHeight;

            this.forceUpdate();

            // Listen for end of minimize transition beofre resetting z-index
            this.node.current.addEventListener('webkitTransitionEnd', this.onMinimizeEnd, false);
            this.node.current.addEventListener('transitionend', this.onMinimizeEnd, false);
        } else {

            // Save minimized pod size and location
            this.setState({
                minimizedTop : pod.top,
                minimizedLeft : pod.left,
                minimizedWidth : pod.width,
                minimizedHeight : pod.height
            })

            // Set maximized pod width and height
            pod.top = 10;
            pod.left = 10;
            pod.width = this.node.current.offsetParent.clientWidth - 20;
            pod.height = this.node.current.offsetParent.clientHeight - 20;

            this.node.current.style.zIndex = 1;

            // Listen for end of maximize transition
            //pod.addEventListener('webkitTransitionEnd', this.onMaximizeEnd, false);
            //pod.addEventListener('transitionend', this.onMaximizeEnd, false);
        }

        pod.maximized = !pod.maximized;
    };

    onTransitionEnd = (e) => {
        //console.log('Pod: onTransitionEnd');
        if (e.propertyName === "width" || e.propertyName === "height") {
            // this.loadPod();
        }
    };

    //onMaximizeEnd = (e) => {
    //
    //    console.log('Pod: onMaximizeEnd');
    //
    //    let pod;
    //
    //    pod = e.currentTarget;
    //
    //    if ( pod )
    //    {
    //        pod.removeEventListener('webkitTransitionEnd', this.onMaximizeEnd, false);
    //        pod.removeEventListener('transitionend', this.onMaximizeEnd, false);
    //
    //        this.loadPod();
    //    }
    //};

    onMinimizeEnd = (e) => {
        console.log('Pod: onMinimizeEnd');

        let pod = e.currentTarget;
        if (pod) {
            pod.removeEventListener('webkitTransitionEnd', this.onMinimizeEnd, false);
            pod.removeEventListener('transitionend', this.onMinimizeEnd, false);

            pod.style.zIndex = '';

            //this.loadPod();
        }
    };

    onDeleteBtnClick = () => {
        console.log('Pod: onDeleteBtnClick');
        // let pod = React.findDOMNode(this);
        //PodActions.deletePod(this.props.pod);
    };

    render() {
        // console.log('Pod: render ' + this.props.pod.title);

        let buttonBarStyle;

        const {pod} = this.props;

        console.log('pod = ' + JSON.stringify(pod));

        // className = pod.dragging ? 'pod drag' : 'pod';
        buttonBarStyle = this.state.over ? 'pod-header-button-bar show' : 'pod-header-button-bar';

        return (
            <div
                ref={this.node}
                className="pod-component"
                data-index={pod.index}
                style={{
                    width: pod.width,
                    height: pod.height,
                    top: pod.top,
                    left: pod.left
                }}
                onMouseOut={this.onMouseOut}
                onMouseOver={this.onMouseOver} >
                <span
                    className="pod-header"
                    onMouseUp={this.onMouseUp}
                    onMouseDown={this.onMouseDown}  >
                    <div className="pod-title">
                        {pod.title}
                    </div>
                    <div className={buttonBarStyle}>
                        <button
                            className="pod-min-max-btn"
                            title="Maximize"
                            onMouseOver={this.onBtnMouseOver}
                            onMouseOut={this.onBtnMouseOut}
                            onClick={this.onMinMaxBtnClick} />
                        <button
                            className="delete-btn"
                            title="Remove"
                            onMouseOver={this.onBtnMouseOver}
                            onMouseOut={this.onBtnMouseOut}
                            onClick={this.onDeleteBtnClick} />
                    </div>
                </span>
                <div className="pod-content" />
            </div>
        )
    }
}

export default Pod;