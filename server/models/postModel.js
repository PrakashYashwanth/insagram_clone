const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  caption: { type: String, required: true },
  imageUrl: { type: String, required: true },
  comments: [
    {
      text: { type: String },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
  ],
  likes: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
