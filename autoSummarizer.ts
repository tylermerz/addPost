/**Takes in an HTMLTemplateElement and tries to calculate an automatic summary of the text.
 * Method based on https://thetokenizer.com/2013/04/28/build-your-own-summary-tool/
 */
let stopWordsArray = require("./stopWords.json");
export default class autoSummarizer{
    version:string;
    versionLink:string;
    originalText:DocumentFragment;
    paragraphs:Array<Array<string>>;
    paragraphsHTML:Array<Array<string>>;
    numSentences:number;
    weightMatrix:Array<Array<number>>;
    summary:string;
    sentenceArray:Array<string>;
    constructor(ogText:DocumentFragment){
        this.originalText = ogText;
        this.numSentences = 0;
        this.version = "1.0";
        this.versionLink = "https://github.com/tylermerz/addPost/blob/master/autoSummarizer.ts";
        console.log(stopWordsArray);
    }

    summarize():string{
        this.splitParagraphs();
        this.scoreSentences();
        this.compileSummary();
        return this.summary;
    }
    
    /**Splits the total original text into paragraph blocks*/
    splitParagraphs(){
        this.paragraphs = [];
        this.sentenceArray = [];
        this.paragraphsHTML = [];
        let textParagraphs = this.originalText.firstElementChild.getElementsByTagName("p");
        for (var i =0;i< textParagraphs.length;i++){
            let sentences = textParagraphs[i].innerText.split(/[.!?] /);
            this.paragraphsHTML.push(textParagraphs[i].innerHTML.split(/[.!?] /));
            this.paragraphs.push(sentences);
            this.sentenceArray = this.sentenceArray.concat(sentences);
            this.numSentences+=sentences.length;
        }
    }

    /**fills out the weight matrix with similarity scores for each pair of sentences */
    scoreSentences(){
        let sentenceNumber = 0;
        this.weightMatrix = [];
        for (var i = 0;i < this.numSentences;i++){
            this.weightMatrix.push(new Array(this.numSentences));
        }
        this.paragraphs.forEach((paragraph,parNumber)=>{
            paragraph.forEach((sentence)=>{
                this.sentenceArray.forEach((testSentence,testSentenceNum)=>{
                    this.weightMatrix[sentenceNumber][testSentenceNum] = this.scoreSentencePair(sentence,testSentence);
                });
                sentenceNumber++;
            });
        });
        console.log(this.weightMatrix)
    }
    scoreSentencePair(s1:string,s2:string):number{
        //split into words based on spaces and punctuation
        let s1Words = s1.toLowerCase().split(/[,;:/—–]? /);
        let s2Words = s2.toLowerCase().split(/[,;:/—–]? /);
        let s2WordsSet = new Set(s2Words);
        let score = s1Words.filter((word)=>s2WordsSet.has(word)).length;
        return 2 * score/(s1Words.length+s2Words.length);
    }
    compileSummary(){
        //find the highest score sentence in each paragraph
        let firstSentence = 0;
        this.summary = "<p>";
        this.paragraphs.forEach((paragraph,paragraphNum)=>{
            let lastSentence =firstSentence + paragraph.length;
            let sentenceMatrix = this.weightMatrix.slice(firstSentence,lastSentence);
            let bestScore = sentenceMatrix.map((row)=>{
                return Math.max(...row);
            });
            console.log(bestScore)
            let overallBestScore = Math.max(...bestScore);
            let bestSentenceIndex = bestScore.findIndex((score)=>{return score===overallBestScore});
            let bestSenence = this.paragraphsHTML[paragraphNum][bestSentenceIndex];//add the HTML version 
            console.log(bestSentenceIndex)
            console.log(bestSenence)
            this.summary=this.summary+bestSenence+" ";

            firstSentence+=paragraph.length;
        });

        this.summary = this.summary +"</p><p><em>Summarized by <a href='"+this.versionLink+"'>autoSummarizer "+this.version+"</a></em></p>";
        
    }
}