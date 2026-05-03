const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb://fullstack:${password}@ac-3mirjoe-shard-00-00.dmq73pm.mongodb.net:27017,ac-3mirjoe-shard-00-01.dmq73pm.mongodb.net:27017,ac-3mirjoe-shard-00-02.dmq73pm.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-6q8dev-shard-0&authSource=admin&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// Only password → list all entries
if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((p) => {
      console.log(p.name, p.number);
    });
    mongoose.connection.close();
  });
}

// Password + name + number → add entry
if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({ name, number });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
