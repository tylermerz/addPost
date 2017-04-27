import * as React from 'react';
import {ResultBox} from './ResultBox';
export class PosterResultBox extends ResultBox {

    props: Object;

    constructor(props: Object) {
        super(props);
        this.state = {
            username: "",
            email: ""
        };
    };

    componentDidMount() {
        this.props.onChange(0);
        //get the username from databa
        this.setState({
            username: "tmerz",
            email: "tyler.merz@gmail.com"
        });

    }
    render() {
        return (
            <div>
                <h2> {this.props.type} </h2>
                {this.state.username} ({this.state.email})
            </div>
        );
    }
};