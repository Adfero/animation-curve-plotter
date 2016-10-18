#!/bin/bash

git clone -b gh-pages git@github.com:Adfero/animation-curve-plotter.git _site
grunt dist
cp -R public/* _site/
cd _site
git add .
git commit -am 'Publishing build'
git push origin gh-pages
cd ../
rm -rf _site
