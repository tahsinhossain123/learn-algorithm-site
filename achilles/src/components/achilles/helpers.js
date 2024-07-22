import { Shape } from 'sharc-js/Sprites';
import { Easing } from 'sharc-js/Utils';

export const SPRITE_POSITION = Symbol('achilleshelper:sprite_position');
export const CLICK_POSITION = Symbol('achilleshelper:click_position');
export const DRAGGED_POSITION = Symbol('achilleshelper:dragged_position');
export const CLICK_TIME = Symbol('achilleshelper:click_time');

export const DRAG_EVENT_LISTENERS = {
	click: (bringToFront = true) => {return  (sprite, pos) => {
		if (sprite.channels[0].animations.length !== 0) {
			return;
		}
		sprite.details ??= {};
		sprite.details[SPRITE_POSITION] = sprite.center;
		sprite.details[CLICK_POSITION] = pos;
		sprite.details[CLICK_TIME] = sprite.currentFrame;
		bringToFront && sprite.bringToFront();
	};},
	hold: (sprite, pos) => {
		if (sprite.channels[0].animations.length !== 0) {
			return;
		}
		const clickPos = sprite.details[CLICK_POSITION];
		const spritePos = sprite.details[SPRITE_POSITION];
		const dx = pos.x - clickPos.x;
		const dy = pos.y - clickPos.y;
		const center = {
			x: spritePos.x + dx,
			y: spritePos.y + dy,
		};
		const currCenter = sprite.center;
		if (sprite.currentFrame - sprite.details[CLICK_TIME] < 5) {
			return;
		}
		sprite.center = {
			x: currCenter.x + (center.x - currCenter.x) * 0.8,
			y: currCenter.y + (center.y - currCenter.y) * 0.8,
		};
		const distance = Math.sqrt((currCenter.x - center.x) ** 2 + (currCenter.y - center.y) ** 2);
		const deltaX = center.x - currCenter.x;
		const deltaY = center.y - currCenter.y;
		const rotation = (-(Math.atan2(deltaX, deltaY)) * 180 / Math.PI) * 1.25 * (Math.min(distance, 100) / 100);
		sprite.rotation += (rotation - sprite.rotation) * 0.1;
	},
	release: (sprite) => {
		sprite.channels[0].enqueue({
			property: 'center',
			from: null,
			to: sprite.details[SPRITE_POSITION],
			duration: 20,
			easing: Easing.EASE_IN,
		});
		sprite.rotation = 0;
	}
}

export const DEFAULT_RAMP_DELAY = 30;
export const DEFAULT_RAMP_RATIO = 0.8;
export const RAMP_RATIO = Symbol('achilleshelper:ramp_ratio');  
export const RAMP_DELAY = Symbol('achilleshelper:ramp_delay');

export const RAMP_CALLBACK_LISTENERS = {
	click: (delay = DEFAULT_RAMP_DELAY, ratio = DEFAULT_RAMP_RATIO) => (sprite) => {
		sprite.details ??= {};
		sprite.details[CLICK_TIME] = sprite.currentFrame;
		sprite.details[RAMP_DELAY] = delay;
		sprite.details[RAMP_RATIO] = ratio;
	},
	hold: (callback) => (sprite, position, event, stage) => {
		const time = sprite.currentFrame;
		const clickTime = sprite.details[CLICK_TIME];
		if (time == clickTime + 1 || time >= clickTime + sprite.details[RAMP_DELAY]) {
			callback(sprite, position, event, stage);
			sprite.details[CLICK_TIME] = sprite.currentFrame - 1;
			sprite.details[RAMP_DELAY] *= sprite.details[RAMP_RATIO];
		}
	}
};

/** 
 * @param {Shape} sprite
 */
export function makeDraggable(sprite, returnSpriteOnRelease = true, bringToFront = true) {

	sprite.on('click', DRAG_EVENT_LISTENERS.click(bringToFront));
	sprite.on('hold', DRAG_EVENT_LISTENERS.hold);
	returnSpriteOnRelease && sprite.on('release', DRAG_EVENT_LISTENERS.release);
}

export function inBounds(bounds, pos) {
	return pos.x >= bounds.x1 && pos.x <= bounds.x2 && pos.y >= bounds.y1 && pos.y <= bounds.y2;
}
