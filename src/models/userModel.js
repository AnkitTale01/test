const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    first_name: {
        type: String, trim: true, default: ''
    },
    last_name: {
        type: String, trim: true, default: ''
    },
    email: {
        type: String,
        trim: true,
         default: ''
    },
    birth_date: {
        type: String, trim: true,
        trim: true,
        default: ''
    },
    country_code: {
        type: String,
        trim: true,
        default: ""
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    height: {
        type: String,
        trim: true,
        default: ''
    },
    gender: {
        type: String,
        trim: true,
        // enum: ['male', 'female', 'other']
    },
    image: {
        type: String,
        default: ''
    },
    // image:{
    //    type: Schema.Types.ObjectId, ref: 'image',
    // },
    weight: {
        type: String,
        trim: true,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    marital_status: {
        type: String,
        enum: ['Married', 'Single', 'Widowed', 'Divorced']
    },
    looking_for: {
        type: String,
        enum: ['male', 'female', 'both']
    },
    about: {
        type: String,
        default: ''
    },
    managedBy: {
        type: String,
        default: 'self'
    },
    mother_tongue: {
        type: String
    },
    marriage_plan: {
        type: String
    },
    created_by: {
        type: String,
        enum: ['admin', 'self'],
        default: 'self'
    },
    token: {
        type: String,
        default: ''
    },
    otp: {
        type: Number,
        default: 0
    },

    zodiac_sign: {

        type: Schema.Types.ObjectId, ref: 'keys'
        // enum: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    },
    education_level: {

        type: Schema.Types.ObjectId, ref: 'keys'
        // enum: ['Bachelors', 'In College', 'High School', 'Phd', 'In Grad School', 'Masters', 'Trade School']
    },
    covid_vaccine: {

        type: Schema.Types.ObjectId, ref: 'keys'
        // enum: ['vaccinated', 'unvaccinated', 'prefer_not_to_say']
    },
    health: {
        type: Schema.Types.ObjectId, ref: 'keys',
    },
    personality_type: {
        type: Schema.Types.ObjectId, ref: 'keys',
    },
    pets: {
        type: Schema.Types.ObjectId, ref: 'keys'
        // enum:['Dog','Cat','Reptile','Amphibian','Bird','Fish','Don't have but love','other','turtle','Hamster','Rabbit','Pet-free','All the pets','Want a pet','Allergic to pets'],
    },
    drinking: {
        type: Schema.Types.ObjectId, ref: 'keys'
        // enum:['Not for me','Sobar','Sobar curious','on special occasions','Socially on weekends','Most Nights'],
    },
    smoking: {
        type: Schema.Types.ObjectId, ref: 'keys'
        // enum:['Social smoker','Smoker when drinking','Non-smoker','Smoker','Trying to quit'],
    },
    workout: {
        type: Schema.Types.ObjectId, ref: 'keys'
        //    enum:['Everyday','Often','Sometimes','Never'],
    },
    dietary_preference: {
        type: Schema.Types.ObjectId, ref: 'keys'
        //enum:['Vegan','Vegetarin','Pescatarian','Kosher','Halal','Carnivore','Omnivore','Other'],
    },
    religion: {
        type: String,
        default: ''
        // enum:['hindu','sikh','jain','muslim','christian','budhist','doesnt matter']
    },
    caste: {
        type: String,
        default: ''
    },
    social_media: {
        type: Schema.Types.ObjectId, ref: 'keys'
        //  enum:['Influencer','Socially active','Off the grid','Passive scroller'],
    },
    sleeping_habits: {
        type: Schema.Types.ObjectId, ref: 'keys'
        // enum:['Early bird','Night owl','In a spectrum'],
    },
    job_title: {
        type: String,
        default: ''
    },
    company: {
        type: String,
        default: ''
    },
    education: {
        type: String,
        default: ''
    },
    is_Blocked: {
        type: Boolean,
        default: false
    },
    is_suspended: {
        type: Boolean,
        default: false
    },
    social_id: {
        type: Object
    },
    social_platform: {
        type: String
    },
    is_location: {
        type: Boolean,
        default: false
    },
    plan: {
        type: String,
        default: 'Free'
    },
    location: {
        type: Object,
        default: {}
    },
    security_question: {
        type: String
    },
    security_answer: {
        type: String
    },
    minAge: {
        type: Number,
        default: 18
    },
    maxAge: {
        type: Number,
        default: 50
    },
    minHeight: {
        type: Number,
        default: 4
    },
    maxHeight: {
        type: Number,
        default: 7
    },
    is_online: {
        type: Boolean,
        default: false
    },
    is_showOnCard: {
        type: Boolean,
        default: true
    },
    goGlobel: {
        type: Boolean,
        default: false
    },
    go_incognito: {
        type: Boolean,
        default: false
    },
    show_people_in_range: {
        type: Boolean,
        default: false
    },
    username: {
        type: String
    },
    is_age: {
        type: Boolean,
        default: true
    },
    is_height: {
        type: Boolean,
        default: true
    },
    is_weight: {
        type: Boolean,
        default: true
    },
    is_smoke: {
        type: Boolean,
        default: true
    },
    is_drink: {
        type: Boolean,
        default: true
    },
    is_diet: {
        type: Boolean,
        default: true
    },
    is_verified: {
        type: Number,
        default: 0
    },
    is_email: {
        type: Boolean,
        default: false
    },
    is_push: {
        type: Boolean,
        default: false
    },
    is_photo_option: {
        type: Boolean,
        default: false
    },
    save_country: {
        type: String,
        default: ''
    },
    is_Email: {
        type: String,
        default: ""
    },
    is_Phone: {
        type: String,
        default: ""
    },
    voice_record: {
        type: String,
        default: ''
    },
    spotify_username: {
        type: String,
        default: ''
    },
    spotify_id: {
        type: String,
        default: ''
    },
    spotify_playlist: {
        type: Array,
    },
    spotify_artistlist:{
        type :Array
    },
    show_me_online:{
        type:Boolean,
        default: true
    }
},
    { timestamps: true });

userSchema.index({ location: "2dsphere" });

let userModel = mongoose.model('user', userSchema);

module.exports = userModel;