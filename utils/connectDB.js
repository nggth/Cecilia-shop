import mongoose from 'mongoose'

const connectDB = () => {
    if(mongoose.connections[0].readyState) {
        console.log('Already connected.')
        return
    }
    mongoose.connect(process.env.MONGO_URL, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, err => {
        if(err) throw err
        console.log('Connect to mongodb.')
    })
}

export default connectDB