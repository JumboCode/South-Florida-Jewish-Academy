#!/bin/bash
heroku git:remote -a sfjaforms
git push heroku `git subtree split --prefix sfja master`:master --force

