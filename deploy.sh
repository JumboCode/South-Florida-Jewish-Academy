heroku git:remote -a sfjaforms
git subtree push --prefix sfja heroku master
heroku git:remote -a api-sfjaforms
git subtree push --prefix api heroku master

