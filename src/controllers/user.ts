import { Request, ResponseToolkit } from '@hapi/hapi';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UserModel } from '../models/user';

export const index = async (req: Request, h: ResponseToolkit) => {
    return h.response('This page is Homepage').code(200);
};

export const signup = async (req: Request, h: ResponseToolkit) => {
    try {
        const { email, password, confirmPassword }: { email: String, password: String, confirmPassword: String } = req.payload;

        // const { error } = signUpUserValidation.validate(user);
        // if (error) {
        //     return {
        //         success: false,
        //         msg: error,
        //         payload: null,
        //     };
        // };

        const checkEmail = await UserModel.findOne({ email });
        if (checkEmail) {
            return h.response({
                success: false,
                msg: 'Email existed!',
                payload: null,
            }).code(400);
        };
        if (password !== confirmPassword) {
            return h.response({
                success: false,
                msg: 'Confirm password incorrect!',
                payload: null,
            }).code(400);
        };

        const hashPassword: String = bcrypt.hashSync(password, 10);

        const newUser = await new UserModel({
            ...req.payload,
            password: hashPassword,
        }).save();

        return h.response({
            success: true,
            msg: 'Signup successfully!',
            payload: newUser,
        }).code(200);
    } catch (error) {
        return h.response(error).code(500);
    }
};

export const signin = async (req: Request, h: ResponseToolkit) => {
    try {
        const { email, password } = req.payload;
        const checkEmail = await UserModel.findOne({ email });
        if (!checkEmail) {
            return h.response({
                success: false,
                msg: 'Email invalid!',
                payload: null,
            }).code(400);
        };

        const checkPassword = await bcrypt.compare(password, checkEmail.password);
        if (!checkPassword) {
            return h.response({
                success: false,
                msg: 'Password incorrect!',
                payload: null,
            }).code(400);
        }

        const token: String = await jwt.sign({ userId: checkEmail._id }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRESIN_TOKEN });
        return h.response({
            success: true,
            msg: 'Sign in successfully!',
            payload: token,
        }).code(200);
    } catch (error) {
        // return h.response(error).code(500);
        console.log(error)
    }
}

export const updateUser = async (req: Request, h: ResponseToolkit) => {
    try {
        const checkUser = await UserModel.findOne({ _id: req.params.userId });
        if (!checkUser) {
            return h.response({
                success: false,
                msg: 'Not found user!',
                payload: null,
            }).code(400);
        }

        const user = await UserModel.findByIdAndUpdate(req.params.userId, { $set: req.payload }, { new: true });
        return h.response({
            success: true,
            msg: 'Update user successfully!',
            payload: user,
        }).code(200);

    } catch (error) {
        return h.response(error).code(500);
    }
};

export const getUser = async (req: Request, h: ResponseToolkit) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        // console.log(req.auth.credentials.user)
        if (!user) {
            return {
                success: false,
                msg: 'Not found1111!',
                payload: null
            }
        }
        return {
            success: true,
            msg: 'Get a user successfully!',
            payload: user,
        };
    } catch (error) {
        return h.response(error);
    }
};

export const getUsers = async (req: Request, h: ResponseToolkit) => {
    try {
        const users = await UserModel.find();
        if (!users.length) {
            return {
                success: false,
                msg: 'No have any user!',
                payload: null
            }
        }
        return {
            success: true,
            msg: 'Get list user successfully!',
            payload: users,
        };
    } catch (error) {
        return h.response(error);
    }
};

export const deleteUser = async (req: Request, h: ResponseToolkit) => {
    try {
        const checkUser = await UserModel.findOne({ _id: req.params.userId });
        if (!checkUser) {
            return {
                success: false,
                msg: 'No have any user!',
                payload: null
            }
        }
        const user = await UserModel.deleteOne({ _id: req.params.userId });
        if (user.deletedCount == 0) {
            return {
                success: false,
                msg: 'Delete fail!',
                payload: null
            }
        }
        return {
            success: true,
            msg: 'Deleted a user successfully!',
            payload: null,
        };
    } catch (error) {
        return h.response(error);
    }
};