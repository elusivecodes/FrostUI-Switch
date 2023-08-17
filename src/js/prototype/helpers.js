import $ from '@fr0st/query';

/**
 * Animate the switch checkbox state.
 * @param {Boolean} checked Whether to enable the switch checkbox.
 */
export function _animateState(checked) {
    if ($.getDataset(this._container, 'uiSliding')) {
        return;
    }

    if ($.getDataset(this._container, 'uiAnimating')) {
        $.stop(this._container, { finish: false });
    }

    let targetX; let progress;
    if (checked) {
        targetX = 0;
        progress = (this._toggleWidth - Math.abs(this._currentX)) / this._toggleWidth;
    } else {
        targetX = -this._toggleWidth;
        progress = Math.abs(this._currentX) / this._toggleWidth;
    }

    if (!this._options.animate || progress >= 1) {
        $.setStyle(this._container, { transform: `translateX(${targetX}px)` });
        this._currentX = targetX;
        this._setState(checked);
        $.removeDataset(this._container, 'uiAnimating');
        return;
    }

    const progressRemaining = 1 - progress;

    $.setDataset(this._container, { uiAnimating: true });

    $.animate(
        this._container,
        (node, newProgress) => {
            this._currentX = $._lerp(this._currentX, targetX, progress + (newProgress * progressRemaining));
            $.setStyle(node, { transform: `translateX(${this._currentX}px)` });
        },
        {
            duration: this._options.duration * progressRemaining,
        },
    ).then((_) => {
        $.removeDataset(this._container, 'uiAnimating');
        this._currentX = targetX;
        this._setState(checked);
    }).catch((_) => {
        $.removeDataset(this._container, 'uiAnimating');
    });
};

/**
 * Refresh the label/divider widths.
 */
export function _refresh() {
    if (this._options.labelWidth) {
        this._toggleWidth = this._options.labelWidth;
    } else {
        this._toggleWidth = Math.max(
            $.width(this._onToggle),
            $.width(this._offToggle),
        );
    }

    if (this._options.dividerWidth) {
        this._dividerWidth = this._options.dividerWidth;
    } else {
        this._dividerWidth = this._toggleWidth / 2;
    }

    const outerWidth = this._toggleWidth + this._dividerWidth;
    const totalWidth = (this._toggleWidth * 2) + this._dividerWidth;

    $.setStyle(this._outerContainer, { width: `${outerWidth}px` });
    $.setStyle(this._container, {
        width: `${totalWidth}px`,
        transform: `translateX(${-this._toggleWidth}px)`,
    });
    $.setStyle(this._onToggle, { width: `${this._toggleWidth}px` });
    $.setStyle(this._divider, { width: `${this._dividerWidth}px` });
    $.setStyle(this._offToggle, { width: `${this._toggleWidth}px` });
};

/**
 * Refresh the disabled styling.
 */
export function _refreshDisabled() {
    const disabled = $.is(this._node, ':disabled');

    if (disabled) {
        $.addClass(this._outerContainer, this.constructor.classes.disabled);
    } else {
        $.removeClass(this._outerContainer, this.constructor.classes.disabled);
    }

    $.setAttribute(this._outerContainer, {
        'aria-disabled': disabled,
        'tabindex': disabled ? -1 : 0,
    });
};

/**
 * Set the switch checkbox state.
 * @param {Boolean} checked Whether to enable the switch checkbox.
 */
export function _setState(checked) {
    $.setAttribute(this._outerContainer, { 'aria-checked': checked });

    if (this.getState() === checked) {
        return;
    }

    $.setProperty(this._node, { checked });
    $.triggerEvent(this._node, 'change.ui.switch', { data: { skipUpdate: true } });
};
