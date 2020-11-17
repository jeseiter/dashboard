import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Pod from './pod';
import DragHighlight from './dragHighlight';

// import AppActions from '../actions/AppActions';
// import PodActions from '../actions/PodActions';
// import StoreActions from '../actions/StoreActions';

import {POD_GAP, PADDING} from '../../../constants';

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
    }

    componentDidMount = () => {
        // console.log('View: componentDidMount');

        // Add listeners
        // this.listenTo(AppActions.resize, this.onResize);
        // this.listenTo(PodActions.addPod, this.onAddPod);
        // this.listenTo(PodActions.deletePod, this.onDeletePod);
        // this.listenTo(PodActions.dragPodStart, this.onDragPodStart);

        // When view mounts, update pod layout
        this.updateLayout();
    };

    componentDidUpdate = (props, state) => {
        // console.log('View: componentDidUpdate');

        // Update layout if isUpdate true
        // isUpdate set to true, if user deletes pod
        // TODO : On delete, do not need to update template layout
        if (this.state.isUpdate) {
            this.setState({
                isUpdate : false
            }, () => {
                this.updateLayout();
            });
        }

        // Update layout if menu opens or closes
        // if (this.state.isMenuOpen && !state.isMenuOpen) {
        //     this.updateLayout(this.node.current.clientWidth - 330, this.node.current.clientHeight);
        // } else if (!this.state.isMenuOpen && state.isMenuOpen) {
        //     this.updateLayout(this.node.current.clientWidth + 330, this.node.current.clientHeight);
        // }
    };

    onResize = () => {
        //console.log('View: onResize');
        let w = window.innerWidth - 20;
        let h = window.innerHeight - 72;

        this.updateLayout(w, h);
    };

    updateLayout = (w, h) => {
        //console.log('View: updateLayout');

        const {view} = this.props;

        view.width = w ? w : window.innerWidth - 20; //domNode.clientWidth;// - ( this.state.isMenuOpen ? 330 : 0 );
        view.height = h ? h : window.innerHeight - 75; //domNode.clientWidth;// - ( this.state.isMenuOpen ? 330 : 0 );

        switch (view.layout) {

            case 'pod' :
                this.updatePodLayout();
                break;

            case 'mdi' :
                break;

            case 'template' :
                this.updateTemplateLayout();
                break;

            default :
                break;
        }
    };

    updatePodLayout = () => {
        let pod, podWidth, podHeight, sqrt, numPods, numRows, numCols, row = 0, col = 0, w, h;

        const {view} = this.props;

        numPods = view.pods.length;
        sqrt = Math.floor(Math.sqrt(numPods));
        numCols = Math.ceil(numPods / sqrt);
        numRows = Math.ceil(numPods / numCols);
        w = this.node.current.clientWidth; // - ( this.state.isMenuOpen ? 330 : 0 );
        h = this.node.current.clientHeight;
        podWidth = Math.round((w - PADDING * 2) / numCols - ((POD_GAP * (numCols - 1)) / numCols));
        podHeight = Math.round((h - PADDING * 2) / numRows - ((POD_GAP * (numRows - 1)) / numRows));

        for (let i = 0; i < numPods; i++) {
            if (i % numCols === 0 && i > 0) {
                row++;
                col = 0;
            } else if (i > 0) {
                col++;
            }

            // Set size and position of pod models and highlight models
            pod = {
                width: podWidth,
                height: podHeight,
                left: col * podWidth + (col + 1) * POD_GAP,
                top: row === 0 ? POD_GAP : podHeight + 2 * POD_GAP,
                title: view.pods[i].title
            };

            // highlight = {};
            // highlight.width = podWidth;
            // highlight.height  = podHeight;
            // highlight.left  = col * podWidth + (col + 1) * POD_GAP;
            // highlight.top = row === 0 ? POD_GAP : podHeight + 2 * POD_GAP;

            this.pods.push(pod);
            this.highlights.push(pod);
        }

        this.forceUpdate();
    };

    updateTemplateLayout = () => {
        let podModel, podModels, highlightModel, highlightModels, cellWidth, cellHeight,
        template, numCells, cellModel, cellModels, numRows, numCols, row, col, rowSpan, colSpan, left, top, w, h;

        //console.log('View: updateTemplateLayout');

        const {view} = this.props;

        podModels = view.pods;
        highlightModels = view.highlights;

        numCells = highlightModels.length;

        template = view.template;

        numCols = template.numCols;
        numRows = template.numRows;
        cellModels = template.cells;

        w = view.width;// - ( this.state.isMenuOpen ? 330 : 0 );
        h = view.height;

        cellWidth = Math.round((w - PADDING * 2) / numCols - ((POD_GAP * (numCols - 1)) / numCols));
        cellHeight = Math.round((h - PADDING * 2) / numRows - ((POD_GAP * (numRows - 1)) / numRows));

        for (let i = 0; i < numCells; i++) {

            cellModel = cellModels[i];

            col = cellModel.col;
            row = cellModel.row;

            colSpan = cellModel.colSpan;
            rowSpan = cellModel.rowSpan;

            // First, we set the top and left of each cell
            left = col * cellWidth + PADDING;
            top = row * cellHeight + PADDING;

            if ( col > 0 ) {
                left += POD_GAP * col;
            }

            if ( row > 0 ) {
                top += POD_GAP * row;
            }

            // Next, we set the width and height of a cell
            w = ( colSpan * cellWidth ) + ( (colSpan - 1) * POD_GAP );
            h = ( rowSpan * cellHeight ) + ( (rowSpan - 1) * POD_GAP );

            // Set size and position of pod models and highlight models
            podModel = podModels[i];

            if (podModel) {
                podModel.width = w + 'px';
                podModel.height = h + 'px';
                podModel.left = left + 'px';
                podModel.top = top + 'px';
            }

            highlightModel = highlightModels[i];
            highlightModel.width = w + 'px';
            highlightModel.height = h + 'px';
            highlightModel.left  = left + 'px';
            highlightModel.top  = top + 'px';
        }

        this.forceUpdate();
    };

    // onDragPodStart = (dragElement, startX, startY) => {
    //     //console.log('View: onDragPodStart');
    //     if (this.props.view.selected) {
    //
    //         let dragPod = this.props.view.pods[dragElement.getAttribute('data-index')];
    //
    //         this.setState({
    //             dragPod : dragPod,
    //             dragElement: dragElement,
    //             dragStartX : startX,
    //             dragStartY : startY,
    //             dragOffsetX : dragElement.offsetLeft,
    //             dragOffsetY : dragElement.offsetTop
    //         })
    //
    //         document.addEventListener('mousemove', this.onMouseMove);
    //         document.addEventListener('mouseup', this.onMouseUp);
    //     }
    // };

    onMouseMove = (e) => {
        //console.log('View: onMouseMove');

        let dragPod, dragElement, view, dragHighlight, dragHighlights, dragHighlightIndex, dragRect, rect, area,
        percentOverlap, dragIndex, viewModel, w, h;

        dragPod = this.state.dragPod;
        dragElement = this.state.dragElement;
        view = dragElement.offsetParent;

        /** this is the actual "drag code" **/
        /** offset x = starting point of drag element **/
        /** e.clientX - .dragStartY = move amount **/

        dragPod.left = dragElement.style.left = Math.max(PADDING, Math.min((this.state.dragOffsetX + e.clientX - this.state.dragStartX), view.clientWidth - PADDING * 2 - dragElement.clientWidth)) + 'px';
        dragPod.top = dragElement.style.top = Math.max(PADDING, Math.min((this.state.dragOffsetY + e.clientY - this.state.dragStartY), view.clientHeight - PADDING * 2 - dragElement.clientHeight)) + 'px';

        dragHighlights = view.getElementsByClassName("drag-highlight");

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
                        console.log("Drag rect overlaps " + dragHighlight.id + " by " + percentOverlap + "%");

                        this.setState({
                            dropIndex : dragHighlightIndex
                        });

                        viewModel = this.props.view;
                        switch (viewModel.layout) {

                            case 'pod' :
                                this.movePods(dragIndex, this.state.dropIndex);
                                break;

                            case 'mdi' :
                                break;

                            case 'template' :

                                if (percentOverlap >= 50) {

                                    console.log("Drag rect overlaps " + dragHighlight.id + " by " + percentOverlap + "%");

                                    this.setState({
                                        dropIndex : dragHighlightIndex
                                    });

                                } else {
                                    this.setState({
                                        dropIndex : dragIndex
                                    });
                                }
                                break;

                            default :
                                break;
                        }
                    }
                }
            }
        }

        e.stopPropagation();
        e.preventDefault();
    };

    movePods = (dragIndex, dropIndex) => {
        let podModels, highlightModels;

        // console.log("View: movePods dragIndex = " + dragIndex + ", dropIndex = " + dropIndex);

        // Get pods and dragHighlights
        podModels = this.props.view.pods;
        highlightModels = this.props.view.highlights;

        if (dragIndex < dropIndex) {
            for (let i = dragIndex + 1; i <= dropIndex; i++) {
                podModels[i].top = highlightModels[i-1].top;
                podModels[i].left = highlightModels[i-1].left;
                podModels[i].index = i-1;
            }
        } else {
            for (let i = dropIndex; i <= dragIndex - 1; i++) {
                podModels[i].top = highlightModels[i+1].top;
                podModels[i].left = highlightModels[i+1].left;
                podModels[i].index = i+1;
            }
        }

        this.forceUpdate();
    };

    onMouseUp = (e) => {
        //console.log('View: onMouseUp');

        let pod, dragElement, viewModel, dragIndex;

        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        viewModel = this.props.view;

        // Flip pod.dragging indicator
        for (let i = 0; i < viewModel.pods.length; i++) {
            pod = viewModel.pods[i];
            if ( pod && pod.dragging ){
                pod.dragging = false;
                break;
            }
        }

        // Get drag element and revert z-index attribute
        dragElement = this.state.dragElement;
        dragElement.style.zIndex = '';
        dragElement.className = 'pod';

        dragIndex = dragElement.getAttribute('data-index');

        switch (viewModel.layout) {

            case 'pod' :
                // Snap drag element into place
                this.positionDragElement(dragIndex, this.state.dropIndex);
                break;

            case 'mdi' :
                break;

            case 'template' :
                if (dragIndex === this.state.dropIndex) {
                    this.restoreDragElementPosition(dragElement);
                } else {
                    this.swapPods(dragIndex, this.state.dropIndex);
                }
                break;

            default :
                break;
        }

        e.stopPropagation();
        e.preventDefault();
    };

    /** Position Drag Element Util **/
    positionDragElement = (dragIndex, dropIndex) => {

        let pods, highlights, pod, highlight;

        //console.log('View: positionDragElement');

        // Get dragHighlights and pods
        pods = this.props.view.pods;
        highlights = this.props.view.highlights;

        pod = pods[dragIndex];
        highlight = highlights[dropIndex];

        // slide drag element into place
        pod.top = highlight.top;
        pod.left = highlight.left;

        this.forceUpdate();

        // Update index / index of dragElement's pod
        pod.index = dropIndex;

        // Sort pods by index
        pods.sort(this.sortByIndex);

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
            switch (view.layout) {

                case 'pod' :

                    highlight = {
                        index : pods.length,
                        top : 0,
                        left : 0,
                        width : 0,
                        height : 0
                    }

                    view.highlights.push(highlight);

                    pod = {
                        id : Math.random(),
                        index : pods.length,
                        appId : app.appId,
                        title : app.title,
                        icon : app.icon,
                        description : app.description,
                        chartTool : app.chartTool,
                        chartType : app.chartType,
                        url : app.url,
                        chartData : app.chartData,
                        top : 0,
                        left : 0,
                        width : 0,
                        height : 0
                    }

                    pods.push(pod);
                    break;

                case 'mdi' :
                    break;

                case 'template' :

                    pod = {
                        id : Math.random(),
                        appId : app.appId,
                        title : app.title,
                        icon : app.icon,
                        description : app.description,
                        chartTool : app.chartTool,
                        chartType : app.chartType,
                        url : app.url,
                        chartData : app.chartData
                    }

                    // Find first empty cell
                    for (let i = 0; i < pods.length; i++) {
                        if (pods[i] == null) {
                            pod.index = i;
                            pods[i] = pod;
                            break;
                        }
                    }
                    break;

                default :
                    break;
            }

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

    sortByIndex = (a, b) => {
        return a.index - b.index;
    };

    render() {
        // console.log('View: render ' + this.props.view.title);
        // let className = view.selected ? 'view selected' : 'view';
        return (
            <div
                ref={this.node}
                className="view-component"
                style={{width: window.innerWidth, height: window.innerHeight - 48}} >
                {
                    (this.highlights || []).map((highlight, index) => {
                        return (
                            <DragHighlight
                                key={index}
                                highlight={highlight} />
                        );
                    })
                }
                {
                    (this.pods || []).map((pod, index) => {
                        return (
                            <Pod
                                key={index}
                                pod={pod} />
                        );
                    })
                }
            </div>
        )
    }
}

export default View;