export function generateRandomHSLColor() {
	const hue = Math.floor(Math.random() * 360); // 0 to 359
	const saturation = Math.floor(Math.random() * 101); // 0 to 100
	const lightness = Math.floor(Math.random() * 101); // 0 to 100

	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function hexToHSL(hex) {
	// Remove # if present
	hex = hex.replace(/^#/, "");

	// Validate hex format
	if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
		throw new Error(
			'Invalid hex color format. Use 6 characters (e.g., "FF0000" or "#FF0000")'
		);
	}

	// Convert hex to RGB
	let r = parseInt(hex.slice(0, 2), 16) / 255;
	let g = parseInt(hex.slice(2, 4), 16) / 255;
	let b = parseInt(hex.slice(4, 6), 16) / 255;

	// Find min and max RGB components
	let max = Math.max(r, g, b);
	let min = Math.min(r, g, b);
	let delta = max - min;

	// Calculate HSL values
	let h = 0;
	let s = 0;
	let l = (max + min) / 2;

	if (delta !== 0) {
		s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

		switch (max) {
			case r:
				h = (g - b) / delta + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / delta + 2;
				break;
			case b:
				h = (r - g) / delta + 4;
				break;
			default:
				break;
		}
		h /= 6;
	}

	// Convert to degrees and percentages
	h = Math.round(h * 360);
	s = Math.round(s * 100);
	l = Math.round(l * 100);

	return `hsl(${h}, ${s}%, ${l}%)`;
}

export function hslToHex(hslStr) {
	// Remove spaces and handle both comma and space-separated formats
	hslStr = hslStr.replace(/\s/g, "");

	// Extract h, s, l values using regex
	const hslRegex = /hsl\((\d+)(?:deg)?,(\d+)%?,(\d+)%?\)/i;
	const match = hslStr.match(hslRegex);

	if (!match) {
		throw new Error("Invalid HSL string format. Expected: hsl(h, s%, l%)");
	}

	// Convert to numbers and normalize
	let h = parseInt(match[1]);
	let s = parseInt(match[2]);
	let l = parseInt(match[3]);

	// Normalize values
	h = h % 360;
	s = Math.max(0, Math.min(100, s)) / 100;
	l = Math.max(0, Math.min(100, l)) / 100;

	// Algorithm to convert HSL to RGB
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;

	let r, g, b;

	if (h >= 0 && h < 60) {
		[r, g, b] = [c, x, 0];
	} else if (h >= 60 && h < 120) {
		[r, g, b] = [x, c, 0];
	} else if (h >= 120 && h < 180) {
		[r, g, b] = [0, c, x];
	} else if (h >= 180 && h < 240) {
		[r, g, b] = [0, x, c];
	} else if (h >= 240 && h < 300) {
		[r, g, b] = [x, 0, c];
	} else {
		[r, g, b] = [c, 0, x];
	}

	// Convert to 0-255 range
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	// Convert to hex
	const toHex = (n) => {
		const hex = n.toString(16);
		return hex.length === 1 ? "0" + hex : hex;
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function extractHSLValues(hslString) {
	const matches = hslString.match(/(-?\d+)(deg|%)?/g);
	return matches || null;
}
