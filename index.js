require("dotenv").config()
const axios = require("axios")
const mongoose = require("mongoose")

mongoose.set({ 'strictQuery': false })
mongoose.connect(process.env.DATA_BASE_LINK, {
    useNewUrlParser: true
})
    .then(() => console.log(`DataBase is connected`))
    .catch((err) => console.log(err))

const token = "T3rfvtgbhnjm345yhdfdhhdhhdhjjskk"
const url1 = "http://134.209.159.245:7000/match-list"
const url2 = "http://134.209.159.245:7000/match-data"


//* Fetch Data from Match-List and store appropriate in Database
async function data1(url1, token) {
    const matchList = await axios.get(`${url1}?token=${token}`)
    // console.log(data1.data.result.result.filter((ele)=>(ele["sportId"] == "4")).map((ele)=>({eventName : ele.eventName, eventId : ele.eventId, marketId : ele.marketId})));
    const finalData = matchList.data.result.result
        .filter((ele) => (ele["sportId"] == "4"))
        .map((ele) => ({
            eventName: ele.eventName,
            eventId: ele.eventId,
            marketId: ele.marketId
        }))

    const dataCollectionSchema = new mongoose.Schema({}, { strict: false })
    const dataCollection = mongoose.model("Data1", dataCollectionSchema)
    const dataCollectionContent = new dataCollection({ data: finalData })
    await dataCollectionContent.save()
}
data1(url1, token)


//* Call match list api in every Ten minutes
setInterval(function(url1,token){
    axios.get(`${url1}?token=${token}`)
 }, 1000*60*10)


 //* Fetch Data using marketId and console appropriate field 
const marketId = "1.208011707"
async function data2(url2, marketId, token) {
    const matchData = await axios.get(`${url2}/${marketId}?token=${token}`)
    const diamond = matchData.data.result[marketId]
    const json = diamond.diamond
    const obj = JSON.parse(json)
    console.log(obj.data.t3
        .map((ele) => ({
            NAT: ele.nat,
            SID: ele.sid,
            MID: ele.mid
        })));
}
data2(url2, marketId, token)