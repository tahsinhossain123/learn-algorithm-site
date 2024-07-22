const Zeno = require('../../zeno');
const slideshow = require('../../slideshow');

var source = 
`const graph = { // 0 [
	A: ["B", "F"],
	B: ["E"],
	C: ["A", "D"],
	D: [],
	E: ["A"],
	F: ["D", "C"]
}; // ] 0

const visited = new Set(); // 1

function dfs(node, visited, graph) { // 2
	if (visited.has(node)) { // 3
		return; // 4
	}
	visited.add(node); // 5
	const neighbors = graph[node]; // 6
	for (const neighbor of neighbors) { // 7
		dfs(neighbor, visited, graph); // 8
	} 
}

dfs("A"); // 10

console.log(visited); // 11`;

const zeno = new Zeno();
const $ = zeno.proxy;

$.graph = { 
	A: ["B", "F"],
	B: ["E"],
	C: ["A", "D"],
	D: [],
	E: ["A"],
	F: ["D", "C"]
}; 
$(0);

$.visited = new Set();
$(1);

const dfs = $("dfs", 2, ["node", "^visited", "^graph"], () => {
	if ($.if(_ => $.visited.has($.node), 3, () => {
		return [4, undefined];
	})) { return; }
	$.visited.add($.node);
$(5);
	$.neighbors = $.graph[$.node];
$(6);
	if ($.rangedFor("neighbor", $.neighbors, 7, () => {
		dfs(8, $.neighbor, $.visited, $.graph);
		$(8);
	})) { return; }
	return [9, undefined];
});

dfs(10, "A", $.visited, $.graph);
$(10);

$.log($.visited);
$(11);

if (process.argv[3] === "print") {
	$.print();
} else if (process.argv[3] === "concise") {
	$.printConcise();
} else {
	slideshow(zeno, source);
}
