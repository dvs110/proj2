import mongoose from 'mongoose';
const { Schema } = mongoose;
const personSchema = new Schema({
    email: { type: String, required: true, unique: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    password: { type: String, required: true },
    linkedin: { type: String, default: 'Linkedin' },
    github: { type: String, default: 'Github' },
    facebook: { type: String, default: 'Facebook' },
    website: { type: String, default: 'Website' },

});
export default mongoose.model("Car", personSchema);