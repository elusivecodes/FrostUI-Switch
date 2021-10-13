/**
 * Switch Render
 */

Object.assign(Switch.prototype, {

    /**
     * Render the switch.
     */
    _render() {
        this._outerContainer = dom.create('div', {
            class: this.constructor.classes.outer,
            attributes: {
                tabindex: 0
            }
        });

        this._container = dom.create('div', {
            class: `switch-${this._settings.size}`
        });

        const onToggle = dom.create('div', {
            class: [this.constructor.classes.toggle, this.constructor.classes.toggleOn, `switch-${this._settings.onStyle}`],
            text: this._settings.onText
        });

        const divider = dom.create('div', {
            class: [this.constructor.classes.toggle, this.constructor.classes.toggleDivider, `switch-${this._settings.dividerStyle}`],
            text: ''
        });

        const offToggle = dom.create('div', {
            class: [this.constructor.classes.toggle, this.constructor.classes.toggleOff, `switch-${this._settings.offStyle}`],
            text: this._settings.offText
        });

        dom.append(this._container, onToggle);
        dom.append(this._container, divider);
        dom.append(this._container, offToggle);
        dom.append(this._outerContainer, this._container);

        // hide the input node
        dom.addClass(this._node, this.constructor.classes.hide);
        dom.setAttribute(this._node, 'tabindex', -1);

        dom.before(this._node, this._outerContainer);

        if (this._settings.labelWidth) {
            this._toggleWidth = this._settings.labelWidth;
        } else {
            this._toggleWidth = Math.max(
                dom.width(onToggle),
                dom.width(divider),
                dom.width(offToggle)
            );
        }

        dom.setStyle(this._outerContainer, 'width', `${this._toggleWidth * 2}px`);
        dom.setStyle(this._container, 'width', `${this._toggleWidth * 3}px`);
        dom.setStyle(this._container, 'transform', `translateX(${-this._toggleWidth}px)`);
        dom.setStyle(onToggle, 'width', `${this._toggleWidth}px`);
        dom.setStyle(divider, 'width', `${this._toggleWidth}px`);
        dom.setStyle(offToggle, 'width', `${this._toggleWidth}px`);
    }

});
