const machines = [
	"Formatkreissäge",
	"Abrichthobel",
	"Dickenhobel",
];

const orders = [
	{
		id: "S5634",
		label: "Brettspiel-Tisch",
		steps: [
			{name: "Brett zuschneiden", done: true},
			{name: "Brett zuschneiden", done: true},
			{name: "Brett zuschneiden", done: true},
			{name: "Brett zuschneiden", done: true},
			{name: "Brett nuten", done: true},
			{name: "Brett nuten", done: true},
			{name: "Brett CNC fräsen", done: false},
			{name: "Schleifen & Ölen", done: false},
			{name: "Zusammenstecken", done: false},
			{name: "Leimen", done: false},
			{name: "trocknen lassen", done: false},
			{name: "Schaniere schrauben", done: false},
			{name: "Rückwand einschieben", done: false},
			{name: "Knopfe montieren", done: false},
			{name: "In Versand geben", done: false},
		],
		orderDate: "2022-06-30",
		waitingForMachines: [0],
		processingMachines: [0],
		signalStrengths: [
			[0, 0.95],
			[1, 0.2],
			[2, 0.05],
		]
	},
	{
		id: "S5635",
		label: "Brettspiel-Tisch",
		steps: [
			{name: "Brett zuschneiden", done: true},
			{name: "Brett zuschneiden", done: true},
			{name: "Brett zuschneiden", done: true},
			{name: "Brett zuschneiden", done: true},
			{name: "Brett nuten", done: true},
			{name: "Brett nuten", done: true},
			{name: "Brett CNC fräsen", done: false},
			{name: "Schleifen & Ölen", done: false},
			{name: "Zusammenstecken", done: false},
			{name: "Leimen", done: false},
			{name: "trocknen lassen", done: false},
			{name: "Schaniere schrauben", done: false},
			{name: "Rückwand einschieben", done: false},
			{name: "Knopfe montieren", done: false},
			{name: "In Versand geben", done: false},
		],
		orderDate: "2022-06-30",
		waitingForMachines: [],
		processingMachines: [],
		signalStrengths: [
			[0, 0.95],
			[1, 0.05],
			[2, 0.3],
		]
	}
];

let machineStates = [];
for (let i = 0; i < machines.length; i++) {
	machineStates.push({ id: i, active: [], queue: [] });
}

function updateState() {
	for (let i = 0; i < machineStates.length; i++) {
		machineStates[i].active = [];
		machineStates[i].queue = [];
	}

	orders.forEach(order => {
		order.processingMachines.forEach(id => {
			machineStates[id].active.push(order);
		});
		order.waitingForMachines.forEach(id => {
			machineStates[id].queue.push(order);
		});
	});
}

var tableHeaders = document.querySelectorAll("thead > tr");
tableHeaders.forEach(header => {
	header.addEventListener("click", function() {
		let table = this;
		while (table && table.tagName != "TABLE")
			table = table.parentElement;

		if (table)
			table.classList.toggle("collapsed");
	});
});

var machineRows = document.querySelectorAll(".machines tr");
machineRows.forEach(row => {
	row.addEventListener("click", function(e) {
		if (e.target.tagName == "INPUT") return;

		let input = this.querySelector("input");
		input.checked = !input.checked;

		e.preventDefault();
	});
});
