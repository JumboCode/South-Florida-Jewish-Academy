# South Florida Jewish Academy - Form Administration
[![Build Status](https://travis-ci.org/JumboCode/South-Florida-Jewish-Academy.svg?branch=master)](https://travis-ci.org/JumboCode/South-Florida-Jewish-Academy)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/JumboCode/South-Florida-Jewish-Academy)
## Welcome
Welcome to the South Florida Jewish Academy project, a project run through [Tufts JumboCode](https://www.jumbocode.org). Here are some steps to get you started.
## The team
Current team members:
- PM: [Lawrence Chan](https://www.github.com/chanlawrencet) (he/him/his)
- Developer: [Anthony Tranduc](https://github.com/Antranduc) (he/him/his)
- Developer: [Janny Huang](https://github.com/jhuang09) (she/her/hers)
- Developer: [Jacqueline Chin](https://github.com/jchin01) (she/her/hers)
- Developer: [Talia Kee](https://github.com/taliakee) (she/her/hers)
- Developer: [Trisha Cox](https://github.com/trish234) (she/her/hers)
- Developer: [Viet Nguyen](https://github.com/vietnguyen00) (he/him/his)
- Designer: [Kianie Ramirez](https://github.com/kianie413) (she/her/her)
- Developer: [Hally Bello](https://github.com/BadCubozoa) (she/her/hers)

Former team members:
- Developer: [Victoria Tran](https://github.com/victoriatran) (she/her/hers)
- Developer: [Max Ramer](https://github.com/mjramer) (he/him/his)

## Recommended software
- [PyCharm](https://www.jetbrains.com/pycharm/) (.edu license)
- [WebStorm](https://www.jetbrains.com/webstorm/?fromMenu) (.edu license) or [VSCode](https://code.visualstudio.com) (free)
- [Postman](https://www.getpostman.com) (free)
- [Robo3t](https://robomongo.org/download) (no need for fancy studio verison)
- [SourceTree](https://www.sourcetreeapp.com) (free)

## Building the project
- MongoDB (database)
- React (frontend, JavaScript)
- Flask (backend, Python)

### Easy Setup
1. Terminal window 1: `sh startDatabase.sh`
2. Terminal window 2: `sh startBackend.sh`
3. Terminal window 3: `sh startFrontend.sh`

### Database Priming
It's necessary to make sure everyone's on the same database version (because people will be adding collections). This makes it necessary for us to reset our databases when we pull new code. This is now as easy as a Python script!
1. Open your terminal and execute `startDatabase.sh`: `sh startDatabase.sh`
2. Open up another terminal window and execute `resetDatabase.py`: `python3 resetDatabase.py`

### Details
#### Backend
We're using `venv` to contain requirements and keep track of the packages we're using. Name your environment `backendEnv` inside `/api/`, so you don't need to change your `.gitignore`.

```
cd api
python3 -m venv backendEnv
source backendEnv/bin/activate
pip install -r requirements.txt
python3 run.py
```
To deactivate the environment:
```
deactivate
```
#### Frontend
```
cd sfja
yarn start
```

#### Database
We're using MongoDB as our database to hold our data and need an instance of the database running for you to develop locally. For easy version control, the following will initialize an instance of `mongod` and direct it to `/database` for database read/writes. Open this up in a new window and keep this as your "mongod window". It's possible to run it in the background... but it's easy to accidentally leave open too long!
```
mongod --dbpath ./database
```
To stop the database:
``
^c
``
## Contributing
We're using issue trackers on GitHub to track the issues and stories as they come up and through during the sprint.

### Making a Branch
Make branches with Sourcetree or on the command line. If you're on the command line:
```
git checkout master
git pull
git checkout -b SFJA-02
```
This will go to our master branch, pull the latest version, and `checkout` (switch) to a new branch (in this case `SFJA-02`).

Make your branches the same name as the ticket # you're working on.
> Issue #2 is on branch SFJA-02

### Committing
Commit early and often on your feature branch! Commit with the help of SourceTree (I'll give instructions) or through the command line.
```
git add .
git commit -m "#2, added a comment"
git push
```
If git tells you to do something like:
```
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin SFJA-2
```
Just run the command they specify and you should be good to go.

#### Commit messages
Your commit message should A) reference the issue and B) be meaningful.

### Pull Requests
Think your code is good to go? Great! Let's just get someone to take a look at it before it gets merged with the master branch.

 - Go to the GitHub page
 - If you don't see your recently updated branch, go to the `branches` tab and find your branch.
 - Click on `compare and make pull request`
 - Here, you can compare the branches -- your branch vs a specified branch (usually `master`)
 - If you're good to go, title the PR (Pull Request) with the ticket # and name it the same name as the ticket name.
 - Enter in corresponding information, including what you did and what your reviewer can do to test it
 - `Create Pull Request`
 - Select who you want to review your code!

### Linting
We're using linting on at least our frontend code. Thus, when you're in the sfja dir, run `yarn lint` to see what errors our linter might be giving you. WebStorm helps with this by underlining some things with yellow text. Then, run `yarn lint --fix` to try to see if the linter can automatically fix the code. PRs can't be merged until it passes the tests (which includes linting), so be sure to lint your code!

### Packages
#### Backend Packages
Our backend is build in Python, which we will use packages for. Remember that we're running the backend to our app in a `venv` that we're calling `backendEnv`. So, we need to update the `requirements.txt` as necessary to accomodate new packages. You can tell if you need to update `requirements.txt` if A) the build fails or B) you need to `pip install [package]` to get your feature working. Either way, run the following command:
```
pip freeze > requirements.txt
```
This will update our requirements to make sure everyone's all on track.
