const express = require("express");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

let scraped = [];

axios.request({

    url: "https://apnews.com/apf-intlnews",
    method: "GET"

}).then((response) => {

    const $ = cheerio.load(response.data);

    $("div.FeedCard").each((i, element)=> {

        let elem = $(element).children("a.content-container");

        let cont = $(elem).children("div.content");

        let blurb = $(cont).children("p").text();

        let impDiv = $(element).children("div.CardHeadline");

        let head = $(impDiv).children("a.headline");

        let link = $(head).attr("href");

        let title = $(head).children("h1").text();

        // console.log(`\nTITLE: ${title}\n\nLINK: ${link}\n\nELEM: ${blurb}\n`);

        scraped.push({

            headline: title,
            url: link,
            desc: blurb

        });

    });

    console.log(scraped);

}).catch((err) => {

    console.log(err);

});

