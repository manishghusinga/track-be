var router = require("express").Router();
var db = require('../db/db');
var ObjectId = require("mongodb").ObjectId;

router.post('/signup', (req, res) => {
    let { name, email, password } = req.body;
    if (!email || !name || !password) {
        return res.send({
            success: false,
            msg: "please enter all details"
        });
    }

    let data = {
        name,
        email,
        password,
        userId: ObjectId().toString(),
        token: ObjectId().toString()
    }

    db.getCollection("users").findOne({ email }).then((item) => {
        if (!item) {
            db.getCollection("users").insertOne({ ...data }).then(resp => res.send({ token: data.token }))
        } else {
            return res.send({ success: false, msg: "user alraedy exit" })
        }
    })
})


router.post('/login', (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.send({
            success: false,
            msg: "please enter all details"
        });
    }

    db.getCollection("users").findOne({ email }).then((data) => {
        if (!data) {
            return res.send({
                success: false,
                msg: "user not found"
            })
        }

        if (data && data.password === password) {
            return res.send({
                success: true,
                token: data.token
            })
        }

        return res.send({
            success: false,
            msg: "passsword is wrong"
        })
    })
})


router.get("/userList", (req, res) => {
    db.getCollection("users")
        .find()
        .toArray(function (err, docs) {
            if (err) {
                return res.send({
                    success: false,
                    mmsg: "something wend wrong"
                })
            }

            return res.send({
                success: true,
                data: docs
            })
        })
})

router.post("/updateUser", (req, res) => {
    let { id } = req.query;
    let { name, email } = req.body;
    let payload = {};

    if (name) {
        payload.name = name;
    }

    if (email) {
        payload.email = email
    }

    db.getCollection("users").findOne({ userId: id }).then((item) => {
        if (!item) {
            return res.send({ success: false, msg: "invalid user" })
        }

        db.getCollection('users')
            .updateOne({ userId: id }, { $set: { ...payload } })
            .then(_ => {
                return res.send({
                    success: true,
                    msg: "data has been updated"
                })
            })
            .catch(error => {
                console.log(error)
                return res.send({
                    success: false,
                    msg: "something went wrong"
                })
            })

    })
});

router.get("/delete", (req, res) => {
    let { id } = req.query;

    db.getCollection("users").findOne({ userId: id }).then((item) => {
        if (!item) {
            return res.send({ success: false, msg: "invalid user" })
        }


        db.getCollection("users").deleteOne({ userId: id }).then(_ => {
            return res.send({
                success: true,
                msg: "use removed"
            })
        })
            .catch(err => {
                console.log(err)
                return res.send({
                    success: false,
                    msg: "not removed something went wrong"
                })
            })

    })
});

module.exports = router;