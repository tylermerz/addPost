import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {DefaultLayout} from '../../../personalWebsite/views/layouts/default';
var MarkdownIt = require('markdown-it');
var hljs = require('highlight.js');

class InputBox extends React.Component<any, any> {
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


class SummaryInputBox extends InputBox {
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

class ExtrasInputBox extends InputBox {
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

class TagsInputBox extends InputBox {
    state: Object;
    props: Object;
    constructor(props: Object) {
        super(props);
        this.state={};
    };

    onChange(event) {
        this.props.onChange(this.refs.childValue.value.split(","));
    }

    render() {
        return (
            <div>
                <h2> {this.props.type} </h2>
                <textarea value={this.props.data} onChange={this.onChange} ref="childValue" rows={3} cols={100} name={this.props.type} />
            </div>
        );
    }
};

class TitleInputBox extends InputBox {
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


class DateInputBox extends InputBox {
    state: Object;
    props: Object;

    constructor(props: Object) {
        super(props);
    };

    render() {
        return (
            <div>
                <h2> {this.props.type} </h2>
                <input value={this.props.data} onChange={this.onChange} ref="childValue" type="datetime" size={100} name={this.props.type} />
            </div>
        );
    }
};



class ResultBox extends React.Component<any, any> {
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
                <div className='mainBody'>
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


class PosterResultBox extends ResultBox {

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



export class FormContainer extends React.Component<any, any> {

    props: Object;
    state: Object;

    constructor(props: Object) {
        super(props);
        this.state = {
            display: true,
            submitted: false,
            childDate: new Date().toString(),
            childTitle: "",
            childSummary: "",
            calculatedChildSummary: "",
            childExtras: "",
            childPost: "",
            childUID: 0,
            childTags: [""]
        };
        this.calculateSummary = this.calculateSummary.bind(this);
        this.calculatePreview= this.calculatePreview.bind(this);
        this.clickToCancel = this.clickToCancel.bind(this);
        this.save= this.save.bind(this);
        this.load = this.load.bind(this);
    };

    /*submitForm(event) {
        event.preventDefault();
        document.getElementById('heading').scrollIntoView();
        this.setState({
            submitted: true,
            notification: ""
        });
        let authToken = cookie.load("auth");
        let myInit = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify({
                date: this.state.childDate,
                title: this.state.childTitle,
                summary: this.state.childSummary,
                extras: this.state.childExtras,
                post: this.state.childPost,
                id: this.state.childUID,
                tags: this.state.childTags
            })
        };

        fetch("https://localhost:3000/postAdd", myInit).then(response => {

            console.log(response.status);
            if (response.status == 401) {
                this.setState({ notification: "Connection to update database refused." });
            } else if (response.status == 200) {
                this.setState({ notification: "Connection to update database accepted." });
            }
        });
    };*/
    calculatePreview(event) {
        event.preventDefault();

        let md = new MarkdownIt({ html: true, typographer: true });

        let post = md.render(this.state["childPost"]);
        this.refs.preview.setState({ Result: post });
    }
    calculateSummary(event) {
        event.preventDefault();
        let summary: string = "";

        //take the first paragraph of the post body
        summary = this.state.childPost.split('</p>')[0] + "</p>";

        //find the first image
        let tagSearchList = [[new RegExp("<img"), new RegExp("/>")],
        [new RegExp("<div\\s*class\\s*=\\s*(\"|\')chart(\"|\')"), new RegExp("</script>")],
        [new RegExp("<pre>\\s*<code"), new RegExp("</pre>")]];

        let tagSearchResults: Array<Object> = tagSearchList.map((tagPair) => {
            let openingTagPos = this.state.childPost.search(tagPair[0]);
            let closingTagPos = this.state.childPost.search(tagPair[1]);

            return {
                startingPos: openingTagPos,
                slicedString: this.state.childPost.slice(openingTagPos, closingTagPos + tagPair[1].toString().length - 3)
            };
        });

        tagSearchResults.sort((a, b) => { return (a.startingPos - b.startingPos) });


        summary = summary + tagSearchResults[0]["slicedString"];
        this.setState({ childSummary: summary });
    }
    clickToCancel(event) {
        this.setState({ display: false });
    }

    load(event){
        event.preventDefault();
        let loadedDataJSON = localStorage[this.refs['vName'].value];
        let loadedState = JSON.parse(loadedDataJSON);
        for (var key in loadedState){
            this.setState({[key]:loadedState[key]});
        }
    }

    save(event){
        event.preventDefault();
        localStorage[this.refs['vName'].value]=JSON.stringify(this.state);
        console.log(localStorage[this.refs['vName'].value])
    }
    render() {
        return (
            <table>
                <tr>
                    <td >
                        <form method="Post" onSubmit={this.submitForm}>
                            <h1 id="heading">Add Post to Blog</h1>
                            {(this.state["submitted"] && this.state['display']) && <div onClick={this.clickToCancel} className="notification">Data submitted to Database.<br />{this.state['notification']}</div>}
                            <PosterResultBox data={this.state['childUID']} onChange={(value => this.setState({ childUID: value }))} type="poster" />
                            <DateInputBox data={this.state['childDate']} onChange={(value => this.setState({ childDate: value }))} type="date" />
                            <TitleInputBox data={this.state['childTitle']} onChange={(value => this.setState({ childTitle: value }))} type="title" />
                            <InputBox data={this.state["childPost"]} onChange={(value => this.setState({ childPost: value }))} type="post" />
                            <TagsInputBox data={this.state['childTags']} onChange={(value => this.setState({ childTags: value }))} type="tags" />
                            <ExtrasInputBox data={this.state['childExtras']} onChange={(value => this.setState({ childExtras: value }))} type="extras" />
                            <button onClick={this.calculateSummary}>Calculate Summary</button>
                            <button onClick={this.calculatePreview}>Calculate Preview</button>
                            <SummaryInputBox data={this.state['childSummary']} onChange={(value => this.setState({ childSummary: value }))} val={this.state.childSummary} type="summary" />
                            <input defaultValue="test" type='text' ref='vName' id='vName' /><button onClick={this.load}>Load</button><button onClick={this.save}>Save</button><br />
                            <button type="submit">Submit</button>
                        </form>
                    </td>
                    <td><ResultBox ref="preview" type="preview" /></td>
                </tr>
            </table>
        );
    }
};

ReactDOM.render(
    <FormContainer />,
    document.getElementById('root'))
