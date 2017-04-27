import * as React from 'react';
import {InputBox} from './InputBox';
export class ExtrasInputBox extends InputBox {
    state: Object;
    props: Object;

    constructor(props: Object) {
        super(props);
        this.state = {};
    };


    render() {
        return (
            <div>
                <h2> {this.props.type} </h2>
                <textarea value={this.props.data} onChange={this.onChange} ref="childValue" rows={3} cols={100} name={this.props.type} />
            </div>
        );
    }
};