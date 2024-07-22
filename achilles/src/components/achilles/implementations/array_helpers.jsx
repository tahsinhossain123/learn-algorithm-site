import { Line, Rect, TextSprite } from 'sharc-js/Sprites';
import { Colors, CenterBounds, Position as p, Corners, Easing } from 'sharc-js/Utils';
import Palette from '../palette';
import Constants from '../constants';
import { DRAG_EVENT_LISTENERS, inBounds, makeDraggable } from '../helpers';
import { FadeIn, FadeOut, Translate } from 'sharc-js/AnimationUtils';

export function ArrayItem({ value, idx, prefix = 'arritem' }) {
	return new Rect({
		name: `${prefix}/${idx}`,
		bounds: CenterBounds(idx * (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN), 0, Constants.ARR_ITEM_SIZE),
		color: Palette.ELEMENT_DEFAULT,
		stroke: {
			lineWidth: 5,
		},
		details: {
			value: parseInt(value),
		},
		radius: [Constants.ARR_ITEM_RADIUS],
		}).addChild(new TextSprite({
			name: `${prefix}text/${idx}`,
			text: value,
			fontSize: Constants.ARR_TEXT_SIZE,
			color: Palette.TEXT_DEFAULT,
			positionIsCenter: true,
			bold: true,
			position: { x: 0, y: 0 },
	}))
}

export function ModifiableArrayItem({ value, idx }) {
	const item = ArrayItem({ value, idx });
	item.addChildren(
		new Rect({
			name: `arritem/${idx}/plus-hitbox`,
			alpha: 0,
			bounds: CenterBounds(0, Constants.ARR_ITEM_SIZE / 2 + 40, Constants.ARR_ITEM_SIZE / 2),
			effects: (ctx) => {
				ctx.filter = `drop-shadow(1px 1px 10px green)`;
			}
			}).addChild(
				new TextSprite({
					name: `arritem/${idx}/plus`,
					text: "+",
					position: p(0, 0),
					fontSize: Constants.ARR_TEXT_SIZE * 2,
					color: Colors.Green,
					positionIsCenter: true,
			}))
			.on('click', sprite => {
				sprite.parent.details.value++;
				sprite.parent.children[0].text = sprite.parent.details.value;
				sprite.parent.children[0].channels[0].enqueue(Translate(p(0, 20), 10, 0, Easing.Bounce(Easing.LINEAR), p(0, 1.5)), 1);
		}),
		new Rect({
			name: `arritem/${idx}/minus-hitbox`,
			alpha: 0,
			bounds: CenterBounds(0, -Constants.ARR_ITEM_SIZE / 2 - 40, Constants.ARR_ITEM_SIZE / 2),
			effects: (ctx) => {
				ctx.filter = `drop-shadow(1px 1px 12px red)`;
			}
			}).addChild(
				new TextSprite({
					name: `arritem/${idx}/minus`,
					position: p(0, 12.5),
					text: "-",
					fontSize: Constants.ARR_TEXT_SIZE * 2,
					color: Colors.Red,
					positionIsCenter: true,
			}))
			.on('click', sprite => {
				sprite.parent.details.value--;
				sprite.parent.children[0].text = sprite.parent.details.value;
				sprite.parent.children[0].channels[0].enqueue(Translate(p(0, -20), 10, 0, Easing.Bounce(Easing.LINEAR), p(0, 1.5)), 1);
		})
	);
	makeDraggable(item, false);
	item.on('click', sprite => sprite.root.findDescendant('arritem/other/delete').channels[0].enqueue(FadeIn(10, 0, Easing.EASE_OUT_CUBIC), 0) && 0 );
	item.on('release', sprite => sprite.root.findDescendant('arritem/other/delete').channels[0].enqueue(FadeOut(10, 0, Easing.EASE_OUT_CUBIC), 0) && 0 );
	item.on('release', (sprite, pos) => {
		const deleteHitbox = sprite.root.findDescendant('arritem/other/delete-hitbox');
		const dist = Math.sqrt(
			Math.pow(pos.x - deleteHitbox.centerX, 2) +
				Math.pow(pos.y - deleteHitbox.centerY, 2)
		);
		if (dist < Constants.ARR_ITEM_SIZE) {
			sprite.root.stage.setArray(sprite.root.findDescendantsWhere(s => {
				return s.name.startsWith('arritem/') && (s.name !== `arritem/${idx}`) && s.name.split('/').length === 2;
				}).map(s => s.details.value), true);
			sprite.root.findDescendant('arritem/other/additem-hitbox').enabled = true;
			return;
		}
		for (const child of sprite.root.findDescendantsWhere(s => s.name.startsWith('arritem/') && s.name.split('/').length === 2)) {
			if (inBounds(child.bounds, pos)) {
				const temp = sprite.details.value;
				sprite.details.value = child.details.value;
				child.details.value = temp;
				sprite.children[0].text = sprite.details.value;
				child.children[0].text = child.details.value;
				return;
			}
		}
	});
	item.on('release', DRAG_EVENT_LISTENERS.release);
	return item;
}

export function addArrayPointer({ root, idx, color = Palette.POINTER_DEFAULT, text = '', isFlipped = false, prefix = undefined }) {
	prefix ??= 'arritem/';
	const yOffset = root.parent.findDescendant(`${prefix}${idx}`)?.centerY ?? 0;
	let xOffset = root.parent.findDescendant(`${prefix}${idx}`)?.centerX ?? 0;
	xOffset -= idx >= 0 ? 0 : (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN) * -idx;
	const pointer = new Line({
		name: `arrpointer/${text}`,
		bounds: Corners(
			xOffset,
			(Constants.ARR_ITEM_SIZE / 2 + Constants.POINTER_MARGIN) * (!isFlipped * 2 - 1) + yOffset,
			xOffset,
			(Constants.ARR_ITEM_SIZE / 2 + Constants.POINTER_LENGTH) * (!isFlipped * 2 - 1) + yOffset
		),
		color,
		rotation: 180,
		lineWidth: Constants.POINTER_ARROW_WIDTH,
		lineCap: 'round',
		arrow: {
			lineCap: 'round',
			length: Constants.POINTER_ARROW_LENGTH,
			stroke: {
				color,
				lineWidth: Constants.POINTER_ARROW_WIDTH,
				lineCap: 'round',
				lineJoin: 'round',
			},
		},
	});
	pointer.arrowSide = isFlipped ? 'start' : 'end';
	if (text) {
		pointer.addChild(new TextSprite({
			name: `arrpointertext/${idx}`,
			text,
			fontSize: Constants.POINTER_TEXT_SIZE,
			color,
			positionIsCenter: true,
			position: { x: 0, y: (-Constants.POINTER_LENGTH / 2 - Constants.POINTER_TEXT_MARGIN) * (!isFlipped * 2 - 1) },
			scale: p(-1, -1),
			bold: true,
		}));
	}
	root.addChild(pointer);
	return pointer;
}

export function addArrayKey({ root, idx, value, yOffset = 0, text = '', color = Palette.KEY_DEFAULT, strokeColor = Palette.KEY_STROKE }) {
	const arrItem = ArrayItem({ value, idx, prefix: 'arrkey' });
	arrItem.color = color;
	arrItem.strokeColor = strokeColor;
	arrItem.centerY -= yOffset;
	arrItem.addChild(new TextSprite({
		name: `arrkeytext/${idx}`,
		text,
		fontSize: Constants.ARR_TEXT_SIZE,
		color: Palette.KEY_STROKE,
		align: 'right',
		bold: true,
		position: p(-Constants.ARR_ITEM_SIZE - Constants.ARR_ITEM_MARGIN * 2.5, -Constants.ARR_TEXT_SIZE * .25),
	}));
	root.addChild(arrItem);
	return arrItem;
}

export const addArrayAddItem = ({ root }) => {
	const itemCount = root.findDescendantsWhere(c => c.name.startsWith('arritem/') && c.name.split('/').length === 2).length / 2;
	root.addChild(new Rect({
		name: 'arritem/other/additem-hitbox',
		alpha: 0,
		bounds: CenterBounds(itemCount * 2 * (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN), 0, Constants.ARR_ITEM_SIZE),
		effects: (ctx) => {
			ctx.filter = `drop-shadow(1px 1px 12px green)`;
		}
		}).addChild(new TextSprite({
			name: 'arritem/other/additem',
			text: '+  ',
			fontSize: Constants.ARR_ADD_ITEM_SIZE,
			positionIsCenter: true,
			color: Colors.Green,
			bold: true,
		})).on('click', (sprite) => {
			const itemCount = root.findDescendantsWhere(c => c.name.startsWith('arritem/') && c.name.split('/').length === 2).length;
			const lastItem = root.findDescendant(`arritem/${itemCount - 1}`);
			const value = lastItem ? lastItem.details.value - 1 : 0;
			root.addChild(ModifiableArrayItem({ value: value, idx: itemCount }));
			sprite.parent.centerX -= (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN) / 2;
			root.findChild('arritem/other/delete-hitbox').centerX += (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN) / 2;
			sprite.centerX += Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN;
			sprite.bringToFront();
			if (itemCount >= 24) {
				sprite.enabled = false;
			}
			}
	));
}

export function addArrayItems({ root, items, modifiable = false }) {
	items.forEach((item, index) => {
		root.addChild(modifiable ? ModifiableArrayItem({ value: item, idx: index }) :
			ArrayItem({ value: item, idx: index }));
	});
	const itemCount = root.findDescendantsWhere(c => c.name.startsWith('arritem/') && c.name.split('/').length === 2).length / 2;
	root.centerX = -(
		(itemCount - 1) * (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN)
	);
	if (!root.findChild('arritem/other/base')) {
		root.addChild(new TextSprite({
			name: 'arritem/other/base',
			text: 'arr',
			fontSize: Constants.BASE_TEXT_SIZE,
			color: Palette.BASE_TEXT,
			position: p( -Constants.ARR_ITEM_SIZE / 2 - Constants.BASE_TEXT_MARGIN, Constants.BASE_TEXT_SIZE / 2),
			bold: true,
			textAlign: 'right',
		}));
	}
	if (!root.findChild('arritem/other/delete-hitbox') && modifiable) {
		root.addChild(new Rect({
			name: 'arritem/other/delete-hitbox',
			alpha: 0,
			bounds: CenterBounds(
				((itemCount - 1) * (Constants.ARR_ITEM_SIZE + Constants.ARR_ITEM_MARGIN)) , Constants.ARR_DELETE_POSITION, Constants.ARR_ITEM_SIZE),
			effects: (ctx) => {
				ctx.filter = `drop-shadow(1px 1px 8px red)`;
			}
			}).addChild(new TextSprite({
				name: 'arritem/other/delete',
				text: '🗑️',
				fontSize: Constants.ARR_DELETE_SIZE,
				alpha: 0,
				positionIsCenter: true,
				bold: true,
		})));
	}
	if (!root.findChild('arritem/other/additem-hitbox') && modifiable) {
		addArrayAddItem({ root });
	}
	root.findChildrenWhere(s => s.name.startsWith('arritem/other')).forEach(s => s.sendToBack());
	// root.logHierarchy();
}
