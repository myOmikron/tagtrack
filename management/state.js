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
		label: "Schreibtisch",
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
	},
	{
		id: "S5636",
		label: "Kleiderschrank",
		steps: [
			{name: "Brett zuschneiden", done: true},
			{name: "Brett zuschneiden", done: true},
			{name: "Brett zuschneiden", done: true},
			{name: "Brett zuschneiden", done: false},
			{name: "Brett nuten", done: false},
			{name: "Brett nuten", done: false},
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
		processingMachines: [],
		signalStrengths: [
			[0, 0.95],
			[1, 0.05],
			[2, 0.3],
		]
	},
	{
		id: "S5637",
		label: "Tisch",
		steps: [
			{name: "Brett zuschneiden", done: true},
			{name: "Brett zuschneiden", done: true},
			{name: "Brett zuschneiden", done: true},
			{name: "Brett zuschneiden", done: false},
			{name: "Brett nuten", done: false},
			{name: "Brett nuten", done: false},
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
	},
	{
		id: "S5638",
		label: "Bett",
		steps: [
			{name: "Brett zuschneiden", done: false},
			{name: "Brett zuschneiden", done: false},
			{name: "Brett zuschneiden", done: false},
			{name: "Brett zuschneiden", done: false},
			{name: "Brett nuten", done: false},
			{name: "Brett nuten", done: false},
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
	machineStates.push({ id: i, active: [], queue: [], uptimes: generateUptimes() });
}

function generateUptimes() {
	var ret = [];
	for (let i = 0; i < 7 * 24 + 1; i++) {
		ret.push(Math.random());
	}
	return ret;
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

		/**
		 * @type {HTMLInputElement}
		 */
		let input = this.querySelector("input");
		input.checked = !input.checked;
		input.dispatchEvent(new Event("change"));

		e.preventDefault();
	});
});
