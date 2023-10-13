const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose")
const _ = require("lodash")

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs")

mongoose.connect("mongodb+srv://shivamsinghror9190:testing1990@cluster0.jb9nulu.mongodb.net/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });


let workItems = [];


const itemsSchema = mongoose.Schema({
    name: String
})
const Item = mongoose.model("Item", itemsSchema)
const item1 = new Item({
    name: "Basketball"
})
const item2 = new Item({
    name: "volleyball"
})
const item3 = new Item({
    name: "Football"
})


const ListSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", ListSchema)

const defaultItems = [item1, item2, item3]
// Item.insertMany(defaultItems)
//     .then(() => {
//         console.log("all items saved successfully.")
//     })
//     .catch((err) => {
//         console.log(err)
//     })
app.get("/", function (req, res) {
    Item.find({})
        .then((foundItems) => {
            res.render("list", { listTitle: "Today", newListItems: foundItems })
        })
        .catch((err) => {
            console.log(err)
        })


});

app.post("/", function (req, res) {
    const newItem = req.body.newItem
    const listName = req.body.list
    const item = new Item({
        name: newItem
    })

    if (listName === "Today") {
        item.save()
        res.redirect("/")
    }else{
        List.findOne({name: listName})
        .then((listFound)=>{
            listFound.items.push(item)
            listFound.save();
            res.redirect("/"+listName)
        })
    }
})

app.post("/delete", function (req, res) {
    const deleteItemID = req.body.checkbox
    const listName = req.body.listName

    if(listName==="Today"){
        Item.findByIdAndRemove(deleteItemID)
        .then(() => {
            console.log("item deleted successfully.")
            res.redirect("/")
        })
        .catch((err) => {
            console.log(err)
        })
    }else{
        List.findOneAndUpdate({name: listName},{$pull:{items:{_id:deleteItemID}}})
        .then(()=>{
            res.redirect("/"+listName)
        })
    }
    
})

app.get("/work", function (req, res) {
    res.render("list", { listTitle: "WorK ItemS", newListItems: workItems })
});

app.get("/:head", function (req, res) {
    const heading = _.capitalize(req.params.head)

    List.findOne({ name: heading })
        .then((exist) => {
            if (exist) {
                console.log("list already exits.")
                res.render("list", { listTitle: exist.name, newListItems: exist.items })

            } else {
                const list = new List({
                    name: heading,
                    items: defaultItems
                })
                list.save();
                console.log("doesn't exist")
                res.redirect("/" + heading)
            }
        })
        .catch((err) => {
            console.log(err)
        })
})

app.post("/work", function (req, res) {
    let item = req.body.newItem;
    workItems.push(item);
});


app.get("/about", function (req, res) {
    res.render("about")
})
app.listen(2000);