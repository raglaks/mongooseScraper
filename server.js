const express = require("express");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

axios.request({

    url: "https://apnews.com/apf-intlnews",
    method: "GET"

}).then((response) => {

    console.log(response.data);

    //Summary - a short summary of the article

    //* URL - the url to the original article

    //* Feel free to add more content to your database(photos, bylines, and so on).

    const $ = cheerio.load(response.data);

    $("h1").each((i, element) => {

        let title = $(element).text();

        console.log(`TITLE: ${title}\n`);

    });

    $("p").each((i, element) => {

        let desc = $(element).text();

        console.log(`DESC: ${desc}\n`);

    });

    $("a.headline").each((i, element) => {

        let lenk = $(element).attr("href");

        console.log(`LENK: ${lenk}\n`);

    });

    

}).catch((err) => {

    console.log(err);

});

