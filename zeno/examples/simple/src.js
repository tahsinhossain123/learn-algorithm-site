// SECTION 0
const people = [
	["John", 15],
	["Jane", 13],
	["Mike", 20],
	["Sara", 18],
	["Tom", 25],
	["Lily", 11],
	["Bob", 30],
	["Alice", 17],
	["Eve", 31],
	["Adam", 19]
];

// SECTION 1
const adults = [];
const children = [];

for (let i = 0; i < people.length; ++i) { // SECTION 2
	// SECTION 3
	const person = people[i];
	const [name, age] = person;

	if (age >= 18) { // SECTION 4
		// SECTION 5
		adults.push(name);
	} else {
		// SECTION 6
		children.push(name);
	}
}

// SECTION 7
adults.sort();
children.sort();

console.log({ adults, children });
