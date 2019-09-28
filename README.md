# South-Florida-Jewish-Academy

## Welcome
Welcome to the South Florida Jewish Academy project, a project run through Tufts JumboCode. Here are some steps to get you started.
## The team
- PM: [Lawrence Chan](https://www.github.com/chanlawrencet) (he/him/his)
- Developer: [Anthony Tranduc](https://github.com/Antranduc) (he/him/his)
- Developer: [Trisha Cox](https://github.com/trish234) (she/her/hers)
- Developer: [Talia Kee](https://github.com/taliakee) (she/her/hers)
- Developer: [Janny Huang](https://github.com/jhuang09) (she/her/hers)


## Recommended software
- [PyCharm](https://www.jetbrains.com/pycharm/) (.edu license)
- [WebStorm](https://www.jetbrains.com/webstorm/?fromMenu) (.edu license) or [VSCode](https://code.visualstudio.com) (free)
- [Postman](https://www.getpostman.com) (free)
- [Robo3t](https://robomongo.org/download) (no need for fancy studio verison)
- [SourceTree](https://www.sourcetreeapp.com) (free)

## Building the project
The project sits inside a docker container that houses:
- MongoDB (database)
- React (frontend, JavaScript)
- Flask (backend, Python)

### Backend
We're using `venv` to contain requirements and keep track of the packages we're using. Name your environment `backendEnv` inside `/api/`, so you don't need to change your `.gitignore`.

```
cd api
python3 -m venv backendEnv
source backendEnv/bin/activate
pip install -r requirements.txt
python3 run.py
```

### Frontend
```
cd sfja-admin
yarn start
```

### Database
You need to prime your local database to get it going.
... more to come soon!

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

### Packages
#### Backend Packages
Our backend is build in Python, which we will use packages for. Remember that we're running the backend to our app in a `venv` that we're calling `backendEnv`. So, we need to update the `requirements.txt` as necessary to accomodate new packages. You can tell if you need to update `requirements.txt` if A) the build fails or B) you need to `pip install [package]` to get your feature working. Either way, run the following command:
```
pip freeze > requirements.txt
```
This will update our requirements to make sure everyone's all on track.
