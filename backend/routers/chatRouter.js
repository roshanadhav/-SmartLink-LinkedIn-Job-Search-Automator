import express from 'express' ; 


const chatRouter = express.Router({mergeParams:true}) ; 



chatRouter.route('/').post((req,res)=>{
    res.json({
        sucess : true 
    })
})


export default chatRouter ; 