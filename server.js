const express = require("express");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

axios.request({

    url: "https://apnews.com/",
    method: "GET"

}).then((response) => {

    //console.log(response.data);

    //Summary - a short summary of the article

    //* URL - the url to the original article

    //* Feel free to add more content to your database(photos, bylines, and so on).

    const $ = cheerio.load(response.data);

    $("h1").each((i, element) => {

        let title = $(element).text();

        console.log(`${title}\n`);

    });

    $("div.content").each((i, element) => {

        let desc = $(element).text();

        console.log(`${desc}\n`);

    });

    $("span.byline").each((i, element) => {

        let byline = $(element).text();

        console.log(`${byline}\n`);

    });

    

}).catch((err) => {

    console.log(err);

});

