(function() {
	/**
	 * @type { HTMLCanvasElement }
	 */
	const canvas = document.getElementById("auslastung");
	const context = canvas.getContext("2d");

	const width = canvas.width;
	const height = canvas.height;

	const paddingTop = 16;
	const paddingLeft = 32;
	const paddingBottom = 24;
	const paddingRight = 16;
	const bottomTextOffset = 8;

	const uptime = [
		10, 30, 50, 80, 100, 80, 50, 80, 30, 0, 0, 40, 60, 80, 80, 90, 100, 100, 100, 50, 40, 30, 0, 0, 0, 10, 30, 50, 80, 100, 80, 50, 80, 30, 0, 0, 40, 60, 80, 80, 90, 100, 100, 100, 50, 40, 30, 0, 0, 30, 50, 80, 100, 80, 50, 80, 30, 0, 0, 40, 60, 80, 80, 90, 100, 100, 100, 50, 40, 30, 0, 0,
	];

	context.resetTransform();
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
	for (let i = 0; i < uptime.length; i++) {
		const x = i / uptime.length * contentWidth;
		const y = uptime[i] / 100 * contentHeight;
		if (i == 0)
			context.moveTo(x, y);
		else
			context.lineTo(x, y);
	}
	context.strokeStyle = "green";
	context.lineWidth = 2;
	context.stroke();
})();