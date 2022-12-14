import PostModel from '../models/post.js'

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts)
    } catch (error) {
        console.log('err from post getAll: ' + error);
        res.status(500).json({
            message: 'Cannot get all posts'
        })
    }
}


export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate({
            _id: postId,
        }, {
            $inc: { viewsAmount: 1 }
        },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    console.log('err from post getOne: ' + err);
                    return res.status(500).json({
                        message: 'Cannot get a post'
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Post does not exist'
                    })
                }

                res.json(doc)
            })
    } catch (error) {
        console.log('err from post getOne: ' + error);
        res.status(500).json({
            message: 'Cannot get a post'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId
        }, (err, doc) => {
            if (err) {
                console.log('err from post remove: ' + err);
                res.status(500).json({
                    message: 'Cannot remove the  post'
                });
            }
            if (!doc) {
                return res.status(404).json({
                    message: 'Post does not exist'
                });
            }

            res.json({
                success: true
            })
        })
    } catch (error) {
        console.log('err from post getOne: ' + error);
        res.status(500).json({
            message: 'Cannot get a post'
        })
    }
}


export const create = async (req, res) => {
    try {

        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId
        })

        const post = await doc.save();

        res.json(post)
    } catch (error) {
        console.log('err from post create: ' + error);
        res.status(500).json({
            message: 'Cannot create a new post'
        })
    }
}

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
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                user: req.userId
            })

        res.json({
            success: true
        })

    } catch (error) {
        console.log('err from post update: ' + error);
        res.status(500).json({
            message: 'Cannot update the post'
        })
    }
}