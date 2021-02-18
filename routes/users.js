const express = require('express')
const router = express.Router()
const config = require('../config/api.config')
const axios = require('axios')
let token = null

router.get('/', (_req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${config.githubClient}&scopes=repo%20write:org&state=something-random`)
})

router.get('/github/callback', function (req, res, _next) {
  const body = {
    client_id: config.githubClient,
    client_secret: config.githubSecret,
    code: req.query.code
  }

  const opts = { headers: { accept: 'application/json' } }
  axios.post(`https://github.com/login/oauth/access_token?client_id=${body.client_id}&client_secret=${body.client_secret}&code=${body.code}`, body, opts)
    .then(res => {
      console.log(res.data.access_token)
      token = res.data.access_token
    })
    .then(() => {
      console.log('My token:', token)
      res.json({
        ok: 1,
        token: token
      })
    })
    .catch(err => res.status(500).json({ message: err.message }))
})

router.get('/github', function (_req, res, _next) {
  axios({
    method: 'get',
    url: `https://api.github.com/users/${config.githubUsername}`,
    headers: {
      Authorization: `Bearer ${config.githubToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.mercy-preview+json'
    }
  }).then(response => {
    res.status(200).send({
      success: true,
      message: 'Success',
      result: {
        login: response.data.login,
        githubId: response.data.id,
        avatar: response.data.avatar_url,
        email: response.data.email,
        name: response.data.name,
        location: response.data.location
      }
    })
  }).catch(err => {
    res.send(err)
  })
})

module.exports = router
