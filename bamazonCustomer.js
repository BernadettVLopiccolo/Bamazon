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
	if(err) throw err;
	console.log("connected");
	startBuying();
});

function startBuying() {
	connection.query("SELECT * FROM products", function(err, results) {
          if(err) throw err;
          console.log(results);
	inquirer.prompt([{
		name: "id",
		type: "input",
		message: "What is the id of the item you would like to buy?"
	},
	{
		name: "quantity",
		type: "input",
		message: "How many of the product would you like to buy?",
		validate: function(value) {
			if(isNaN(value) === false) {
				return true;
			}
			return false;
		}
	}]).then(function(answer) {
		var chosenId;
		for (var i = 0; i < results.length; i++) {
			if(results[i].id === parseInt(answer.id)) {
				chosenId = results[i];
			}
		}

		if (chosenId.stock_quantity > answer.quantity) {
			var newQuantity = chosenId.stock_quantity - answer.quantity;
             console.log("newQuantity", newQuantity);
				connection.query(
			"UPDATE products SET ? WHERE ?",
			[
			{
				stock_quantity: newQuantity
			},
			{
				id: parseInt(answer.id)
			}
			],
			function(err) {
				if(err) throw err;

			});
		var totalCost = chosenId.price * answer.quantity;
		console.log("Your total ammount is: " + totalCost);
	} else {
		console.log("Sorry, we are out of stock!");
	}
	connection.end();
	});
})
}

