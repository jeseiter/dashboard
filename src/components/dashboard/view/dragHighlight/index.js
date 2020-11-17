import React, {Component} from 'react';

class DragHighlight extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hidden: true
        };
    }

    componentDidMount = () => {
        console.log('DragHighlight: componentDidMount');

        // First time in highlights are hidden.
        // Add listener to detect when highlights have been properly sized.
        // Once sized, we will show highlights
        // if (this.state.hidden) {
        //     this.node.current.addEventListener('webkitTransitionEnd', this.onTransitionEnd, false);
        //     this.node.current.addEventListener('transitionend', this.onTransitionEnd, false);
        // }
    };

    onTransitionEnd = (e) => {
        console.log('DragHighlight: onTransitionEnd');
        let highlight = e.currentTarget;

        if (highlight) {
            highlight.removeEventListener('webkitTransitionEnd', this.onTransitionEnd, false);
            highlight.removeEventListener('transitionend', this.onTransitionEnd, false);

            this.setState({
                hidden: false
            });
        }
    };

    render() {
        console.log('DragHighlight: render');

        const {highlight} = this.props;
        let className = this.state.hidden ? 'drag-highlight hidden' : 'drag-highlight';

        return (
            <div
                ref={this.node}
                className={className}
                data-index={highlight.index}
                style={{
                    width: highlight.width,
                    height : highlight.height,
                    top : highlight.top,
                    left: highlight.left
                }}>
            </div>
        )
    }
}

export default DragHighlight;