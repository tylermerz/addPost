import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {DefaultLayout} from '../../../personalWebsite/views/layouts/default';
var hljs = require('highlight.js');
export default class ResultBox extends React.Component<any, any> {
    state: Object;
    props: Object;
    constructor(props: Object) {
        super(props);
        this.state={Result: ""};
        this.componentDidUpdate = this.componentDidUpdate.bind(this);        
    };
    componentDidUpdate() {
        var preBlock = ReactDOM.findDOMNode(this).getElementsByTagName("pre");
        for (var j = 0; j< preBlock.length;j++){
            let pB = preBlock[j].getElementsByTagName("code");
            for (var i = 0; i <pB.length; i++){
                let codeBlock = pB[i];
                hljs.highlightBlock(codeBlock);
            };
        };
    }
    render() {
        return (
            <DefaultLayout title="test">
                <div className='mainBody' >
                    <div className='postMeat'>
                        <div className='postBody'>
                            <hr />
                            <div dangerouslySetInnerHTML={{ __html: this.state["Result"] }} />
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        );
    }
};