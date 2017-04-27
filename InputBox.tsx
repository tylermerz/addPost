import * as React from 'react';
export default class InputBox extends React.Component<any, any> {
    state: Object;
    props: Object;
    constructor(props: Object) {
        super(props);
        this.state = {};
        this.onChange = this.onChange.bind(this);
    };

    onChange(event) {
        this.props.onChange(this.refs.childValue.value);

    }

    render() {
        return (
            <div>
                <h2> {this.props.type} </h2>
                <textarea onChange={this.onChange} ref="childValue" rows={30} cols={100} name={this.props.type} value={this.props.data} />
            </div>
        );
    }
};