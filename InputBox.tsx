import * as React from 'react';
export default class InputBox extends React.Component<any, any> {
    state: Object;
    props: Object;
    rows: number;
    cols: number;
    constructor(props: Object) {
        super(props);
        this.state = {};
        this.onChange = this.onChange.bind(this);
        this.rows = 30
        this.cols = 100;
        if (this.props.cols !== undefined){
            this.cols = this.props.cols;
        }
        if (this.props.rows !== undefined){
            this.rows = this.props.rows;
        }
    };

    onChange(event) {
        this.props.onChange(this.refs.childValue.value);

    }

    render() {
        return (
            <div>
                <h2> {this.props.type} </h2>
                <textarea className="mousetrap" onChange={this.onChange} ref="childValue" rows={this.rows} cols={this.cols} name={this.props.type} value={this.props.data} />
            </div>
        );
    }
};