const express = require('express')
const app = express()
const fetch = require('node-fetch')
const Sequelize = require("sequelize")
require('dotenv').config()
const port = 8888

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var sequelize = new Sequelize("etsy", "root", "password", {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
})

const EtsyItem = sequelize.define("etsyItem", {
    listing_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
    },
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    url: Sequelize.STRING,
    num_favorers: Sequelize.INTEGER,
    // TODO: create separate table for these since etsy returns arrays
    // tags: Sequelize.STRING,
    // taxonomy_path: Sequelize.STRING
}, {
    timestamps: false
})

// EtsyItem.sync()

// note i'm limiting the results to 5
const listingsUrl = `https://openapi.etsy.com/v2/listings/active?api_key=${process.env.API_KEY}&limit=5`

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
            EtsyItem.create({
                listing_id: listing.listing_id,
                title: listing.title,
                description: listing.description,
                // tags: listing.tags,
                url: listing.url,
                num_favorers: listing. num_favorers,
                // taxonomy_path: listing.taxonomy_path,
            }).then((results) => {
                console.log('db results: ', results);
            })

            // listingsToSeed.push({
            //     listing_id: listing.listing_id,
            //     title: listing.title,
            //     description: listing.description,
            //     tags: listing.tags,
            //     url: listing.url,
            //     num_favorers: listing. num_favorers,
            //     taxonomy_path: listing.taxonomy_path,
            // })
        })
        // console.log('listingsToSeed array: ', listingsToSeed)
    })
    .catch(err => console.log('err: ', err))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})