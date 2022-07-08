(function() {
	/**
	 * @type { HTMLCanvasElement }
	 */
	const canvas = document.getElementById("auslastung");
	const context = canvas.getContext("2d");

	let checkboxes = document.querySelectorAll(".machines input[type=\"checkbox\"]");
	function generateSelectedIndices()
	{
		let indices = [];
		checkboxes.forEach(cb => {
			indices[parseInt(cb.getAttribute("data-id"))] = cb.checked;
		});
		return indices;
	}
	let selectedIndices = generateSelectedIndices();

	var current = new Array(7 * 24);
	var target = new Array(7 * 24);
	for (let i = 0; i < target.length; i++) {
		target[i] = 0;
		current[i] = 0;
	}

	var isRedrawing = false;
	function redraw() {
		isRedrawing = true;
		const width = canvas.width;
		const height = canvas.height;

		const paddingTop = 16;
		const paddingLeft = 32;
		const paddingBottom = 24;
		const paddingRight = 16;
		const bottomTextOffset = 8;

		context.resetTransform();
		context.clearRect(0, 0, width, height);
		context.translate(0.5, 0.5);

		context.font = '12px "Noto Kufi", sans-serif';

		context.beginPath();
		context.moveTo(paddingLeft, paddingTop);
		context.lineTo(paddingLeft, height - paddingBottom);
		context.lineTo(width - paddingRight, height - paddingBottom);
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

		const contentWidth = width - paddingLeft - paddingRight;
		const contentHeight = height - paddingTop - paddingBottom;
		context.translate(paddingLeft, paddingTop);

		for (let i = 0; i < target.length; i++) {
			target[i] = 0;
		}

		let totalCount = 0;
		for (let i = 0; i < machineStates.length; i++) {
			const s = machineStates[i];
			if (selectedIndices[i]) {
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
			context.stroke();
		}
		for (let i = 0; i < vSteps; i++) {
			let y = Math.floor(i / vSteps * contentHeight);
			context.beginPath();
			context.moveTo(0, y);
			context.lineTo(contentWidth, y);
			context.strokeStyle = "#ddd";
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

	checkboxes.forEach(cb => {
		cb.addEventListener("change", function() {
			selectedIndices = generateSelectedIndices();
			console.log(selectedIndices);
			if (!isRedrawing)
				redraw();
		});
	});
})();