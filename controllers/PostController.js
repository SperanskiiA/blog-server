import PostModel from '../models/post.js';
import CommentModel from '../models/comment.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    console.log(posts);
    res.json(posts);
  } catch (error) {
    console.log('err from post getAll: ' + error);
    res.status(500).json({
      message: 'Cannot get all posts',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await CommentModel.find({
      post: postId,
    }).exec();

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        $inc: { viewsAmount: 1 },
        commentsAmount: comments.length,
      }
    );
    const newPost = await PostModel.findOne({ _id: postId });
    console.log(newPost);
    res.json(newPost);
  } catch (error) {
    console.log('err from post getOne: ' + error.message);
    res.status(500).json({
      message: 'Cannot get a post',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log('err from post remove: ' + err);
          res.status(500).json({
            message: 'Cannot remove the  post',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Post does not exist',
          });
        }

        res.json({
          success: true,
        });
      }
    );
  } catch (error) {
    console.log('err from post getOne: ' + error);
    res.status(500).json({
      message: 'Cannot get a post',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.split(' '),
      imageUrl: req.body.imageUrl,
      user: req.userId,
      comments: [],
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log('err from post create: ' + error);
    res.status(500).json({
      message: 'Cannot create a new post',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags.split(' '),
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log('err from post update: ' + error);
    res.status(500).json({
      message: 'Cannot update the post',
    });
  }
};

//tag routes
export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log('err from tags getLAst: ' + error);
    res.status(500).json({
      message: 'Cannot get last tags',
    });
  }
};

export const getPostsByTag = async (req, res) => {
  try {
    const tag = req.params.name;
    const posts = await PostModel.find().populate('user').exec();
    const postsByTag = posts.filter((post) => post.tags.includes(tag));

    res.json(postsByTag);
  } catch (error) {
    console.log('err from getPostsByTag: ' + error);
    res.status(500).json({
      message: 'Cannot get posts by tag',
    });
  }
};

//comment controllers
export const getComments = async (req, res) => {
  try {
    const comments = await CommentModel.find()
      .populate('post')
      .populate('user')
      .exec();

    res.json(comments);
  } catch (error) {
    console.log('err from get comments: ' + error);
    res.status(500).json({
      message: 'Cannot get comments',
    });
  }
};
export const getCommentsById = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await CommentModel.find()
      .populate('post')
      .populate('user')
      .exec();
    const commentsForPost = comments.filter(
      (comment) => comment.post.id === postId
    );
    console.log(commentsForPost.length);
    res.json(commentsForPost);
  } catch (error) {
    console.log('err from get comments by id: ' + error);
    res.status(500).json({
      message: 'Cannot get comments for post',
    });
  }
};
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      post: postId,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (error) {
    console.log('error is: ' + error);
  }
};
export const getCommById = async (req, res) => {
  try {
    const commId = req.params.id;
    const comment = await CommentModel.findOne({
      _id: commId,
    })
      .populate('post')
      .populate('user')
      .exec();
    console.log(comment);
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    console.log(commentId);
    CommentModel.findOneAndDelete(
      {
        _id: commentId,
      },
      (err, doc) => {
        if (err) {
          console.log('err from comment remove: ' + err);
          res.status(500).json({
            message: 'Cannot remove the  comment',
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: 'comment does not exist',
          });
        }

        res.json({
          success: true,
        });
      }
    );
  } catch (error) {
    console.log('err from removeComment: ' + error.message);
    res.status(500).json({
      message: 'Cannot get a comm',
    });
  }
};

export const getDataByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const comments = await CommentModel.find({ user: userId })
      .populate('post')
      .populate('user')
      .exec();
    const posts = await PostModel.find({ user: userId })
      .populate('user')
      .exec();
    res.json({ comments, posts });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
