import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import moment from 'moment-timezone';
import dotenv from 'dotenv';
import User from '../models/user.js';



function storeCurrentDate(expirationAmount, expirationUnit) {
    // Get the current date and time in Asia/Manila timezone
    const currentDateTime = moment.tz("Asia/Manila");
    // Calculate the expiration date and time
    const expirationDateTime = currentDateTime.clone().add(expirationAmount, expirationUnit);

    // Format the current date and expiration date
    const formattedExpirationDateTime = expirationDateTime.format('YYYY-MM-DD HH:mm:ss');

    // Return both current and expiration date-time
    return formattedExpirationDateTime;
}


function hashConverterMD5(password) {
    return crypto.createHash('md5').update(String(password)).digest('hex');
}



export const create_user = asyncHandler(async (req, res) => {
    const { first_name, middle_name, last_name, password, email } = req.body;
    
    try {
        // Check if all required fields are provided
        if (!first_name || !middle_name || !last_name || !email || !password) {
            return res.status(400).json({ message: "Please provide all fields (email, password, first_name, middle_name, last_name)." });
        }

        if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });


        const hash_password = hashConverterMD5(password);
   
        const newUser = new User({
            first_name: first_name,
            middle_name: middle_name,
            last_name: last_name,
            password: hash_password,
            email: email,
            created_at: storeCurrentDate(0, 'hours'),
        });

        await newUser.save();

        return res.status(200).json({ message: 'New user account successfully created.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create user account.' });
    }
});


export const get_all_user = asyncHandler(async (req, res) => {    
    try {
        const users = await User.find();
        // return res.status(400).json({ message: "Please provide all fields (email, password, fullname)." });

        return res.status(200).json({ data: users });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get all users.' });
    }
});


export const get_specific_user = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const user = await User.findById(id);
   
        res.status(200).json({ data: user });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get specific user.' });
    }
});



export const login_user = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

    try {
        // Check if both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password' });
        }

        // Find the user by email
        let user = await User.findOne({ email: email }); // Don't use .lean() here
        const hash = hashConverterMD5(password);

        // Check if the admin exists and if the password is correct
        if (user && user.password == hash) {
            return res.status(200).json({ data: user });
        }

        return res.status(400).json({ message: 'Wrong email or password.'});
    } catch (error) {
        return res.status(500).json({ error: 'Failed to login ' });
    }
});



export const update_user = asyncHandler(async (req, res) => {    
    const { id } = req.params; // Get the meal ID from the request parameters
    const { first_name, middle_name, last_name, email } = req.body;

    try {
        if (!email || !first_name || !middle_name || !last_name) {
            return res.status(400).json({ message: "All fields are required: email, first_name, middle_name, last_name." });
        }

        const updatedUser = await User.findById(id);
                           
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
                        

        updatedUser.email = email ? email : updatedUser.email;
        updatedUser.first_name = first_name ? first_name : updatedUser.first_name;
        updatedUser.middle_name = middle_name ? middle_name : updatedUser.middle_name;
        updatedUser.last_name = last_name ? last_name : updatedUser.last_name;
                
        await updatedUser.save();

        return res.status(200).json({ data: 'User account successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update user account.' });
    }
});


export const update_user_password = asyncHandler(async (req, res) => {    
    const { id } = req.params; // Get the meal ID from the request parameters
    const { password } = req.body;

    try {
        if (!password) {
            return res.status(400).json({ message: "All fields are required: password." });
        }

        const hash = hashConverterMD5(password);
        const updatedUser = await User.findById(id);
                           
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
                        
        updatedUser.password = password ? hash : updatedUser.password;
                                
        await updatedUser.save();

        return res.status(200).json({ data: 'User password successfully updated.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update user password.' });
    }
});


export const delete_user = asyncHandler(async (req, res) => {    
    const { id } = req.params; // Get the meal ID from the request parameters

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) return res.status(404).json({ message: 'User not found' });

        return res.status(200).json({ data: 'User account successfully deleted.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete user account.' });
    }
});