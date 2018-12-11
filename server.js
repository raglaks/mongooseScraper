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

    //console.log(response.data);

    const $ = cheerio.load(response.data);

    $("div.FeedCard").each((i, element)=> {

        let impDiv = $(element).children("div.CardHeadline");

        let head = $(impDiv).children("a.headline");

        let link = $(head).attr("href");

        let title = $(head).children("h1").text();

        console.log(`\nTITLE: ${title}\n\nLINK: ${link}\n`);

    });

    //headlines
    $("h1").each((i, element) => {

        let title = $(element).text();

        // console.log(`TITLE: ${title}\n`);

        // console.log(i);

        heads.push(title);

    });

    //blurbs
    // $("div.content").each((i, element) => {

    //     let desc = $(element).children("p").text();

    //     console.log(`DESC: ${desc}, ${i}\n`);

    //     blurbs.push(desc);

    // });

    //links
    $("a.headline").each((i, element) => {

        let lenk = $(element).attr("href");

        //console.log(`LENK: ${lenk}\n`);

        // console.log(i);

        urls.push(lenk);

        // const reg = /\/afs:Content:/g;

        // if (reg.test(lenk) === true) {

        //     urls.push("PHOTOS");

        // } else {

        //     urls.push(lenk);

        // }

    });

    heads.splice(0, 1);

    // console.log(`\nHEADLINES (${heads.length}):\n ${heads}`);

    // console.log(`\nBLURBS (${blurbs.length}):\n ${blurbs}`);

    // console.log(`\nURLS (${urls.length}):\n ${urls}`);

}).catch((err) => {

    console.log(err);

});

