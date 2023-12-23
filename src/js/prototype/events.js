import $ from '@fr0st/query';
import { getPosition } from '@fr0st/ui';

/**
 * Attach events for the Switch.
 */
export function _events() {
    $.addEvent(this._node, 'focus.ui.switch', (_) => {
        $.focus(this._outerContainer);
    });

    $.addEvent(this._node, 'change.ui.switch', (e) => {
        if (
            e.skipUpdate ||
            $.getDataset(this._container, 'uiAnimating') ||
            $.getDataset(this._container, 'uiSliding')
        ) {
            return;
        }

        const checked = this.getState();
        this._animateState(checked);
    });

    $.addEvent(this._outerContainer, 'keyup.ui.switch', (e) => {
        if (
            e.code !== 'Space' ||
            $.getDataset(this._container, 'uiAnimating') ||
            $.getDataset(this._container, 'uiSliding')
        ) {
            return;
        }

        this.toggleState();
    });

    $.addEvent(this._outerContainer, 'click.ui.switch', (e) => {
        if (
            e.button ||
            $.getDataset(this._container, 'uiAnimating') ||
            $.getDataset(this._container, 'uiSliding')
        ) {
            return;
        }

        this.toggleState();
    });

    let startX;

    const downEvent = (e) => {
        if (
            e.button ||
            $.getDataset(this._container, 'uiAnimating') ||
            $.getDataset(this._container, 'uiSliding')
        ) {
            return false;
        }

        const pos = getPosition(e);
        startX = pos.x - this._currentX;
    };

    const moveEvent = (e) => {
        if (!$.getDataset(this._container, 'uiSliding')) {
            $.setDataset(this._container, { uiSliding: true });
        }

        const pos = getPosition(e);
        const currentX = pos.x;
        this._currentX = $._clamp(currentX - startX, -this._toggleWidth, 0);

        $.setStyle(this._container, { transform: `translateX(${this._currentX}px)` });
    };

    const upEvent = (_) => {
        if (!$.getDataset(this._container, 'uiSliding')) {
            return;
        }

        const checked = Math.abs(this._currentX) < this._toggleWidth / 2;

        setTimeout((_) => {
            $.removeDataset(this._container, 'uiSliding');

            this._animateState(checked);
        }, 0);
    };

    const dragEvent = $.mouseDragFactory(downEvent, moveEvent, upEvent, { preventDefault: false });

    $.addEvent(this._outerContainer, 'mousedown.ui.switch touchstart.ui.switch', dragEvent);
};
