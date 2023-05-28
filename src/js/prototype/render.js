import $ from '@fr0st/query';

/**
 * Render the switch.
 */
export function _render() {
    this._outerContainer = $.create('div', {
        class: [
            this.constructor.classes.outer,
            `switch-${this._options.size}`,
        ],
        attributes: {
            tabindex: 0,
        },
    });

    this._container = $.create('div', {
        class: this.constructor.classes.switch,
    });

    this._onToggle = $.create('div', {
        class: [this.constructor.classes.toggleOn, this._options.onStyle],
        text: this._options.onText,
    });

    this._divider = $.create('div', {
        class: [this.constructor.classes.toggleDivider, this._options.dividerStyle],
        text: '',
    });

    this._offToggle = $.create('div', {
        class: [this.constructor.classes.toggleOff, this._options.offStyle],
        text: this._options.offText,
    });

    $.append(this._container, this._onToggle);
    $.append(this._container, this._divider);
    $.append(this._container, this._offToggle);
    $.append(this._outerContainer, this._container);

    // hide the input node
    $.addClass(this._node, this.constructor.classes.hide);
    $.setAttribute(this._node, { tabindex: -1 });

    $.before(this._node, this._outerContainer);
};
