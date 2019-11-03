#!/bin/bash
heroku git:remote -a api-sfjaforms
git subtree push --prefix api heroku master

