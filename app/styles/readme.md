Initially I was using the fonts directly from Google Fonts (.woff) but it turns out their own browser - Chrome - cannot render
their own fonts propperly in Windows ( https://code.google.com/p/chromium/issues/detail?id=137692 ) so I had to host and convert the fonts myself following this guides: 
http://www.dev-metal.com/fix-ugly-font-rendering-google-chrome/
http://www.fontspring.com/blog/smoother-web-font-rendering-chrome

Web-font converter: http://www.fontsquirrel.com/tools/webfont-generator

Notice the hack to make Google Chrome use .svg !

Downside: If you print to a PDF when rendering with SVG you wont be able to select or search the PDF text.