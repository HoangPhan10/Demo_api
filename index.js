const express = require("express");
const port = 4000;
const cors = require("cors");

const app = express();
const fs = require("fs");
const { json } = require("express");

app.use(express.json());
app.use(cors());
const users = require("./users.json");
const evaluates = require("./evaluates.json");

function root() {
    const data = JSON.stringify(users, null, 2);
    fs.writeFile("users.json", data, (err, data) => {
        if (err) throw err;
    });
}

function root2() {
    const data = JSON.stringify(evaluates, null, 2);
    fs.writeFile("evaluates.json", data, (err, data) => {
        if (err) throw err;
    });
}

app.get("/", (req, res) => {
    res.send(users);
});

app.get("/users/:id", (req, res) => {
    const user = users.find((c) => {
        return c.id === parseInt(req.params.id);
    });
    if (!user) res.status(404).send(`Not found id:${req.params.id}`);
    return res.send(user);
});

app.get("/user/order/:id/:index", (req, res) => {
    const user = users.find((el) => {
        return el.id === parseInt(req.params.id);
    });
    if (user) {
        if (user.order[parseInt(req.params.index)]) {
            user.order.splice(parseInt(req.params.index), 1);
            root();
            return res.send(user);
        }
        return res.send("Not found index");
    }
    return res.send("Not found id");
});

app.get("/user/:id/:index", (req, res) => {
    const user = users.find((el) => {
        return el.id === parseInt(req.params.id);
    });
    if (user) {
        if (user.addresses[parseInt(req.params.index)]) {
            user.addresses.splice(parseInt(req.params.index), 1);
            root();
            return res.send(user);
        }
        return res.status(404).send("Not found");
    }
    return res.status(404).send("Not found");
});

app.get("/user/cart/:id/:index", (req, res) => {
    const user = users.find((el) => {
        return el.id === parseInt(req.params.id);
    });
    if (user) {
        if (user.cart[parseInt(req.params.index)]) {
            user.cart.splice(parseInt(req.params.index), 1);
            root();
            return res.send(user.cart);
        }
        return res.status(404).send("Not found");
    }
    return res.status(404).send("Not found");
});

app.get("/evaluates", (req, res) => {
    res.send(evaluates);
});
app.get("/evaluates/:id", (req, res) => {
    const evaluate = evaluates.find((el) => el.id === req.params.id);
    if (evaluate) {
        return res.send(evaluate);
    }
    return res.send("Not found");
});
app.get("/users/cart/:id", (req, res) => {
    const user = users.find((el) => {
        return el.id === parseInt(req.params.id);
    });
    if (user) {
        user.cart = [];
        root();
        return res.send(user);
    }
    return res.send("hhhh");
});

/////////////////////////////////////////POST//////////////////////////////////
app.post("/create/user", (req, res) => {
    const user = {
        id: users.length + 1,
        email: req.body.email,
        password: req.body.password,
        fullName: {},
        addresses: [],
        order: [],
        cart: [],
    };
    users.push(user);
    res.send(users);
    root();
});

app.post("/user/:id", (req, res) => {
    const user = users.find((el) => {
        return el.id === parseInt(req.params.id);
    });
    if (user) {
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.password) {
            user.password = req.body.password;
        }
        if (req.body.firstName) {
            user.fullName.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
            user.fullName.lastName = req.body.lastName;
        }
        if (req.body.displayName) {
            user.fullName.displayName = req.body.displayName;
        }
        if (req.body.name) {
            user.addresses.push({
                id: user.addresses.length + 1,
                name: req.body.name,
                phone: req.body.phone,
                addressHome: req.body.addressHome,
            });
        }
        if (req.body.namePrd) {
            const findCart = user.cart.find((el) => {
                return el.img === req.body.img;
            });
            if (!findCart) {
                user.cart.push({
                    namePrd: req.body.namePrd,
                    price: req.body.price,
                    img: req.body.img,
                    quantity: req.body.quantity,
                    total: req.body.total,
                    url: req.body.url,
                });
            } else {
                findCart.quantity = req.body.quantity;
                findCart.total = req.body.total;
            }
        }
        if (
            req.body.code &&
            req.body.totalPrd &&
            req.body.day &&
            req.body.addressDelivery &&
            req.body.order &&
            req.body.payment
        ) {
            user.order.push({
                status: "Đang xử lý",
                code: req.body.code,
                totalPrd: req.body.totalPrd,
                day: req.body.day,
                addressDelivery: req.body.addressDelivery,
                nameProduct: req.body.order,
                payment: req.body.payment,
            });
        }
        root();
        return res.send(user);
    }
    return res.send("Not found");
});

app.post("/evaluates/:id", (req, res) => {
    const evaluate = evaluates.find((el) => el.id === req.params.id);
    if (evaluate) {
        const newComment = {
            user: req.body.user,
            comment: req.body.comment,
            rate: req.body.rate,
        };
        evaluate.comments.push(newComment);
        root2();
        return res.send(evaluate);
    }
    return res.send("Not found");
});

app.post("/user/:id/:index", (req, res) => {
    const user = users.find((el) => {
        return el.id === parseInt(req.params.id);
    });
    if (user) {
        if (user.addresses[parseInt(req.params.index)]) {
            if (req.body.name) {
                user.addresses[parseInt(req.params.index)].name = req.body.name;
            }
            if (req.body.phone) {
                user.addresses[parseInt(req.params.index)].phone = req.body.phone;
            }
            if (req.body.addressHome) {
                user.addresses[parseInt(req.params.index)].addressHome =
                    req.body.addressHome;
            }
            root();
            return res.send(user);
        }
        return res.send("Not Found");
    }
    return res.send("Not found");
});

app.listen(port, () => console.log(`Listening on port ${port} `));