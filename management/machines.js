(function () {
	/**
	 * @type { HTMLCanvasElement }
	 */
	const canvas = document.getElementById("auslastung");
	const context = canvas.getContext("2d");

	var current = new Array(7 * 24 + 1);
	var target = new Array(7 * 24 + 1);
	for (let i = 0; i < target.length; i++) {
		target[i] = 0;
		current[i] = 0;
	}

	let contentWidth = 0;
	let contentHeight = 0;

	const paddingTop = 16;
	const paddingLeft = 32;
	const paddingBottom = 24;
	const paddingRight = 16;
	const bottomTextOffset = 8;

	var isRedrawing = false;
	function redraw() {
		isRedrawing = true;
		const width = canvas.width;
		const height = canvas.height;

		context.resetTransform();
		context.clearRect(0, 0, width, height);
		context.translate(0.5, 0.5);

		context.font = '12px "Noto Kufi", sans-serif';

		context.beginPath();
		context.moveTo(paddingLeft, paddingTop);
		context.lineTo(paddingLeft, height - paddingBottom);
		context.lineTo(width - paddingRight, height - paddingBottom);
		context.strokeStyle = "#000";
		context.lineWidth = 1;
		context.stroke();

		context.beginPath();
		context.textAlign = "right";
		context.textBaseline = "bottom";
		context.fillText("100%", paddingLeft, paddingTop);
		context.fill();

		context.beginPath();
		context.textAlign = "right";
		context.textBaseline = "alphabetic";
		context.fillText("0%", paddingLeft, height - paddingTop);
		context.fill();

		context.beginPath();
		context.textAlign = "left";
		context.textBaseline = "hanging";
		context.fillText("-7d", paddingLeft, height - paddingBottom + bottomTextOffset);
		context.fill();

		context.beginPath();
		context.textAlign = "right";
		context.textBaseline = "hanging";
		context.fillText("jetzt", width - paddingRight, height - paddingBottom + bottomTextOffset);
		context.fill();

		contentWidth = width - paddingLeft - paddingRight;
		contentHeight = height - paddingTop - paddingBottom;
		context.translate(paddingLeft, paddingTop);

		for (let i = 0; i < target.length; i++) {
			target[i] = 0;
		}

		let totalCount = 0;
		for (let i = 0; i < machineStates.length; i++) {
			const s = machineStates[i];
			if (selectedMachines[i]) {
				totalCount++;
				for (let i = 0; i < target.length; i++) {
					target[i] += s.uptimes[i];
				}
			}
		}

		let same = true;
		for (let i = 0; i < target.length; i++) {
			target[i] = Math.round(target[i] / Math.max(1, totalCount) * 100);

			let d = target[i] - current[i];
			if (Math.abs(Math.round(d / 4)) >= 1) {
				current[i] += Math.round(d / 4);
				same = false;
			} else if (d != 0) {
				current[i] = target[i];
				same = false;
			}
		}

		let hSteps = 7;
		let vSteps = 4;
		for (let i = 0; i < hSteps; i++) {
			let x = Math.floor((i + 1) / hSteps * contentWidth);
			context.beginPath();
			context.moveTo(x, 0);
			context.lineTo(x, contentHeight);
			context.strokeStyle = "#ddd";
			context.lineWidth = 1;
			context.stroke();
		}
		for (let i = 0; i < vSteps; i++) {
			let y = Math.floor(i / vSteps * contentHeight);
			context.beginPath();
			context.moveTo(0, y);
			context.lineTo(contentWidth, y);
			context.strokeStyle = "#ddd";
			context.lineWidth = 1;
			context.stroke();
		}


		context.beginPath();
		for (let i = 0; i < current.length; i++) {
			const x = i / current.length * contentWidth;
			const y = current[i] / 100 * contentHeight;
			if (i == 0)
				context.moveTo(x, contentHeight - y);
			else
				context.lineTo(x, contentHeight - y);
		}
		context.strokeStyle = "green";
		context.lineWidth = 2;
		context.stroke();

		if (!same)
			requestAnimationFrame(redraw);
		else
			isRedrawing = false;
	}
	redraw();

	machineStateObservers.push(function() {
		if (!isRedrawing)
			redraw();
	});

	var graphHover = document.createElement("div");
	graphHover.classList.add("graph-hover");
	graphHover.style.opacity = "0";
	graphHover.style.pointerEvents = "none";
	document.body.appendChild(graphHover);

	canvas.addEventListener("pointerenter", function (e) {
		graphHover.style.opacity = "1";
		updateHover((e.offsetX - paddingLeft) / contentWidth);
	});
	canvas.addEventListener("pointermove", function (e) {
		graphHover.style.opacity = "1";
		updateHover((e.offsetX - paddingLeft) / contentWidth);
	});
	canvas.addEventListener("pointerleave", function () {
		graphHover.style.opacity = "0";
	});

	function updateHover(v) {
		let i = Math.round(v * target.length);
		if (i < 0) i = 0;
		if (i >= target.length) i = target.length - 1;

		if (!isRedrawing)
			redraw();

		context.beginPath();
		context.ellipse(i / target.length * contentWidth, contentHeight - target[i],
			4, 4, 0, 0, Math.PI * 2);
		context.strokeStyle = "black";
		context.lineWidth = 1.5;
		context.stroke();

		var h = target.length - 1 - i;
		var days = Math.floor(h / 24);
		h %= 24;

		graphHover.textContent = "Maschinenauslastung ";
		if (days > 0) {
			graphHover.textContent += "vor " + (days > 1 ? days + " Tagen" : "einem Tag");
			if (h > 0) {
				graphHover.textContent += " und " + (h > 1 ? h + " Stunden" : "einer Stunde");
			}
		} else if (h > 0) {
			graphHover.textContent += "vor " + (h > 1 ? h + " Stunden" : "einer Stunde");
		} else {
			graphHover.textContent += "jetzt";
		}
		graphHover.textContent += ": " + Math.round(target[i]) + "%";

		var size = graphHover.getBoundingClientRect();

		var abs = getPosition(canvas);
		graphHover.style.left = Math.max(0, Math.min(window.innerWidth - size.width,
			abs.x + paddingLeft + Math.floor(v * contentWidth) - size.width / 2)) + "px";
		graphHover.style.top = (abs.y - size.height + paddingTop) + "px";
	}
})();

function getPosition(el) {
	var xPos = 0;
	var yPos = 0;

	while (el) {
		if (el.tagName == "BODY") {
			// deal with browser quirks with body/window/document and page scroll
			var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
			var yScroll = el.scrollTop || document.documentElement.scrollTop;

			xPos += (el.offsetLeft - xScroll + el.clientLeft);
			yPos += (el.offsetTop - yScroll + el.clientTop);
		} else {
			// for all other non-BODY elements
			xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
			yPos += (el.offsetTop - el.scrollTop + el.clientTop);
		}

		el = el.offsetParent;
	}
	return {
		x: xPos,
		y: yPos
	};
}

(function() {
	const statesEnum = [
		"Unbekannt",
		"in Bearbeitung",
		"in Warteschlange",
		"Ausstehend",
		"Versandfertig"
	]

	let updating = false;
	function refreshOrders(orders) {
		if (updating) return;
		updating = true;
		console.log("refreshing orders");

		var groupings = [];

		orders.forEach(order => {
			let state = 0; // Unbekannt
			if (order.processingMachines.length)
				state = 1; // in Bearbeitung
			else if (order.waitingForMachines.length)
				state = 2; // in Warteschleife
			else if (order.steps.every(s => s.done == false))
				state = 3; // Ausstehend
			else if (order.steps.every(s => s.done == true))
				state = 4; // Versandfertig

			if (!groupings[state])
				groupings[state] = [];

			groupings[state].push(order);
		});

		console.log(groupings);

		var html = document.querySelector(".orders");
		let htmlIndex = 0;
		for (let i = 0; i < groupings.length; i++) {
			const grouping = groupings[i];
			while (htmlIndex < html.children.length
				&& parseInt(html.children[htmlIndex].getAttribute("data-group")) < i)
				html.removeChild(html.children[htmlIndex]);

			if (!grouping)
				continue;

			let target = html.children[htmlIndex];
			if (htmlIndex >= html.children.length
				|| parseInt(html.children[htmlIndex].getAttribute("data-group")) != i) {
				target = document.createElement("section");
				target.setAttribute("data-group", i.toString());
				html.insertBefore(target, html.children[htmlIndex]);
				htmlIndex++;

				var table = document.createElement("table");
				var thead = document.createElement("thead");
				var tr = document.createElement("tr");
				var th = document.createElement("th");
				th.className = "label";
				th.setAttribute("colspan", "3");
				th.textContent = statesEnum[i];

				tr.appendChild(th);
				thead.appendChild(tr);
				table.appendChild(thead);
				table.appendChild(document.createElement("tbody"));
				target.appendChild(table);
			}

			target = target.querySelector("tbody");
			for (let j = 0; j < grouping.length; j++) {
				const order = grouping[j];
				let row = target.children[j];
				if (!row) {
					row = document.createElement("tr");
					row.appendChild(document.createElement("td"));
					row.appendChild(document.createElement("td"));
					row.appendChild(document.createElement("td"));
					target.appendChild(row);
				}

				if (row.children[0].textContent != order.id)
					row.children[0].textContent = order.id;
				if (row.children[1].textContent != order.label)
					row.children[1].textContent = order.label;

				let steps = [0, 0];
				order.steps.forEach(step => {
					if (step.done) steps[0]++;
					steps[1]++;
				});
				steps = steps[0] + " / " + steps[1];
				if (row.children[2].textContent != steps)
					row.children[2].textContent = steps;
			}

			while (target.children[grouping.length])
				target.removeChild(target.children[grouping.length]);
		}

		updating = false;
	}

	orderObservers.push(function() {
		refreshOrders(orders);
	});
	refreshOrders(orders);
})();

(function() {
	let updating = false;
	function refreshMachines(machineStates) {
		if (updating) return;
		updating = true;
		console.log("refreshing machines");

		let tbody = document.querySelector(".machines tbody");
		while (tbody.childElementCount)
			tbody.removeChild(tbody.lastElementChild);

		let i = -1;
		machineStates.forEach(machine => {
			i++;
			let tr = document.createElement("tr");
			tbody.appendChild(tr);
			tr.appendChild(document.createElement("td"));
			tr.appendChild(document.createElement("td"));
			tr.appendChild(document.createElement("td"));

			tr.children[0].appendChild(document.createElement("input"));
			tr.children[0].children[0].type = "checkbox";
			tr.children[0].children[0].checked = selectedMachines[i] === undefined ? true : selectedMachines[i];
			tr.children[0].children[0].setAttribute("data-id", i.toString());

			tr.children[1].textContent = machines[i];
			let n = machine.active.length + machine.queue.length;
			tr.children[2].textContent = n == 0
				? "Frei"
				: n > 1
					? n + " Vorg??nge"
					: "1 Vorgang";

			tr.children[0].children[0].addEventListener("change", function () {
				generateSelectedMachines();
				emit(machineStateObservers);
			});

			tr.addEventListener("click", function(e) {
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

		updating = false;
	}

	machineStateObservers.push(function() {
		refreshMachines(machineStates);
	});
	refreshMachines(machineStates);
})();