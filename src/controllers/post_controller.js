import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
import Post from '../models/post.js';


//const JWT_SECRET = process.env.JWT_SECRET; // Replace with your own secret key
const JWT_SECRET = 'test'; // Replace with your own secret key


function storeCurrentDate(expirationAmount, expirationUnit) {
    // Get the current date and time in Asia/Manila timezone
    const currentDateTime = moment.tz("Asia/Manila");
    // Calculate the expiration date and time
    const expirationDateTime = currentDateTime.clone().add(expirationAmount, expirationUnit);

    // Format the current date and expiration date
    const formattedExpirationDateTime = expirationDateTime.format('YYYY-MM-DD');

    // Return both current and expiration date-time
    return formattedExpirationDateTime;

}


export const create_post = asyncHandler(async (req, res) => {
    try {
        const { title, content, category, array_tags } = req.body;
        // Check if all required fields are provided
        if (!title || !content || !category || !array_tags) {
            return res.status(400).json({ error: "Please provide all fields (title, content, category, array_tags)." });
        }

        const newPost = new Post({
            title: title,
            content: content,
            category: category,
            tags: array_tags,
            created_at: storeCurrentDate(0, 'hours'),
            updated_at: storeCurrentDate(0, 'hours'),
        });

        await newPost.save();

        return res.status(200).json({ messsage : 'Post successfully created.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create post.' });
    }
});

export const get_all_post = asyncHandler(async (req, res) => {    
    try {
        const term = req.query.term;
        const filter = term
        ? {
            $or: [
                { title: { $regex: term, $options: 'i' } },
                { content: { $regex: term, $options: 'i' } },
                { category: { $regex: term, $options: 'i' } },
            ],
            }
        : {};

        const posts = await Post.find(filter);

        return res.status(200).json({ data: posts });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all todo lists.' });
    }
});




export const get_specific_post = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params; // Get the meal ID from the request parameters
        const post = await Post.findById(id);
        
        if (!post) return res.status(404).json({ error: 'Post not found' });

        res.status(200).json({ data: post });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific post.' });
    }
});


export const update_post = asyncHandler(async (req, res) => {    
    try {
        const { id } = req.params; // Get the meal ID from the request parameters
        const { title, content, category, array_tags } = req.body;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        if (!title || !content || !category || !array_tags) {
            return res.status(400).json({ error: "All fields are required: title, content, category, array_tags." });
        }

         post.title = title;
         post.content = content;
         post.category = category;
         post.tags = array_tags;
         post.updated_at = storeCurrentDate(0, 'hours');

        await post.save();

        return res.status(200).json({ data: post });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update post.' });
    }
});


export const delete_post = asyncHandler(async (req, res) => {    
    try {
        const { id } = req.params; // Get the meal ID from the request parameters
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        await post.deleteOne();

        return res.status(200).json({ message: 'Post successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete post.' });
    }
});


