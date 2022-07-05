const express = require('express');
const app = express();
const {TwitterApi} = require('twitter-api-v2')
const dotenv  = require('dotenv').config(); 
const mongoose = require('mongoose');
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(process.cwd()+"/twitter-crawler-front/dist/angular-nodejs-example/"));

const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.ACCESS_TOKEN_KEY,
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

mongoose.connect("mongodb://localhost:27017/twitter");

const twittSchema = {
    created_at: String,
    author_id: String,
    public_metrics: { type : Array , "default" : [] },
    twitt_text: String,
    twitt_id: String
}

const searchSchema = {
    keyword: String,
    search_result : { type : Array , "default" : [] },
    total_results: Number,
    total_likes: Number,
    timestamp: String
};

const Search = mongoose.model("Search", searchSchema);

function calculateTotalLikes(tweets) {
    let total_likes = 0;
    tweets.forEach(function(tweet) {
        total_likes += tweet['public_metrics']['like_count']
    });
    return total_likes
}

function datesAreValid(start_time,end_time) {
    const current_time = new Date();
    const time_limit = new Date(current_time);
    time_limit.setDate(time_limit.getDate() - 7);

    let result = {
        "status": true,            
        "message": ""
    };
    if ((start_time > current_time) || (end_time > current_time)) {
        result['message'] = "Can't provide data for future date";
        result['status'] = false;
        return result; 
    }

    if (end_time <= start_time) {
        result['message'] = "End_time should be greater than the start_time";
        result['status'] = false;
        return result;
    }

    if((start_time < time_limit) || (end_time < time_limit)) {
        result['message'] = "Twitter API can provide data only for the last 7 days";
        result['status'] = false;
        return result;
    }
    return result;
}

app.post('/search',  async (req, res) => {
    let {keyword,start_time,end_time} = req.body ;

    const tweet_fields = ['author_id','created_at','id','public_metrics']
    const date_validation = datesAreValid(new Date(start_time),new Date(end_time));
    if (!date_validation['status']) {
        return res.status(400).json({
            "reason": date_validation['message']
        }); 
    }

    const jsTweets = 
        await client.v2.search(keyword,
        {
            'start_time':start_time,
            'max_results' : 100, //limitation due to student auth
            'end_time':end_time,
            'tweet.fields':tweet_fields
        });    

    //timestamp format    RFC 3339
    let data = jsTweets['_realData']['data'] 
    for (i = 0; i < data.length; i++) {
        const author = await client.v2.user(data[i]['author_id'], { 'user.fields': ['profile_image_url'] });
        delete data[i]['author_id'];
        data[i]['author'] = author;
    }     

    const search_schema = new Search ({
        keyword: keyword,
        search_result: data,
        total_results: data.length,
        total_likes: calculateTotalLikes(data),
        timestamp: new Date().toISOString() //should be replaced by request timestamp
    });

    search_schema.save();
    return res.status(200);
})


app.get('/search/:id', async (req, res) => {
    const id = req.params.id;
    Search.findById(id, function (err, result) {
        if (err){
            return res.status(400).json({message:"Not found"})
        }
        else{
            return res.status(200).json(result)
        }
    });
})

app.get('/search', async (req, res) => {
    var search_result = [];
    Search.find({}, function(err, searches) {
        searches.forEach(function(search) {
            search_result.push({
                search_id: search['_id'],
                keyword:search['keyword'],
                search_result:search['search_result'],
                total_results:search['total_results'],
                total_likes:search['total_likes'],
                timestamp:search['timestamp']
            })
        });
        return res.status(200).json(search_result);
    });
})

app.get('/', (req,res) => {
    res.sendFile(process.cwd()+"/twitter-crawler-front/dist/angular-nodejs-example/index.html")
});

var server = app.listen(3080, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
})

