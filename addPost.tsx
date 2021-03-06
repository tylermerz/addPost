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
var mousetrap = require('mousetrap');
var removeMd = require('remove-markdown');
var MarkdownIt = require('markdown-it');
var escape = require('html-escape');


export class FormContainer extends React.Component<any, any> {

    props: Object;
    state: Object;
    md: any;

    constructor(props: Object) {
        super(props);
        this.state = {
            display: true,
            submitted: false,
            childDate: new Date().toUTCString(),
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
        this.componentDidMount = this.componentDidMount.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.generateOutputString = this.generateOutputString.bind(this);
    };
    componentDidMount(){
        window.setInterval(()=>{
            this.calculatePreview(null);
        }, 5000);
        mousetrap.bind('command+s',(event)=>{
            this.save(event)
            return false;
        });
    }
    generateOutputString():string{
        let time = this.state["childDate"];
        let title = this.state["childTitle"].replace(/'/g,"''")
        let posterid = 0;
        let postID = this.state["childPostID"];
        let postbody = this.md.render(this.state["childPost"]).replace(/'/g,"''");//escape single quotes for SQL query
        let postsummary = this.state["childSummary"].replace(/'/g,"''");
        //code for post table insert
        let output = "INSERT INTO posts (id,time,title,posterid,postbody,postsummary) VALUES ("+postID.toString()+",'"+time+"','"+title+"','"+posterid+"','"+postbody+"','"+postsummary+"');\n"
        //code for tags table insert
        this.state["childTags"].forEach((tag)=>{
            output+="INSERT INTO tags (postid,tag) VALUES ("+postID.toString()+",'"+tag+"');\n"
        });
        return output;
    }
    submitForm(event){
        event.preventDefault();
        let output = this.generateOutputString();
        console.log(output);
    }
 
    calculatePreview() {
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
        console.log(localStorage[this.refs['vName'].value]);
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
                            <InputBox data={this.state["childPostID"]} onChange={(value => this.setState({ childPostID: value }))} cols={100} rows={1} type="PostID" />
                            <InputBox data={this.state["childPost"]} onChange={(value => this.setState({ childPost: value }))} type="post" />
                            <TagsInputBox data={this.state['childTags']} onChange={(value => this.setState({ childTags: value }))} type="tags" />
                            <button onClick={this.calculateTags}>Calculate Tags</button>
                            <ExtrasInputBox data={this.state['childExtras']} onChange={(value => this.setState({ childExtras: value }))} type="extras" />
                            <button onClick={this.calculateSummary}>Calculate Summary</button>
                            <SummaryInputBox data={this.state['childSummary']} onChange={(value => this.setState({ childSummary: value }))} val={this.state.childSummary} type="summary" />
                            <input defaultValue="test" type='text' ref='vName' id='vName' /><button onClick={this.load}>Load</button><button onClick={this.save}>Save</button><br />
                            <button type="submit">Show Postgres Code</button>
                        </form>
                    </td>
                    <td><ResultBox  ref="preview" type="preview" /></td>
                </tr>
            </table>
        );
    }
};

ReactDOM.render(
    <FormContainer />,
    document.getElementById('root'))
