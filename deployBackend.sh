#!/bin/bash
heroku git:remote -a api-sfjaforms
git push heroku `git subtree split --prefix api master`:master --force

