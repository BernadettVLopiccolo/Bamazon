var mysql = require("mysql");
var inquirer = require("inquirer");
var idChoice = [];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
});


inquirer.prompt([{
    name: "command",
    message: "Menu options: ",
    type: "list",
    choices: [{
        name: "View Product for sale."
    }, {
        name: "View Low Inventory."
    }, {
        name: "Add to Inventory."
    }, {
        name: "Add new Product."
    }]
}]).then(function(answer) {
    if (answer.command === "View Product for sale.") {
        viewProduct();
    } else if (answer.command === "View Low Inventory.") {
        viewInventory();
    } else if (answer.command === "Add to Inventory.") {
        addInventory();
    } else if (answer.command === "Add new Product.") {
        addProduct();
    }
    // connection.end();
});


function viewProduct() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.log(results);


    });

}

function viewInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, results) {
        if (err) throw err;
        console.log(results);
    });

}

function addInventory() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.log(results);
        inquirer.prompt([{
                name: "id",
                type: "input",
                message: "What is the id of the item you would like to Update?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many units would you like to add to the stock?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function(answer) {
            var chosenId;
            var chosenQuantity = answer.quantity;
            for (var i = 0; i < results.length; i++) {
                if (results[i].id === parseInt(answer.id)) {
                    chosenId = results[i];


                    connection.query("UPDATE products SET ? WHERE ?", [{
                                stock_quantity: parseInt(answer.quantity) + chosenId.stock_quantity
                            },
                            {
                                id: parseInt(answer.id)
                            }
                        ],
                        function(err) {
                            if (err) throw err;
                            console.log("You have successfully updated the chosen Product!");
                            connection.end();
                        }
                    );
                }

            }

        });

    });

}

function addProduct() {
    inquirer.prompt([{
        name: "product_name",
        type: "input",
        message: "Name your Product."
    }, {
        name: "department_name",
        type: "input",
        message: "Name your Department."
    }, {
        name: "price",
        type: "input",
        message: "Add Price."
    }, {
        name: "stock_quantity",
        type: "input",
        message: "Add Quantity.",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }]).then(function(answer) {
        connection.query("INSERT INTO products SET ?", {
                product_name: answer.product_name,
                department_name: answer.department_name,
                price: answer.price,
                stock_quantity: answer.stock_quantity
            },
            function(err, results) {
                if (err) throw err;
                console.log("Your product has been added.");
            });

    });

}



