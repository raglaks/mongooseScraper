const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  
  headline: {
    type: String,
    required: true,
    unique: true
  },
  
  url: {
    type: String,
    required: true
  },

  desc: {
    type: String,
    required: true
  },
  
  comments: [

    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }

  ]

});


const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;