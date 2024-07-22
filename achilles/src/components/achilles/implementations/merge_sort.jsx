import { ArrayItem, addArrayKey } from './array_helpers';
import Zeno from '../../zeno/zeno.js';
import { Colors, Easing } from 'sharc-js/Utils';
import Palette from '../palette';
import Constants from '../constants';
import ArrayStage from './array_stage';

export default class MergeSort extends ArrayStage {

	constructor(canvas) {
		super(canvas, );
	}

	validate() {
		return true;
	}

	static code() { // just for reference
`function merge(arr, start, mid, end) { // 11
	
	const leftArr = arr.slice(start, mid + 1); // 12
	const rightArr = arr.slice(mid + 1, end + 1); // 13

	let left = 0; 
	let right = 0; 
	let out = start; // 14

	while (left < leftArr.length && right < rightArr.length) { // 15
		if (leftArr[left] <= rightArr[right]) { // 16
			arr[out] = leftArr[left]; // 17
			left++; // 18
		} else { // 19
			arr[out] = rightArr[right]; // 20
			right++; // 21
		}
		out++; // 22
	}

	while (left < leftArr.length) { // 23
		arr[out] = leftArr[left]; // 24
		left++; // 25
		out++; // 26
	}

}

function sort(arr, start, end) { // 4

	if (start >= end) { // 5
		return; // 6
	}

	const mid = Math.floor((start + end) / 2); // 7

	sort(arr, start, mid); // 8
	sort(arr, mid + 1, end); // 9
	merge(arr, start, mid, end); // 10
}

function mergeSort(arr) { // 2
	sort(arr, 0, arr.length - 1); // 3
}

const arr = [ 4, 3, 9, 8, 6, 1, 7, 5, 2 ]; // 0
mergeSort(arr); // 1
console.log(arr); // 27`;
	}

	execute() {

		const zeno = new Zeno();
		const $ = zeno.proxy;

		$.arr = this.playground.children[0].findChildrenWhere(sprite => {
			return sprite.name.startsWith("arritem/") && !sprite.name.startsWith("arritem/other");
		}).sort((a, b) => {
			return parseInt(a.name.split("/")[1]) - parseInt(b.name.split("/")[1]);
		}).map(item => {
			return item.details.value;
		});
		$["IGNORE: elemSources"] = [...new Array($.arr.length)].map(() => '');
		$(0)		


		const merge = $("merge", 11, ["^arr", "start", "mid", "end", "^IGNORE: elemSources"], () => {
			$.leftArr = $.arr.slice($.start, $.mid + 1);
			$(12);
			$.rightArr = $.arr.slice($.mid + 1, $.end + 1);
			$(13);

			$.left = 0;
			$.right = 0;
			$.out = $.start;
			$(14);

			$.while(() => { return $.left < $.leftArr.length && $.right < $.rightArr.length }, 15, () => {
			$.if(() => { return $.leftArr[$.left] <= $.rightArr[$.right] }, 16, () => {
					$.arr[$.out] = $.leftArr[$.left];
					$["IGNORE: elemSources"][$.out] = 'l';
					$(17);
					$.left++;
					$(18);
					}, 19, () => {
						$.arr[$.out] = $.rightArr[$.right];
						$["IGNORE: elemSources"][$.out] = 'r';
						$(20);
						$.right++;
						$(21);
				});
				$.out++;
				$(22);
			});

			$.while(() => { return $.left < $.leftArr.length }, 23, () => {
				$.arr[$.out] = $.leftArr[$.left];
				$["IGNORE: elemSources"][$.out] = 'l';
				$(24);
				$.left++;
				$(25);
				$.out++;
				$(26);
			});
			
			$["IGNORE: elemSources"] = $["IGNORE: elemSources"].map((source, idx) => idx <= $.end ? 'g' : source);

			return [ 999, undefined ];

		});

		const sort = $("sort", 4, ["^arr", "start", "end", "^IGNORE: elemSources"], () => {
			if ($.if(() => { return $.start >= $.end }, 5, () => {
				$["IGNORE: elemSources"] = $["IGNORE: elemSources"].map((source, idx) => idx <= $.end ? 'g' : source);
				return [ 6, undefined ];
			})) { return; }

			$.mid = Math.floor(($.start + $.end) / 2);
		$(7);

			sort(8, $.arr, $.start, $.mid, $["IGNORE: elemSources"]);
			$(8);
			sort(9, $.arr, $.mid + 1, $.end, $["IGNORE: elemSources"]);
			$(9);
			merge(10, $.arr, $.start, $.mid, $.end, $["IGNORE: elemSources"]);

			return [ 999, undefined ];

		});

		const mergesort = $("mergesort", 2, ["^arr", "^IGNORE: elemSources"], () => {
			sort(3, $.arr, 0, $.arr.length - 1, $["IGNORE: elemSources"]);
			return $.arr;
		});

		mergesort(1, $.arr, $["IGNORE: elemSources"]);

		$.log($.arr);
		$(27);

		return zeno.zaps;
	}

	interpolate() {
		super.interpolate();
		const zap = this.zaps[this.zapIdx];
		const root = this.arr;
		this.updateElementPositionsAndAlpha(zap, root, true);
		const incrementMap = {
			18: "left",
			21: "right",
			22: "out",
			25: "left",
			26: "out",
		};
		const slide = {
			property: 'centerX',
			from: null,
			duration: 20,
			to: (x) => x + Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN,
		};
		const slideUp = {
			property: 'centerY',
			from: null,
			duration: 20,
			to: (y) => y + Constants.ARR_ITEM_SIZE / 2
		};
		const slideDown = {
			...slideUp,
			to: (y) => y - Constants.ARR_ITEM_SIZE / 2
		};
		const slidingPointerName = incrementMap[zap.section];
		if (slidingPointerName) {
			const pointer = this.arr.findDescendant(`arrpointer/${slidingPointerName}`);
			pointer.channels[0].push(slide);
			if (slidingPointerName === "left" && zap.find("left") >= zap.find("leftArr").length) {
				pointer.createChannels(1).channels[1].push(slideUp);
			}
			if (slidingPointerName === "right" && zap.find("right") >= zap.find("rightArr").length) {
				pointer.createChannels(1).channels[1].push(slideUp);
			}
			if (slidingPointerName === "out" && zap.find("out") > zap.find("end")) {
				pointer.createChannels(1).channels[1].push(slideDown);
			}
		}
		if (zap.section == 17 || zap.section == 24 || zap.section == 20) {
			const leftOrRightArr = zap.section == 20 ? "right" : "left";
			const item = this.arr.findDescendant(`arritem/${leftOrRightArr}Arr/${zap.find(leftOrRightArr)}`).copy();
			// const item = this.arr.findDescendant(`arritem/leftArr/${zap.section == 20 ? zap.find("right") : zap.find("left")}`).copy();
			this.arr.addChild(item);
			const destCenter = this.arr.findDescendant(`arritem/${zap.find("out")}`).center;
			item.createChannels(2).distribute([[{
				property: 'center',
				duration: 20,
				from: null,
				to: destCenter,
			}], [{
					property: 'color',
					duration: 20,
					from: null,
					to: Colors.White,
					easing: Easing.EASE_IN,
			}], [{
					property: 'strokeColor',
					duration: 20,
					from: null,
					to: Colors.Green,
			}]]);
		}
	}

	updateElementPositionsAndAlpha(zap, root, doInterpolate = false) {
		const arr = zap.find("arr");
		const heights = arr.map(() => 0);
		for (const scope of zap.snapshotData) {
			if (scope.get(Zeno.SCOPE_NAME)?.startsWith('sort') && scope.get('start') !== undefined && scope.get('end') !== undefined) {
				for (let i = scope.get('start'); i <= scope.get('end'); i++) {
					heights[i] += 1;
				}
			}
		}
		for (const i in heights) {
			heights[i] = Math.max(heights[i], 1);
		}
		const maxHeight = Math.max(...heights);
		for (const sprite of root.children) {
			const idx = /arritem\/(\d+)$/.exec(sprite.name)?.[1];
			if (!idx) {
				continue;
			}
			const i = parseInt(idx);
			let centerY = Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN - heights[i] * (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN);
			if (7 <= zap.section && zap.section <= 8) {
				if (i >= zap.find("start") && i <= zap.find("mid")) {
					centerY -= Constants.ARR_ITEM_SIZE / 2;
				}
			} else if (zap.section === 9 && i >= zap.find("mid") + 1 && i <= zap.find("end")) {
				centerY -= Constants.ARR_ITEM_SIZE / 2;
			}
			const color = (() => {
				const gray = { red: 25, green: 25, blue: 25, alpha: 1 };
				if (zap.safeFind("out") !== undefined) {
					if (zap.safeFind("out") > zap.safeFind("end")) {
						return i >= zap.safeFind("start") && i <= zap.safeFind("end") ? Colors.White : gray;
					} else {
						return ["l", "r"].includes(zap.safeFind("IGNORE: elemSources")?.[i]) ? Colors.White : gray;
					}
				} else {
					return heights[i] === maxHeight ? Colors.White : gray;
				}
			})();
			if (doInterpolate) {
				sprite.channels[0].push({
					duration: 20,
					property: 'centerY',
					from: null,
					to: centerY,
					easing: Easing.EASE_OUT,
				});
				if (zap.section !== 17 && zap.section !== 20 && zap.section !== 24 && zap.section !== 999) {
					sprite.createChannels(1).channels[1].push({
						duration: 20,
						property: 'color',
						from: null,
						to: color,
						easing: Easing.EASE_IN,
					});
				}
				if (sprite.channels.length < 2) {
					sprite.createChannels(2);
				}
			} else {
				sprite.centerY = centerY;
				sprite.color = color;
			}
		}
		if (doInterpolate && zap.section >= 15) {
			for (const child of this.arr.children) {
				let idx;
				if (idx = /arritem\/(\w+)Arr\/(\d+)$/.exec(child.name)) {
					const [_, leftOrRight, i] = idx;
					const alpha = zap.safeFind(leftOrRight) === parseInt(i) ? 1 : 0.25;
					child.channels[0].push({
						duration: 10,
						delay: 5,
						property: 'alpha',
						from: null,
						to: alpha,
						easing: Easing.EASE_IN,
					});
				}
			}
		}
	}

	updateElementColors(zap, root) {
		const colors = zap.safeFind("IGNORE: elemSources");
		const sortedIdx = zap.safeFind("start");
		for (const sprite of root.children) {
			const idx = /arritem\/(\d+)$/.exec(sprite.name)?.[1];
			if (parseInt(idx ?? -1) === -1) {
				continue;
			}
			if (sortedIdx !== undefined && parseInt(idx) < sortedIdx) {
				sprite.strokeColor = Colors.DarkGreen;
				continue;
			}
			if (colors) {
				sprite.strokeColor = colors[idx] === 'l' ? Palette.ELEMENT_LEFT_STROKE : 
					colors[idx] === 'r' ? Palette.ELEMENT_RIGHT_STROKE : 
					colors[idx] === 'g' ? Colors.DarkGreen : Colors.Black;
			}
		}

	}

	loadZap(idx) {
		super.loadZap(idx);
		const zap = this.zaps[idx];
		const arr = zap.find("arr");
		this.setArray(arr);
		this.updateElementPositionsAndAlpha(zap, this.arr);
		this.updateElementColors(zap, this.arr);
		// if (zap.safeFind('mid') !== undefined && zap.safeFind('out') === undefined) {
		// 	this.addPointer("mid", zap);
		// }
		if (zap.safeFind('out') !== undefined) {
			const outPtr = this.addPointer("out", zap);
			if (zap.safeFind("out") > zap.safeFind("end")) {
				outPtr.centerX = this.arr.findDescendant(`arritem/${zap.safeFind("end")}`).centerX + Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN;
				outPtr.centerY = this.arr.findDescendant(`arritem/${zap.safeFind("end")}`).centerY + Constants.ARR_ITEM_SIZE / 2;
			}
		}
		if (zap.safeFind("leftArr") && zap.section !== 999) {
			for (const child of this.arr.children) {
				const idx = parseInt(/arritem\/(\d+)$/.exec(child.name)?.[1] ?? -1);
				if (idx !== -1 && idx >= zap.safeFind("start") && idx <= zap.safeFind("mid")) {
					const cpy = child.copy();
					cpy.centerY -= Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN;
					cpy.centerX -= (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN) / 2;
					cpy.strokeColor = Palette.ELEMENT_LEFT_STROKE;
					cpy.color = Palette.ELEMENT_LEFT;
					cpy.name = `arritem/leftArr/${idx - zap.safeFind("start")}`;
					cpy.children[0].scaleY = -1;
					const newIdx = idx - zap.safeFind("start");
					cpy.children[0].text = zap.safeFind("leftArr")[newIdx];
					cpy.alpha = zap.safeFind("left") !== undefined ? newIdx === zap.safeFind("left") ? 1 : 0.25 : 1;
					this.arr.addChild(cpy);
				}
				if (zap.safeFind("left") !== undefined && !this.arr.findDescendant("arrpointer/left")) {
					const ptr = this.addPointer("left", zap, Palette.ELEMENT_LEFT, true, undefined, zap.safeFind("start"));
					const overflowed = zap.safeFind("left") >= zap.safeFind("leftArr").length;
					ptr.center = {
						x: ptr.centerX - (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN) / 2,
						y: ptr.centerY - Constants.ARR_ITEM_SIZE * (1 - overflowed * .5) - Constants.ARR_ITEM_MARGIN
					};
				}
			}
		}
		if (zap.safeFind("rightArr") && zap.section !== 999) {
			for (const child of this.arr.children) {
				const idx = parseInt(/arritem\/(\d+)$/.exec(child.name)?.[1] ?? -1);
				if (idx !== -1 && idx >= zap.safeFind("mid") + 1 && idx <= zap.safeFind("end")) {
					const cpy = child.copy();
					cpy.centerY -= Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN;
					cpy.centerX += (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN) / 2;
					cpy.strokeColor = Palette.ELEMENT_RIGHT_STROKE;
					cpy.color = Palette.ELEMENT_RIGHT;
					cpy.name = `arritem/rightArr/${idx - zap.safeFind("mid") - 1}`;
					cpy.children[0].scaleY = -1;
					const newIdx = idx - zap.safeFind("mid") - 1;
					cpy.children[0].text = zap.safeFind("rightArr")[newIdx];
					cpy.alpha = zap.safeFind("right") !== undefined ? newIdx === zap.safeFind("right") ? 1 : 0.25 : 1;
					this.arr.addChild(cpy);
				}
				if (zap.safeFind("right") !== undefined && !this.arr.findDescendant("arrpointer/right")) {
					const overflowed = zap.safeFind("right") >= zap.safeFind("rightArr").length;
					const ptr = this.addPointer("right", zap, Palette.ELEMENT_RIGHT, true, undefined, zap.safeFind("mid") + 1 - overflowed);
					ptr.center = {
						x: ptr.centerX + (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN) * (0.5 + overflowed),
						y: ptr.centerY - Constants.ARR_ITEM_SIZE * (1 - overflowed * .5) - Constants.ARR_ITEM_MARGIN
					};
				}
			}
		}
		this.arr.findChild("!arr-pointers").sendToBack();
		if (idx === this.zaps.length - 1) {
			this.arr.findChildrenWhere(sprite => sprite.name.startsWith("arritem/")).map(sprite => { sprite.color = Colors.Green; });
		}
	}

}

