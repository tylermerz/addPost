import * as React from 'react';
import {InputBox} from './InputBox';
export class TitleInputBox extends InputBox {
    state: Object;
    props: Object;

    constructor(props: Object) {
        super(props);
    };

    render() {
        return (
            <div>
                <h2> {this.props.type} </h2>
                <input value={this.props.data} onChange={this.onChange} ref="childValue" size={100} name={this.props.type} />
            </div>
        );
    }
};