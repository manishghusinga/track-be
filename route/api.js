var router = require("express").Router();
var db = require('../db/db');

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

    db.getCollection("users").insert({ data }).then(resp => res.send({ token: data.token }))
})


router.post('/login', (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.send({
            success: false,
            msg: "please enter all details"
        });
    }

    db.getCollection("users").fineOne({ email }).then(data => {

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


router.post("/userList", (req, res) => {
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

router.post("/updateUser:id", (req, res) => {
    let { id } = req.params;
    let { name, email } = req.body;
    let payload = {};

    if (name) {
        payload.name = name;
    }

    if (email) {
        payload.email = email
    }

    db.getCollection('users')
        .updateOne({ userId: id }, { $set: { payload } })
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

});

router.post("/delete:id", (req, res) => {
    let { id } = req.params;

    db.getCollection("users").remove({ userId: id }).then(_ => {
        return res.send({
            success: true,
            msg: "use removed"
        })
            .catch(_ => {
                return res.send({
                    success: false,
                    msg: "not removed something went wrong"
                })
            })
    })
});