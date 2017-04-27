import * as React from 'react';
import {InputBox} from './InputBox';
export class SummaryInputBox extends InputBox {
    state: Object;
    props: Object;

    constructor(props: Object) {
        super(props);
        this.onChange = this.onChange.bind(this);

    };
    onChange(event) {
        this.props.onChange(this.refs.childValue.value);
    }

    render() {
        return (
            <div>
                <h2> {this.props.type} </h2>
                <textarea value={this.props.data} onChange={this.onChange} ref="childValue" rows={10} cols={100} name={this.props.type} value={this.props.val} />
            </div>
        );
    }
};