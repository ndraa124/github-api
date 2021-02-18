const express = require('express')
const router = express.Router()
const config = require('../config/api.config')
const axios = require('axios')

router.get('/github/callback', function (_req, res, _next) {
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
