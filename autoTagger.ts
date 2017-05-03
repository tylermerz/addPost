let stopWordsArray = require("./stopWords.json");
let stopWordsSet = new Set(stopWordsArray);


export default class autoTagger{
    originalText:DocumentFragment;
    frequencyTable:Object;
    frequencyArray:Array<Object>;
    text:Array<string>;
    constructor(ogText:DocumentFragment){
        this.originalText = ogText;
        this.frequencyTable = {};
        this.frequencyArray = [];
    }
    autoTag():Array<string>{
        let tags: Array<string>;
        tags = [];
        this.parseText();
        this.removeStopWords();
        tags = this.getTopTags();


        return tags;
    }
    parseText(){
        this.text = []
        let paragraphs = [];
        let textParagraphs = this.originalText.firstElementChild.getElementsByTagName("p");
        for (var i =0;i< textParagraphs.length;i++){
            let words = textParagraphs[i].innerText.toLowerCase().split(" ");
            words.forEach(word=>{
                if (this.frequencyTable[word]===undefined){//never seen this word
                    this.frequencyTable[word] = 1;
                } else{
                    this.frequencyTable[word] = this.frequencyTable[word]+1;
                }
            });
        }
    }
    removeStopWords(){
        Object.keys(this.frequencyTable).forEach(key=>{
            if (!stopWordsSet.has(key)){//not a stop word
                this.frequencyArray.push({[key]:this.frequencyTable[key]});
            }
        })
    }

    getTopTags():Array<string>{
        this.frequencyArray.sort((a,b)=>{
            return Object.values(b)[0] - Object.values(a)[0]
        });
        let topWordsObject = this.frequencyArray.slice(0,10);
        let topWords = []
        topWordsObject.forEach(obj=>{
            topWords.push(Object.keys(obj)[0]);
        })
        return topWords;
    }


}