import { Schema, model, Model, Document } from 'mongoose';

export interface IUser extends Document {
    fullName: String,
    email: String,
    password: String,
    background: String,
    isActive: Boolean,
}

const UserSchema = new Schema<IUser>({
    fullName: String,
    email: String,
    password: String,
    background: String,
    isActive: { type: Boolean, default: false },
}, { timestamps: true });

export const UserModel = model<IUser>('user', UserSchema);


// export interface User extends Document {
//     fullName: String,
//     email: String,
//     password: String,
//     background: String,
//     isActive: Boolean,
// }

// const UserSchema: Schema = new Schema({
//     fullName: String,
//     email: String,
//     password: String,
//     background: String,
//     isActive: { type: Boolean, default: false },
// }, { timestamps: true });

// export const UserModel: Model<User> = model('user', UserSchema);