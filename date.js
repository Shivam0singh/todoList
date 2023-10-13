exports.printDate = function()  {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }
    return today.toLocaleDateString("en-US", options)
}

exports.printDay = function(){
    let today = new Date();
    let options ={
        weekday : "long",
    }

    return today.toLocaleDateString("en-US", options)
}