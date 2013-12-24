gamell.io
=========

A template for your online resume / portfolio

This work is distributed under the MIT License.

Description
-----------

This is a plain HTML, JS and CSS website which I use as my resume and portfolio online at http://gamell.io

You can use it "as is", parts of it, modify it, get inspiration etc.

Usage
-----

I used `yeoman`, `grunt` and `bower` to create and develop this project. You should have <a href="http://nodejs.org/">NodeJS</a>, <a href="https://npmjs.org/">npm</a> and <a href="http://yeoman.io/">yeoman</a> to run this project locally.

Once you have all the above installed, you just have to run:

    npm install

followed by

    grunt server


The previous command will boot up the development server on your localhost using the "app" configuration (nothing is concatenated or minified, this is the configuration you want to use to develop and test locally).

Once you are done coding and you are happy with the outcome you can run

    grunt build

Which by default will build the minified, uglified, optimized version of the site in the dist/ directory.

Furthermore, if you want to push directly to your FTP host of choice, you can do so by editing the `Grunt.js` file ( editing the ftpush section) and creating a `.ftpush` file in your root directory. You can find more information here: https://github.com/inossidabile/grunt-ftpush

Libraries used and inspiration
------------------------------


