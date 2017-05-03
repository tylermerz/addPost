import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PosterResultBox from './PosterResultBox';
import DateInputBox from './DateInputBox';
import TitleInputBox from './TitleInputBox';
import InputBox from './InputBox';
import TagsInputBox from './TagsInputBox';
import SummaryInputBox from './SummaryInputBox';
import ResultBox from './ResultBox';
import ExtrasInputBox from './ExtrasInputBox';
import autoSummarizer from './autoSummarizer';
import autoTagger from './autoTagger';
var removeMd = require('remove-markdown');
var MarkdownIt = require('markdown-it');


export class FormContainer extends React.Component<any, any> {

    props: Object;
    state: Object;
    md: any;

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
        this.md = new MarkdownIt({ html: true, typographer: true });
        this.calculateSummary = this.calculateSummary.bind(this);
        this.calculateTags= this.calculateTags.bind(this);
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
        let post = this.md.render(this.state["childPost"]);
        this.refs.preview.setState({ Result: post });
    }
    calculateSummary(event) {
        event.preventDefault();
        let htmlFragment = document.createDocumentFragment(); 
        let htmlDiv = document.createElement("div");
        let htmlString = this.md.render(this.state["childPost"]);
        htmlDiv.innerHTML = htmlString;
        htmlFragment.appendChild(htmlDiv);

        let summarizer = new autoSummarizer(htmlFragment);
        let summary = summarizer.summarize();
        this.setState({ childSummary: summary });
    }
    calculateTags(event) {
        event.preventDefault();
        let htmlFragment = document.createDocumentFragment(); 
        let htmlDiv = document.createElement("div");
        let htmlString = this.md.render(this.state["childPost"]);
        htmlDiv.innerHTML = htmlString;
        htmlFragment.appendChild(htmlDiv);

        let AT= new autoTagger(htmlFragment);
        let tags  =AT.autoTag();
        this.setState({ childTags: tags });
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
        console.log({childTags:loadedState["childTags"]})
        console.log(this.state["childTags"]);
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
                            <button onClick={this.calculateTags}>Calculate Tags</button>
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
