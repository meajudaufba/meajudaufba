# meajudaufba

"Me ajuda, UFBA!" is a node.js application intended to extract data from [SIAC](https://siac.ufba.br/SiacWWW/Welcome.do) and show it in a better interface with more features. :)

You can try the version 0.1.2 here: [http://meajudaufba.dygufa.com/](http://meajudaufba.herokuapp.com/).

## Development

If you are interested in colaborating with this project or if you are just curious about you have two options to "easily" run this code:

### For both

1. Download this repo: `git clone https://github.com/Eowfenth/Alumni.git meajudaufba`
2. Go into it: `cd meajudaufba`
3. Create a .env file with your enviroment variables using .env.example as example. 

### Without Docker (recommended)

After you have accomplished the steps above if you don't already have it you will need to [install node.js](https://nodejs.org/en/download/package-manager/). Once you have node.js and npm as well:

1. Run `npm install`
2. Run `npm start` to run in "production" mode
3. Or `npm dev` to run in "development mode" using webpack-dev-server.

### Developing using Docker 

As you may have seen, we have a Dockerfile on the repo. It means that you can:

1. If you are already on the meajudaufba directory you first need to build an docker image: `docker build -t meajudaufba .`
2. Then you can run using: `docker run -p 8090:8090 --env-file ./.env meajudaufba`. In this case .env defines PORT as 8090.

In order to make your life easier to debug while you make modifications on files you can use the option --volume (on docker run) to link your "real code" directory with the "container code" directory.


## Todos

- ~~Verify response on login method to certify the user is indeed logged (right credentials);~~
- ~~Rewrite client application using React.~~
- Improve interface with material design or similar
- Implement a dashboard, a score page and a 
teacher approval rate page.
- Make a hotsite for root path