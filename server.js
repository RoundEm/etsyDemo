const express = require('express')
const app = express()
const fetch = require('node-fetch')
const port = 8888

const keystring = '094cu0zpz075n15ievgsdxa7'
// note i'm limiting the results to 5
const listingsUrl = `https://openapi.etsy.com/v2/listings/active?api_key=${keystring}&limit=5`
const sharedSecret = 'efdthsapsh'

const listingsToSeed = []

// i'm just fetching the data directly to keep things simple 
// but you could also setup an express route to hit the api
fetch(listingsUrl)
    .then(res => res.json())
    .then(({ results }) => {
        results.forEach(listing => {
            // here I'm just pushing to the local array but you could
            // also add your post calls to YOUR api here or just to get started
            // you can setup your db connection and just post these
            // straight to the db using sequelize
            listingsToSeed.push({
                listing_id: listing.listing_id,
                title: listing.title,
                description: listing.description,
                tags: listing.tags,
                url: listing.url,
                num_favorers: listing. num_favorers,
                taxonomy_path: listing.taxonomy_path,
            })
        })
        console.log('listingsToSeed array: ', listingsToSeed)
    })
    .catch(err => console.log('err: ', err))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})