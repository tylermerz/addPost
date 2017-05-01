# addPost
This is a Typescript project that I use to help compose, save, and summarize blog posts that I make on my own personal website.

## Installation and Usage
### Installation
To install this project just clone it from the repo and then use npm to install it. I have implicitly included a reference to the styling file that I use for my [personalWebsite](https://github.com/tylermerz/personalWebsite) (`views/layouts/default.tsx`) to allow for previews in the browser, so change this to whatever your website style requires.

~~~bash
git clone https://github.com/tylermerz/addPost.git
cd addPost
npm install
~~~

After it has been installed with npm, webpack needs to be called to compile the tsx files into a bundled javascript file.

~~~bash
webpack --config addPostwebpack.config.js
~~~
### Usage
Simply open `addPost.html` in your favorite web browswer and start composing. The save and load features save files in your browser's localStorage implementation, so they are not secure. Please don't save anything that is secret/confidential.

The automatic summary feature is a naive implementation of [this tool](https://thetokenizer.com/2013/04/28/build-your-own-summary-tool/) where the first figure element of the post is appended to the end of the summary.
