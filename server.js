const express = require("express");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

axios.request({

    url: "https://apnews.com/",
    method: "GET"

}).then((response) => {

    //console.log(response.data);

    const $ = cheerio.load(response.data);

    $("h1").each((i, element) => {

        let title = $(element).text();

        console.log(title);

    });

}).catch((err) => {

    console.log(err);

});

