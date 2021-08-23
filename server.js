'use strict'
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const server = express();
server.use(cors());
server.use(express.json());
const PORT = process.env.PORT
const { default: axios } = require('axios');
mongoose.connect('mongodb://localhost:27017/hatem', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const drinkSchema = mongoose.Schema({
    drinkName: String,
    drinkImg: String

})


const ownerSchema = mongoose.Schema({
    userEmail : String,
    drinks: [drinkSchema]
})

const ownerModel= mongoose.model('drink',ownerSchema)








function getAllDrinksHandler(req, res) {
    axios
        .get('https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic')
        .then(result => {
            const newArr = result.data.drinks.map((drink, idx) => {
                return new Drinks(drink)
            })
            res.send(newArr)
        })
}



function addDrinkHandler(req,res) {
    const {userEmail, drinkObj} = req.body
    ownerModel.findOne({userEmail:userEmail}, (err,result) => {
        if (err) {console.log(err)}
        else if (!result) {
            const newOwner = new ownerModel({
                userEmail:userEmail,
                drinks:[drinkObj]
            })
            newOwner.save()
        }
        else {
            result.drinks.unshift(drinkObj)
            result.save()
        }
    })
}



function getFavDrinksHandler(req,res) {
const {userEmail} = req.query
ownerModel.findOne({userEmail:userEmail}, (err,result) => {
    if (err) {console.log(err)}
    else {
        res.send(result.drinks)
    }
})
}


function deleteDrinkHandler(req,res) {
    console.log('delete')
    const {idx} = req.params
    const {userEmail} = req.query
    ownerModel.findOne({userEmail:userEmail}, (err,result) => {
        if (err) {console.log(err)}
        else {
            console.log(`before ${result.drinks} `)
            result.drinks.splice(idx,1)
            result.save().then(() =>{
                ownerModel.findOne({userEmail:userEmail}, (err,result) => {
                    if (err) {console.log(err)}
                    else {
                        console.log(`after ${result.drinks} `)
                        res.send(result.drinks)
                    }
                })
            })
        }
    })
}


function updateDrinkHandler(req,res) {
    console.log('update')
    const {idx} = req.params
    const {userEmail , drinkObj} = req.body
    ownerModel.findOne({userEmail:userEmail}, (err,result) => {
        if (err) {console.log(err)}
        else {
            result.drinks[idx]= drinkObj
            result.save().then(() =>{
                ownerModel.findOne({userEmail:userEmail}, (err,result) => {
                    if (err) {console.log(err)}
                    else {
                        res.send(result.drinks)
                    }
                })
            })
        }
    })
}








class Drinks {
    constructor(drink) {
        this.drinkName = drink.strDrink
        this.drinkImg = drink.strDrinkThumb
    }
}



// http://localhost:3010/allDrinks
// http://localhost:3010/addDrink
// http://localhost:3010/favDrinks
// http://localhost:3010/deleteDrink/:idx
// http://localhost:3010/updateDrink/:idx

server.get('/allDrinks', getAllDrinksHandler)
server.post('/addDrink', addDrinkHandler)
server.get('/favDrinks', getFavDrinksHandler)
server.delete('/deleteDrink/:idx', deleteDrinkHandler)
server.put('/updateDrink/:idx', updateDrinkHandler)


server.listen(PORT, () => {
    console.log('listening to PORT', PORT)
})













































































// const drinkSchema = new mongoose.Schema({
//     drinkName: String,
//     drinkImg: String
// });

// const ownerSchema = new mongoose.Schema({
//     userEmail: String,
//     drinks: [drinkSchema]
// });

// const ownerModel = mongoose.model('drink', ownerSchema);


// function updateDrinkHandler(req,res) {
//     const { idx } = req.params;
//     const { userEmail, drinkObj } = req.body;
//     ownerModel.findOne({ userEmail: userEmail }, (err, result) => {
//         if (err) { console.log(err) }
//         else {
//             result.drinks[idx] = drinkObj
//             result.save().then(() => {
//                 ownerModel.findOne({ userEmail: userEmail }, (err, result) => {
//                     if (err) console.log(err);
//                     else {
//                         console.log(result)
//                         res.send(result.drinks);
//                     }
//                 });

//             })
//         }

//     });

// }

// function deleteDrinksHandler(req, res) {
//     const { idx } = req.params;
//     const { userEmail } = req.query;
//     ownerModel.findOne({ userEmail: userEmail }, (err, result) => {
//         if (err) { console.log(err) }
//         else {
//             result.drinks.splice(idx, 1);
//             result.save().then(() => {
//                 ownerModel.findOne({ userEmail: userEmail }, (err, result) => {
//                     if (err) console.log(err);
//                     else {
//                         console.log(result)
//                         res.send(result.drinks);
//                     }
//                 });

//             })
//         }

//     });
// };







// const userDrinksHandler = (req, res) => {
//     const { userEmail } = req.query;
//     console.log(userEmail)
//     ownerModel.findOne({ userEmail: userEmail }, (err, result) => {
//         if (err) console.log(err);
//         else {
//             console.log(result)
//             res.send(result.drinks);
//         }
//     });
// };







// function addDrinkHandler(req, res) {
//     const { userEmail, drinkObj } = req.body;
//     ownerModel.findOne({ userEmail: userEmail }, (err, result) => {
//         if (err) console.log(err)
//         else if (!result) {
//             const newOwner = new ownerModel({
//                 userEmail: userEmail,
//                 drinks: [drinkObj]
//             });
//             newOwner.save()
//         } else {

//             result.drinks.unshift(drinkObj);
//             result.save();
//             console.log(result)
//         }
//     })
// }





// function getAllDrinksHandler(req, res) {
//     const url = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic'
//     axios
//         .get(url)
//         .then(result => {
//             res.send(result.data.drinks)
//         })

// }



// // http://localhost:3010/allDrinks
// // http://localhost:3010/addDrink
// // http://localhost:3010/deleteDrink/:idx
// // http://localhost:3010/updateDrink/:idx
// server.get('/allDrinks', getAllDrinksHandler)
// server.post('/addDrink', addDrinkHandler)
// server.get('/favDrinks', userDrinksHandler)
// server.delete('/deleteDrink/:idx', deleteDrinksHandler)
// server.put('/updateDrink/:idx', updateDrinkHandler)









// server.listen(PORT, () => {
//     console.log(`listing to port ${PORT}`);
// });
