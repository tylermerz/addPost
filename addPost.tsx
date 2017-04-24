import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {DefaultLayout} from '../../../personalWebsite/views/layouts/default';
var MarkdownIt = require('markdown-it');

class InputBox extends React.Component<any, any> {
    state: Object
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
                <textarea onChange={this.onChange} ref="childValue" rows={30} cols={100} name={this.props.type} />
            </div>
        );
    }
};


class SummaryInputBox extends InputBox {
    state: Object;

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
                <textarea onChange={this.onChange} ref="childValue" rows={10} cols={100} name={this.props.type} value={this.props.val} />
            </div>
        );
    }
};

class ExtrasInputBox extends InputBox {
    state: Object;

    constructor(props: Object) {
        super(props);
        this.state = {};
    };

    render() {
        return (
            <div>
                <h2> {this.props.type} </h2>
                <textarea onChange={this.onChange} ref="childValue" rows={3} cols={100} name={this.props.type} />
            </div>
        );
    }
};

class TagsInputBox extends InputBox {
    state: Object;
    constructor(props: Object) {
        super(props);
        this.state = {
            tags: [""],
            tagRefs: []
        };
        this.onChange = this.onChange.bind(this);
    };

    onChange(event) {
        let tempTags = [];
        for (var tagRef in this.refs) {
            tempTags.push(this.refs[tagRef].value);
        }
        this.setState({ tags: tempTags });
        this.props.onChange(tempTags.slice(0, -1));
    }

    render() {
        let numTags = this.state.tags.length;

        let tagsBoxes = this.state.tags.map((t, i) => {
            if (i < numTags - 1) {
                return <div key={i}> <input ref={"tag" + i.toString()} onChange={this.onChange} key={i} type="text" cols={50} /> </div>
            } else {
                return <div key={i}> <input ref={"tag" + i.toString()} onFocus={(event) => this.setState({ tags: this.state.tags.concat("") })} onChange={this.onChange} key={i} type="text" cols={50} placeholder="new tag..." /> </div>
            }
        });
        return (
            <div>
                <h2> {this.props.type} </h2>
                {tagsBoxes}
            </div>
        );
    }
};

class TitleInputBox extends InputBox {
    state: Object;

    constructor(props: Object) {
        super(props);
    };

    render() {
        return (
            <div>
                <h2> {this.props.type} </h2>
                <input onChange={this.onChange} ref="childValue" size={100} name={this.props.type} />
            </div>
        );
    }
};


class DateInputBox extends InputBox {
    state: Object;

    constructor(props: Object) {
        super(props);
    };

    render() {
        return (
            <div>
                <h2> {this.props.type} </h2>
                <input onChange={this.onChange} ref="childValue" type="datetime" size={100} name={this.props.type} defaultValue={new Date().toString()} />
            </div>
        );
    }
};



class ResultBox extends React.Component<any, any> {
    state: Object;
    constructor(props: Object) {
        super(props);
        this.state={Result: ""};
    };
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


    constructor(props: Object) {
        super(props);
        this.state = {
            username: "",
            email: ""
        };
    };

    componentDidMount() {
        this.props.onChange(0);
        let myInit = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: '{"userID":"0"}'
        };
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

    state: Object;

    constructor(props: Object) {
        super(props);
        this.state = {
            display: true,
            submitted: false,
            childDate: Date(),
            childTitle: "",
            childSummary: "",
            calculatedChildSummary: "",
            childExtras: "",
            childPost: "",
            childUID: 0,
            childTags: []
        };
        this.calculateSummary = this.calculateSummary.bind(this);
        this.calculatePreview= this.calculatePreview.bind(this);
        this.clickToCancel = this.clickToCancel.bind(this);
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

let md = new MarkdownIt({html: true,typographer: true});

        let post = md.render(this.state["childPost"]);
        this.refs.preview.setState({Result: post});
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
    render() {
        return (
            <div>
                <form onSubmit={this.submitForm}>
                    <h1 id="heading">Add Post to Blog</h1>
                    {(this.state["submitted"] && this.state['display']) && <div onClick={this.clickToCancel} className="notification">Data submitted to Database.<br />{this.state['notification']}</div>}
                    <PosterResultBox onChange={(value => this.setState({ childUID: value }))} type="poster" />
                    <DateInputBox onChange={(value => this.setState({ childDate: value }))} type="date" />
                    <TitleInputBox onChange={(value => this.setState({ childTitle: value }))} type="title" />
                    <InputBox onChange={(value => this.setState({ childPost: value }))} type="post" />
                    <TagsInputBox onChange={(value => this.setState({ childTags: value }))} type="tags" />
                    <ExtrasInputBox onChange={(value => this.setState({ childExtras: value }))} type="extras" />
                    <button onClick={this.calculateSummary}>Calculate Summary</button>
                    <button onClick={this.calculatePreview}>Calculate Preview</button>
                    <SummaryInputBox onChange={(value => this.setState({ childSummary: value }))} val={this.state.childSummary} type="summary" />
                    <button type="submit">Submit</button>
                </form>
                <ResultBox ref="preview" type="preview" />
            </div>
        );
    }
};

ReactDOM.render(
    <FormContainer />,
    document.getElementById('root'))
