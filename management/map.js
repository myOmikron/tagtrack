(function () {
	/**
	 * @type { HTMLCanvasElement }
	 */
	const canvas = document.querySelector("#map canvas");
	const context = canvas.getContext("2d");

	function resize() {
		let parent = canvas.parentElement.getBoundingClientRect();
		canvas.width = parent.width;
		canvas.height = parent.height;
	}

	window.addEventListener("resize", resize);
	resize();

	let mapImage = null;

	(async function () {
		let image = new Image();

		let xml = (await (await fetch("map.svg")).text());
		let dom = new DOMParser().parseFromString(xml, "text/xml");

		image.onload = function () {
			let machineNodes = dom.querySelectorAll("[data-machine]");
			machineNodes.forEach(machine => {
				let index = parseInt(machine.getAttribute("data-machine"));
				let pos = resolvePosition(machine, image.width, image.height);
				machineStates[index].pos = [pos[0], pos[1]];
				machineStates[index].rot = pos[2];
			});
			updateState();
			mapImage = image;
		};
		image.src = "data:image/svg+xml;base64," + btoa(xml);
	})();

	let mapOrigin = [0, 0];
	let mapZoom = 20;

	let i = 0;
	function redraw() {
		let width = canvas.width;
		let height = canvas.height;
		context.resetTransform();
		context.clearRect(0, 0, width, height);

		let maxZoomW = width / (mapImage ? mapImage.width : 0.001);
		let maxZoomH = height / (mapImage ? mapImage.height : 0.001);

		let zoom = Math.min(mapZoom, maxZoomW, maxZoomH);

		i++;

		if (mapImage) {
			context.translate(
				Math.floor((width - mapImage.width * zoom) / 2),
				Math.floor((height - mapImage.height * zoom) / 2)
			);
			context.scale(zoom, zoom);
			const r = mapImage.width * 0.025;

			function drawItem(x, y, state) {
				const styles = {
					"default": {
						"bg": "#066",
						"lines": "#0cc",
						"center": "#add",
					},
					"queue": {
						"bg": "#888",
						"lines": "#fff",
						"center": "#fff",
					}
				};

				let style = styles[state || "default"];

				let animRot = 0;
				if (state == "queue")
					animRot = Math.sin(((i * 0.001) % 1) * Math.PI * 2) * Math.PI / 2;
				else
					animRot = Math.sin(((i * 0.005) % 1) * Math.PI * 2) * Math.PI * 2;

				context.beginPath();
				context.fillStyle = style.bg;
				context.ellipse(x, y, r * 0.75, r * 0.75, 0, 0, Math.PI * 2);
				context.fill();
				context.beginPath();
				context.fillStyle = style.lines;
				context.moveTo(x, y);
				context.ellipse(x, y, r * 0.625, r * 0.625, 0, animRot, animRot + Math.PI / 2);
				context.lineTo(x, y);
				context.ellipse(x, y, r * 0.625, r * 0.625, 0, animRot + Math.PI, animRot + Math.PI * 3 / 2);
				context.fill();
				context.beginPath();
				context.fillStyle = style.bg;
				context.ellipse(x, y, r * 0.5, r * 0.5, 0, 0, Math.PI * 2);
				context.fill();
				context.beginPath();
				context.fillStyle = style.center;
				context.ellipse(x, y, r * 0.375, r * 0.375, 0, 0, Math.PI * 2);
				context.fill();
			}

			context.drawImage(mapImage, mapOrigin[0], mapOrigin[1]);

			machineStates.forEach(machine => {
				let c = add(add(machine.pos, rotate(1.25 * r, 1.25 * r, machine.rot)), mapOrigin);
				if (machine.active.length > 0) {
					context.beginPath();
					context.ellipse(c[0], c[1], r, r, 0, 0, Math.PI * 2);
					context.lineWidth = r * 0.1;
					context.strokeStyle = "green";
					context.stroke();

					drawItem(c[0], c[1]);

					if (machine.active.length > 1) {
						context.beginPath();
						context.font = (r) + "px Roboto";
						context.fillStyle = "white";
						context.textAlign = "center";
						context.textBaseline = "middle";
						context.fillText(machine.active.length.toString(), c[0], c[1], 2 * r * 0.75);
						context.fill();
					}

					c = add(c, rotate(0, 2.5 * r, machine.rot));
				}
				if (machine.queue.length > 0) {
					let animRot = (i * 0.002) % (Math.PI * 2);

					context.beginPath();
					context.ellipse(c[0], c[1], r, r, 0, animRot, animRot + Math.PI * 2);
					context.lineWidth = r * 0.15;
					context.strokeStyle = "gray";
					let numDashes = 6;
					let dash = r / Math.PI * 10 / numDashes;
					context.setLineDash([dash, dash])
					context.stroke();
					context.setLineDash([]);

					drawItem(c[0], c[1], "queue");

					if (machine.active.length > 1) {
						context.beginPath();
						context.font = (r) + "px Roboto";
						context.fillStyle = "white";
						context.textAlign = "center";
						context.textBaseline = "middle";
						context.fillText(machine.count.toString(), c[0], c[1], 2 * r * 0.75);
						context.fill();
					}
				}
				
				if (!machine.active.length && !machine.active.length) {
					let animRot = [
						(i * 0.022) % (Math.PI * 2),
						(i * 0.01) % (Math.PI * 2),
					];
					const red = "#d00";
					const bgred = "#dd000044";

					for (let i = 0; i < animRot.length; i++) {
						const rot = animRot[i];
						
						context.beginPath();
						context.ellipse(c[0], c[1], r * Math.pow(1.15, 1 + i * 0.25) * 0.9, r * 0.9, rot + (i / animRot.length * Math.PI), 0, Math.PI * 2);
						context.lineWidth = r * (0.25 + Math.sin(i * 0.05) * 0.075);
						context.strokeStyle = bgred;
						context.fillStyle = bgred;
						context.stroke();
						context.fill();
					}

					context.beginPath();
					context.ellipse(c[0], c[1], r * 0.9, r * 0.9, 0, 0, Math.PI * 2);
					context.lineWidth = r * (0.25 + Math.sin(i * 0.05) * 0.075);
					context.strokeStyle = "#d00";
					context.fillStyle = "#fff";
					context.stroke();
					context.fill();
				}
			});

			orders.forEach(order => {
				if (!order.waitingForMachines.length && !order.processingMachines.length)
				{
					let pos = trilaterate(order, r);

					drawItem(pos[0], pos[1]);
				}
			});
		}

		requestAnimationFrame(redraw);
	}

	redraw();
})();

/**
 * @param {Element} node 
 * @returns {[number, number, number]} position [x, y, rotation]
 */
function resolvePosition(node, width, height) {
	let x = parseFloat(node.getAttribute("x"));
	let y = parseFloat(node.getAttribute("y"));
	let rot = 0;

	let transform = node.getAttribute("transform");
	if (transform) {
		transform = transform.trim();
		while (transform) {
			let end = transform.indexOf(' ');
			if (end == -1) end = transform.length;

			let instruction = transform.substring(0, end);
			transform = transform.substring(end).trim();

			let args = instruction.indexOf('(');
			if (args == -1)
				throw new Error("Unknown transform: " + transform);

			switch (instruction.substring(0, args)) {
				case "rotate":
					let n = -parseFloat(instruction.substring(args + 1, instruction.length - 1))
						/ 180 * Math.PI;
					rot = n;
					[x, y] = rotate(x, y, rot);
					break;
				default:
					throw new Error("Unknown transform " + instruction);
			}
		}
	}

	let root = node;
	while (root.parentElement)
		root = root.parentElement;

	let viewBox = root.getAttribute("viewBox");
	viewBox = viewBox.split(/\s+/g).map(parseFloat);
	let w = viewBox[2] - viewBox[0];
	let h = viewBox[3] - viewBox[1];

	x = x / w * width;
	y = y / h * height;

	return [x, y, rot];
}

function rotate(x, y, n) {
	let c = Math.cos(n);
	let s = Math.sin(n);

	let rx = x * c + y * s;
	let ry = y * c - x * s;
	return [rx, ry];
}

function add(a, b) {
	return [a[0] + b[0], a[1] + b[1]];
}

function sub(a, b) {
	return [a[0] - b[0], a[1] - b[1]];
}

function mulf(a, f) {
	return [a[0] * f, a[1] * f];
}

function trilaterate(item, r) {
	item.signalStrengths.sort((a, b) => b[1] - a[1]);

	let ret = machineStates[item.signalStrengths[0][0]];
	let other = machineStates[item.signalStrengths[1][0]];
	let dist = r / machineStates[item.signalStrengths[0][1]] - 1;

	let d = Math.atan2(other[1] - ret[1], other[0] - ret[0]);

	return add(other, [r, 0]);//add(ret, [Math.sin(d) * dist, Math.cos(d) * dist]);
}
