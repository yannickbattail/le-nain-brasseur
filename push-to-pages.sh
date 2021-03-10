#!/bin/bash

cp -R . ../le-nain-brasseur-bkp-main
git checkout pages
rm -Rf ./*
cp -Rf ../le-nain-brasseur-bkp-main/* ./
git add --all
git commit
git push
git checkout main --force

rm -Rf ../le-nain-brasseur-bkp-main