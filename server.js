const express = require("express");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

let heads = [];

let blurbs = [];

let urls = [];

axios.request({

    url: "https://apnews.com/apf-intlnews",
    method: "GET"

}).then((response) => {

    const $ = cheerio.load(response.data);

    $("h1").each((i, element) => {

        let title = $(element).text();

        // console.log(`TITLE: ${title}\n`);

        // console.log(i);

        heads.push(title);

    });

    $("div.content").each((i, element) => {

        let desc = $(element).children("p").text();

        // console.log(`DESC: ${desc}\n`);

        // console.log(i);

        blurbs.push(desc);

    });

    $("a.headline").each((i, element) => {

        let lenk = $(element).attr("href");

        console.log(`LENK: ${lenk}\n`);

        // console.log(i);

        urls.push(lenk);

    });

    heads.splice(0, 1);

    console.log(heads.length);

    console.log(blurbs.length);

    console.log(urls.length);

}).catch((err) => {

    console.log(err);

});

