const express = require('express');
const app = express();

require('es6-promise').polyfill();
require('isomorphic-fetch');

function getStars(owner, name, cb) {
  fetch('https://api.github.com/repos/' + owner + '/' + name)
    .then(function(res) {
      if (res.status >= 400) {
        throw new Error('Bad response from server');
      }
      return res.json();
    })
    .then(function(back) {
      cb(back.stargazers_count);
    });
}

app.get('/text/:owner/:repo', function(req, res) {
  const repo_owner = req.params.owner;
  const repo_name = req.params.repo;

  getStars(repo_owner, repo_name, function(back) {
    res.status(200).send(back.toString());
  });
});

app.get('/json/:owner/:repo', function(req, res) {
  const repo_owner = req.params.owner;
  const repo_name = req.params.repo;

  getStars(repo_owner, repo_name, function(back) {
    res.json({
      owner: repo_owner,
      name: repo_name,
      stars: back
    });
  });
});

app.listen(1234, function() {
  console.log('Server is running on *:1234');
});
