import { ArrayItem, addArrayKey } from './array_helpers';
import Zeno from '../../zeno/zeno.js';
import { Colors, Easing } from 'sharc-js/Utils';
import Palette from '../palette';
import Constants from '../constants';
import ArrayStage from './array_stage';

export default class InsertionSort extends ArrayStage {

	constructor(canvas) {
		super(canvas);
	}

	validate() {
		return true;
	}

	static get code() { // just for reference
		return `
function selectionSort(arr) { // 2

	const n = arr.length; // 3
	for (let i = 0; i < n - 1; i++) { // 4
		let minimum = i; // 5
		for (let j = i + 1; j < n; j++) { // 6
			if (arr[j] < arr[minimum]) { // 7
				minimum = j; // 8
			}
		}
		if (minimum !== i) { // 9
			[ arr[i], arr[minimum] ] = [ arr[minimum], arr[i] ]; // 10
		}
	}
} 

const arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ]; // 0
selectionSort(arr); // 1
console.log(arr); // 11
`;
	}

	execute() {
		const zeno = new Zeno();
		const $ = zeno.proxy;

		$.arr = this.getArray();
		$(0);

		const selectionSort = $("selectionSort", 2, ["^arr"], () => {
			$.n = $.arr.length;
			$(3);
			$.for("i", 0, i => i < $.n - 1, i => ++i, 4, i => {
				$.minimum = i;
				$(5);
				$.for("j", i + 1, j => j < $.n, j => ++j, 6, j => {
					$.if(() => $.arr[j] < $.arr[$.minimum], 7, () => {
						$.minimum = j;
						$(8);
					});
				});
				$.if(() => $.minimum !== i, 9, () => {
					const temp = [ $.arr[i], $.arr[$.minimum] ];
					$.arr[i] = temp[1];
					$.arr[$.minimum] = temp[0];
					$(10);
				});
			});
			return [ 999, undefined ];
		});

		selectionSort(1, $.arr);
		$.log($.arr);
		$(11);

		return zeno.zaps;
	}

	interpolate() {
		super.interpolate();
		const zap = this.zaps[this.zapIdx];
		const section = zap.section;
		switch (section) {
			case 4: {
				const i = zap.safeFind("i");
				if (i === 0) {
					this.floatIn(this.addPointer("i", zap));
				} else {
					this.slideHorizontal(this.findArrayPointer("i"));
				}
				if (this.arr.findDescendant("arrpointer/minimum")) {
					this.floatOut(this.findArrayPointer("minimum"), undefined, true);
				}
				if (this.arr.findDescendant("arrpointer/j")) {
					this.floatOut(this.findArrayPointer("j"));
				}
				break;
			}
			case 5: {
				const ptr = this.addPointer("minimum", zap, Palette.KEY_DEFAULT, true);
				ptr.centerY += 0;
				ptr.children[0].positionY -= 10;
				this.floatIn(ptr, undefined, true);
				break;
			}
			case 6: {
				const j = zap.safeFind("j");
				if (j === zap.safeFind("i") + 1) {
					this.floatIn(this.addPointer("j", zap, Palette.POINTER_HIGHLIGHT));
				} else {
					this.slideHorizontal(this.findArrayPointer("j"));
				}
				break;
			}
			case 8: {
				for (const child of this.playground.children[0].children) {
					if (!child.name.startsWith("arritem/")) {
						continue;
					}
					if (child.strokeColor.red !== 0) {
						child.channels[0].push({
							duration: this.stretchTime(10),
							property: "strokeColor",
							from: null,
							to: Colors.Black,
						});
						child.createChannels(1).channels[1].push({
							duration: this.stretchTime(10),
							property: "color",
							from: null,
							to: Palette.ELEMENT_DEFAULT,
						});
					} else if (parseInt(child.name.split("/")[1]) === zap.safeFind("minimum")) {
						child.channels[0].push({
							duration: this.stretchTime(10),
							property: "strokeColor",
							from: null,
							to: Palette.KEY_STROKE,
						});
						child.createChannels(1).channels[1].push({
							duration: this.stretchTime(10),
							property: "color",
							from: null,
							to: Palette.KEY_DEFAULT,
						});
					}
				}
				this.slideHorizontal(this.findArrayPointer("minimum"), undefined, undefined, zap.safeFind("j"));
				break;
			}
			case 10: { 
				const item1 = this.findArrayItem(zap.safeFind("i"));
				const item2 = this.findArrayItem(zap.safeFind("minimum"));
				this.swapItems(item1, item2);
				break;
			}
		}
	}

	loadZap(idx) {
		super.loadZap(idx);
		const zap = this.zaps[idx];
		this.setArray(zap.find("arr"));
		if (zap.safeFind("i") !== undefined) {
			this.addPointer("i", zap);
		}
		if (zap.safeFind("j") !== undefined) {
			this.addPointer("j", zap, Palette.POINTER_HIGHLIGHT);
		}
		if (zap.safeFind("minimum") !== undefined) {
			const ptr = this.addPointer("minimum", zap, Palette.KEY_DEFAULT, true);
			ptr.centerY += 0; // works around a bug in sharc
			ptr.children[0].positionY -= 10;
		}
		this.playground.children[0].children.forEach((c) => {
			if (!c.name.startsWith("arritem/")) {
				return;
			}
			const i = parseInt(c.name.split("/")[1]);
			if (zap.section > 10) {
				c.color = Colors.Green;
			} else if (i == zap.safeFind("minimum") && zap.section <= 8) {
				c.color = Palette.KEY_DEFAULT;
				c.strokeColor = Palette.KEY_STROKE;
			}
			if (!zap.safeFind("i")) {
				return;
			}
			if (i < (zap.safeFind("i") ?? -1)) {
				c.color = Colors.Green;
			}
		});
	}

}

