import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Pod from './pod';
import DragHighlight from './dragHighlight';
import {debounce} from 'lodash/function';
import {pick} from 'lodash/object';

// import AppActions from '../actions/AppActions';
// import PodActions from '../actions/PodActions';
// import StoreActions from '../actions/StoreActions';

import {POD_GAP, PADDING} from '../../constants';

require('./style.scss');

class View extends Component {

    static propTypes = {
        view: PropTypes.object.isRequired
    };

    static defaultProps = {
        view: {
            pods: [],
            layout: 'pod'
        }
    };

    constructor(props) {
        super(props);

        this.node = React.createRef();

        this.pods = [];
        this.highlights = [];

        this.state = {
            dropIndex : 0,
            isUpdate : false,
            dragPod: null,
            dragElement: null,
            dragStartX : 0,
            dragStartY : 0,
            dragOffsetX : 0,
            dragOffsetY : 0
        };

        this.onResize = debounce(this.onResize, 1000);
    }

    componentDidMount = () => {
        window.addEventListener('resize', this.onResize);
        this.updateLayout();
    };

    componentDidUpdate = (props, state) => {
        // console.log('View: componentDidUpdate');

        // Update layout if isUpdate true
        // isUpdate set to true, if user deletes pod
        // TODO : On delete, do not need to update template layout
        // if (this.state.isUpdate) {
        //     this.setState({
        //         isUpdate : false
        //     }, () => {
        //         this.updateLayout();
        //     });
        // }

        // Update layout if menu opens or closes
        // if (this.state.isMenuOpen && !state.isMenuOpen) {
        //     this.updateLayout(this.node.current.clientWidth - 330, this.node.current.clientHeight);
        // } else if (!this.state.isMenuOpen && state.isMenuOpen) {
        //     this.updateLayout(this.node.current.clientWidth + 330, this.node.current.clientHeight);
        // }
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    };

    onResize = () => {
        this.updateLayout();
    };

    updateLayout = () => {
        let pod, highlight, podWidth, podHeight, sqrt, numPods, numRows, numCols, row = 0, col = 0, w, h;

        const {view} = this.props;

        numPods = view.pods.length;
        sqrt = Math.floor(Math.sqrt(numPods));
        numCols = Math.ceil(numPods / sqrt);
        numRows = Math.ceil(numPods / numCols);
        w = window.innerWidth; // - ( this.state.isMenuOpen ? 330 : 0 );
        h = window.innerHeight - 50;

        podWidth = Math.round((w - PADDING * 2) / numCols - ((POD_GAP * (numCols - 1)) / numCols));
        podHeight = Math.round((h - PADDING * 2) / numRows - ((POD_GAP * (numRows - 1)) / numRows));

        this.pods = [];
        this.highlights = [];
        for (let i = 0; i < numPods; i++) {
            if (i % numCols === 0 && i > 0) {
                row++;
                col = 0;
            } else if (i > 0) {
                col++;
            }

            // Set size and position of pod models and highlight models
            pod = {
                ...view.pods[i],
                index: i,
                width: podWidth,
                height: podHeight,
                left: col * podWidth + (col + 1) * POD_GAP,
                top: row === 0 ? POD_GAP : podHeight + 2 * POD_GAP,
                zIndex: 0
            };

            highlight = pick(pod, ['index', 'width', 'height', 'top', 'left'])

            this.pods.push(pod);
            this.highlights.push(highlight);
        }

        this.forceUpdate();
    };

    onDragStart = (dragElement, startX, startY) => {
        console.log('onDragStart');

        // Set dragging
        this.pods[dragElement.getAttribute('data-index')].dragging = true;

        // var dragPod = this.props.view.pods[dragElement.getAttribute('data-index')];

        this.setState({
            dragElement: dragElement,
            dragStartX : startX,
            dragStartY : startY,
            dragOffsetX : dragElement.offsetLeft,
            dragOffsetY : dragElement.offsetTop
        })

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    };

    onMouseMove = (e) => {
        let dragElement, dragHighlight, dragHighlights, dragHighlightIndex, dragRect, rect, area,
        percentOverlap, dragIndex, w, h;

        e.stopPropagation();
        e.preventDefault();

        // dragPod = this.state.dragPod;
        dragElement = this.state.dragElement;
        dragElement.style.zIndex = '999';
        // view = dragElement.offsetParent;

        /** this is the actual "drag code" **/
        /** offset x = starting point of drag element **/
        /** e.clientX - .dragStartY = move amount **/

        // dragPod.left = dragElement.style.left = Math.max(PADDING, Math.min((this.state.dragOffsetX + e.clientX - this.state.dragStartX), view.clientWidth - PADDING * 2 - dragElement.clientWidth)) + 'px';
        // dragPod.top = dragElement.style.top = Math.max(PADDING, Math.min((this.state.dragOffsetY + e.clientY - this.state.dragStartY), view.clientHeight - PADDING * 2 - dragElement.clientHeight)) + 'px';
        // let left = Math.max(PADDING, Math.min((this.state.dragOffsetX + e.clientX - this.state.dragStartX), this.node.current.clientWidth - PADDING * 2 - dragElement.clientWidth)) + 'px';
        // let top = Math.max(PADDING, Math.min((this.state.dragOffsetY + e.clientY - this.state.dragStartY), this.node.current.clientHeight - PADDING * 2 - dragElement.clientHeight)) + 'px';

        let left = (this.state.dragOffsetX + e.clientX - this.state.dragStartX);
        let top =  (this.state.dragOffsetY + e.clientY - this.state.dragStartY);

        dragElement.style.left = left + 'px';
        dragElement.style.top = top + 'px';

        dragHighlights = this.node.current.getElementsByClassName("highlight-component");
        dragRect = dragElement.getBoundingClientRect();
        dragIndex = parseInt(dragElement.getAttribute('data-index'));

        this.setState({
            dropIndex : dragIndex
        });

        for (let i = 0; i < dragHighlights.length; i++) {
            dragHighlight = dragHighlights[i];
            dragHighlightIndex = parseInt(dragHighlight.getAttribute('data-index'))

            if (dragIndex !== dragHighlightIndex && dragHighlightIndex !== this.state.dropIndex) {
                rect = dragHighlight.getBoundingClientRect();

                if (!(dragRect.top > rect.bottom || dragRect.right < rect.left || dragRect.bottom < rect.top || dragRect.left > rect.right)) {

                    w = dragRect.right > rect.right ? rect.right - dragRect.left : dragRect.right - rect.left;
                    h = dragRect.bottom > rect.bottom ? rect.bottom - dragRect.top : dragRect.bottom - rect.top;

                    area = w * h;
                    percentOverlap = parseFloat((area / (rect.width * rect.height) ) * 100).toFixed(1);

                    if (percentOverlap >= 50) {

                        this.setState({
                            dropIndex : dragHighlightIndex
                        });

                        this.movePods(dragIndex, this.state.dropIndex);
                    }
                }
            }
        }
    };

    movePods = (dragIndex, dropIndex) => {
        if (dragIndex < dropIndex) {
            for (let i = dragIndex + 1; i <= dropIndex; i++) {
                this.pods[i].top = this.highlights[i-1].top;
                this.pods[i].left = this.highlights[i-1].left;
                this.pods[i].index = i - 1;
            }
        } else {
            for (let i = dropIndex; i <= dragIndex - 1; i++) {
                this.pods[i].top = this.highlights[i+1].top;
                this.pods[i].left = this.highlights[i+1].left;
                this.pods[i].index = i + 1;
            }
        }

        this.forceUpdate();
    };

    onMouseUp = (e) => {
        let dragElement, dragIndex;

        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        // Get drag element and revert z-index attribute
        dragElement = this.state.dragElement;
        // dragElement.style.zIndex = '';

        dragIndex = dragElement.getAttribute('data-index');

        this.positionDragElement(dragIndex, this.state.dropIndex);

        e.stopPropagation();
        e.preventDefault();
    };

    positionDragElement = (dragIndex, dropIndex) => {
        let pod, highlight;

        pod = this.pods[dragIndex];
        highlight = this.highlights[dropIndex];

        console.log('highlight.index = ' + highlight.index);
        console.log('highlight.top = ' + highlight.top);
        console.log('highlight.left = ' + highlight.left);

        // slide drag element into place
        pod.top = highlight.top;
        pod.left = highlight.left;
        pod.index = dropIndex;
        pod.dragging = false;

        this.forceUpdate();

        // Update index / index of dragElement's pod

        // Sort pods by index
        // pods.sort(this.sortByIndex);

        // Update database
        // this.updatePodOrder(view);
    };

    swapPods = (dragIndex, dropIndex) => {
        let dragPod, dropPod, dragHighlight, dropHighlight, dragElement;

        //console.log("View: swapPods dragIndex = " + dragIndex + ", dropIndex = " + dropIndex);

        const {pods, highlights} = this.props.view;

        dragPod = pods[dragIndex];
        dragHighlight = highlights[dragIndex];

        dropPod = pods[dropIndex];
        dropHighlight = highlights[dropIndex];

        if (dragPod) {
            dragPod.top = dropHighlight.top;
            dragPod.left = dropHighlight.left;
            dragPod.width = dropHighlight.width;
            dragPod.height = dropHighlight.height;
        }

        if (dropPod) {
            dropPod.top = dragHighlight.top;
            dropPod.left = dragHighlight.left;
            dropPod.width = dragHighlight.width;
            dropPod.height = dragHighlight.height;
        }

        dragElement = this.state.dragElement;
        dragElement.addEventListener('webkitTransitionEnd', this.onSwapEnd, false);
        dragElement.addEventListener('transitionend', this.onSwapEnd, false);

        this.forceUpdate();
    };

    onSwapEnd = (e) => {
        //console.log('View: onSwapEnd');
        let dragElement, dragIndex, dropIndex, dragPod, dropPod, pods;

        dragElement = e.currentTarget;

        dragElement.removeEventListener('webkitTransitionEnd', this.onSwapEnd, false);
        dragElement.removeEventListener('transitionend', this.onSwapEnd, false);

        dragIndex = dragElement.getAttribute('data-index');
        dropIndex = this.state.dropIndex;

        pods = this.props.view.pods;

        dragPod = pods[dragIndex];
        dropPod = pods[dropIndex];

        if (dragPod) {
            dragPod.index = dropIndex;
        }

        if (dropPod) {
            dropPod.index = dragIndex;
        }

        // Swap pod models
        pods[dragIndex] = dropPod;
        pods[dropIndex] = dragPod;

        for (let i = 0; i < pods.length; i++) {
            let pod = pods[i];
            if (pod) {
                console.log(pod.title + ' at ' + pod.index)
            } else {
                console.log('null at ' + i)
            }
        }

        // Update database
        //this.updatePodOrder(viewModel);
    };

    restoreDragElementPosition = (dragElement) => {
        let pods, highlights, dragIndex;

        //console.log("View: restoreDragElementPosition");

        // Update dragElement's z-index
        dragElement.style.zIndex = '';

        // Get pods and dragHighlights
        pods = this.props.view.pods;
        highlights = this.props.view.highlights;

        // Get drag index
        dragIndex = dragElement.getAttribute('data-index');

        pods[dragIndex].top = highlights[dragIndex].top;
        pods[dragIndex].left = highlights[dragIndex].left;

        this.forceUpdate();
    };

    // updatePodOrder = (view) => {
    //
    //     let data = {
    //         view : view
    //     }
    //
    //     // dashboardService.updatePodOrder(JSON.stringify(data))
    //     //     .success(function(data, status, headers, config) {
    //     //         console.log('Dashboard Controller: success update pod order');
    //     //     })
    //     //     .error(function(data, status, headers, config) {
    //     //         console.log('Dashboard Controller: error update pod order');
    //     //     });
    // };

    onAddPod = (app) => {
        let view, pods, pod, highlight;

        view = this.props.view;

        if (view.selected) {
            console.log('View: onAddPod');

            pods = view.pods;

            highlight = {
                index : pods.length,
                top : 0,
                left : 0,
                width : 0,
                height : 0
            }

            view.highlights.push(highlight);

            pod = {
                id: Math.random(),
                index: pods.length,
                appId: app.appId,
                title: app.title,
                icon: app.icon,
                description: app.description,
                chartTool: app.chartTool,
                chartType: app.chartType,
                url: app.url,
                chartData: app.chartData,
                top: 0,
                left: 0,
                width: 0,
                height: 0
            }

            pods.push(pod);

            this.setState({
                isUpdate : true
            })

            // StoreActions.updateView(view);
        }

    };

    onDeletePod = (pod) => {
        let view, pods, index;

        view = this.props.view;

        if (view.selected) {
            console.log('View: onDeletePod');

            pods = view.pods;

            // If user clicked pod delete btn, get index of clicked pod
            index = pods.indexOf(pod);

            // else, user has clicked configuration menu item delete btn
            if (index < 0) {

                for (let i = 0; i < pods.length; i++) {
                    if (pods[i].appId === pod.appId) {
                        index = i;
                        break;
                    }
                }
            }

            this.deletePod(index);
        }
    };

    deletePod = (index) => {
        console.log('View: deletePod');
        let view, pods, highlights;

        view = this.props.view;

        pods = view.pods;
        highlights = view.highlights;

        switch (view.layout) {

            case 'pod' :
                // remove podModel and highlight model
                pods.splice(index, 1);
                highlights.splice(index, 1);
                break;

            case 'mdi' :
                break;

            case 'template' :

                pods[index] = null;
                break;

            default :
                break;
        }

        for (let i = 0; i < pods.length; i++) {
            if (pods[i]) {
                pods[i].index = i;
            }
        }

        this.setState({
            isUpdate : true
        })

        // StoreActions.updateView(view);
    };

    addDragHighlights = () => {
        //console.log('View: addDragHighlights');
        let view, numHighlights;

        view = this.props.view;
        view.highlights = [];

        switch (view.layout) {

            case 'pod' :
                numHighlights = view.pods.length;
                break;

            case 'mdi' :
                break;

            case 'template' :
                numHighlights = view.template.cells.length;
                break;

            default :
                break;
        }

        for (let i = 0; i < numHighlights; i++) {
            view.highlights.push({
                index : i,
                top : 0,
                left : 0,
                width : 0,
                height : 0
            });
        }
    };

    onMaximizePod = (index) => {
        let pod = this.pods[index];
        if (pod.maximized) {
            pod.width = pod.originalWidth;
            pod.height = pod.originalHeight;
            pod.top = pod.originalTop;
            pod.left = pod.originalLeft;
            pod.zIndex = 0;
        } else {
            pod.originalWidth = pod.width;
            pod.originalHeight = pod.height
            pod.originalTop = pod.top;
            pod.originalLeft = pod.left;

            pod.width = window.innerWidth - 20;
            pod.height = window.innerHeight - 50 - 20;
            pod.top = 10;
            pod.left = 10;

            pod.zIndex = 1;
        }

        pod.maximized = !pod.maximized

        this.forceUpdate();
    };

    sortByIndex = (a, b) => {
        return a.index - b.index;
    };

    render() {
        return (
            <div
                ref={this.node}
                className="view-component"
                style={{width: window.innerWidth, height: window.innerHeight - 48}} >
                {
                    this.highlights.map((highlight, index) => {
                        return (
                            <DragHighlight
                                key={index}
                                highlight={highlight}  />
                        );
                    })
                }
                {
                    this.pods.map((pod, index) => {
                        return (
                            <Pod
                                key={index}
                                pod={pod}
                                dragStart={this.onDragStart}
                                maximize={this.onMaximizePod}/>
                        );
                    })
                }
            </div>
        )
    }
}

export default View;
