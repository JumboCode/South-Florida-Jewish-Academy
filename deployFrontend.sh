#!/bin/bash
heroku git:remote -a sfjaforms
git subtree push --prefix sfja heroku master

