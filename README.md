# AP Scraper

## A full-stack web-app to scrape and store news from the AP website.

This was built for my full-stack web-development bootcamp. It was quite challenging because this was the first assignment that required a full-stack build from scratch. The back-end was done using MongoDB and Mongoose, Express and Node. The front-end was built with Handlebars.js, which I still can't completely wrap my head around. I also used Axios and Cheerio, which are two Javascript libraries meant for web-scraping. 

Overall, I found MongoDB and Mongoose to be straightforward and easy to use. The trickiest part was to "associate" or in this case "populate" my Mongo tables. On the other hand, using Handlebars.js is quite complicated because of how rigid it is. One has to be very careful about how they send back their data—be it in an object, array etc. I spent many hours figuring out the quirks and trying to get the data to display correctly. In the end, I managed to come up with some nifty `if` statements that tested the data and printed HTML elements accordingly. 

Another notable feature is the CRUD functionality of the comments. One can create, edit and delete their comments on any article. This took a while to get right because of the Mongoose `populate` aspect. My articles table stored a reference of ID's to a comments table. But then I learned about the `$pull` method and everything worked.

[Click here to view the site.](https://sleepy-reaches-57444.herokuapp.com/home)

_If you want to run this locally, clone the repo,  run `npm i` and `mongod`._
