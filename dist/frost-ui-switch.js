/**
 * FrostUI-Switch v1.0
 * https://github.com/elusivecodes/FrostUI-Switch
 */
(function(global, factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory;
    } else {
        factory(global);
    }

})(window, function(window) {
    'use strict';

    if (!window) {
        throw new Error('FrostUI-Switch requires a Window.');
    }

    if (!('UI' in window)) {
        throw new Error('FrostUI-Switch requires FrostUI.');
    }

    const Core = window.Core;
    const dom = window.dom;
    const UI = window.UI;

    /**
     * Switch Class
     * @class
     */
    class Switch extends UI.BaseComponent {

        /**
         * New Switch constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [settings] The options to create the Switch with.
         * @returns {Switch} A new Switch object.
         */
        constructor(node, settings) {
            super(node, settings);

            this._render();
            this._events();

            this._currentX = -this._toggleWidth;
            const checked = dom.getProperty(this._node, 'checked');
            this._animateState(checked);

            this._refreshDisabled();
        }

        /**
         * Disable the Switch.
         * @returns {Switch} The Switch.
         */
        disable() {
            dom.setAttribute(this._node, 'disabled', true);
            this._refreshDisabled();

            return this;
        }

        /**
         * Dispose the Switch.
         */
        dispose() {
            dom.remove(this._outerContainer);
            dom.removeEvent(this._node, 'focus.ui.switch');
            dom.removeEvent(this._node, 'change.ui.switch');
            dom.removeAttribute(this._node, 'tabindex');
            dom.removeClass(this._node, this.constructor.classes.hide);

            this._outerContainer = null;
            this._container = null;

            super.dispose();
        }

        /**
         * Enable the Switch.
         * @returns {Switch} The Switch.
         */
        enable() {
            dom.removeAttribute(this._node, 'disabled');
            this._refreshDisabled();

            return this;
        }

        /**
         * Get the switch checkbox state.
         * @returns {Boolean} Whether the switch checkbox is enabled.
         */
        getState() {
            return dom.getProperty(this._node, 'checked')
        }

        /**
         * Set the switch checkbox state.
         * @param {Boolean} enabled Whether to enable the switch checkbox.
         * @returns {Switch} The Switch.
         */
        setState(enabled) {
            this._animateState(enabled);

            return this;
        }

        /**
         * Toggle switch checkbox state.
         * @returns {Switch} The Switch.
         */
        toggleState() {
            const enabled = this.getState();

            this._animateState(!enabled);

            return this;
        }

    }


    /**
     * Switch Events
     */

    Object.assign(Switch.prototype, {

        /**
         * Attach events for the Switch.
         */
        _events() {
            dom.addEvent(this._node, 'focus.ui.switch', _ => {
                dom.focus(this._outerContainer);
            });

            dom.addEvent(this._node, 'change.ui.switch', e => {
                if (!e.isTrusted || this._animating || this._sliding) {
                    return;
                }

                const enabled = this.getState();
                this._animateState(enabled);
            });

            dom.addEvent(this._outerContainer, 'keyup.ui.switch', e => {
                if (e.code !== 'Space') {
                    return;
                }

                const enabled = this.getState();
                this._animateState(!enabled);
            });

            dom.addEvent(this._outerContainer, 'click.ui.switch', e => {
                if (e.button || this._animating || this._sliding) {
                    return;
                }

                const checked = this.getState();
                this._animateState(!checked);
            });

            let startX;
            dom.addEvent(this._outerContainer, 'mousedown.ui.switch touchstart.ui.switch', dom.mouseDragFactory(
                e => {
                    if (e.button || this._animating || this._sliding) {
                        return false;
                    }

                    const pos = UI.getPosition(e);
                    startX = pos.x - this._currentX;
                },
                e => {
                    if (!this._sliding) {
                        this._sliding = true;
                    }

                    const pos = UI.getPosition(e);
                    const currentX = pos.x;
                    this._currentX = Core.clamp(currentX - startX, -this._toggleWidth, 0);

                    dom.setStyle(this._container, 'transform', `translateX(${this._currentX}px)`);

                    const enabled = Math.abs(this._currentX) < this._toggleWidth / 2;
                    this._setState(enabled);
                },
                _ => {
                    if (this._sliding) {
                        const enabled = this.getState();
                        this._animateState(enabled);
                    }

                    setTimeout(_ => {
                        this._sliding = false;
                    }, 0);
                }
            ), { passive: true });
        }

    });


    /**
     * Switch Helpers
     */

    Object.assign(Switch.prototype, {

        /**
         * Animate the switch checkbox state.
         * @param {Boolean} enabled Whether to enable the switch checkbox.
         */
        _animateState(enabled) {
            if (this._animating) {
                dom.stop(this._container);
            }

            let targetX, progress;
            if (enabled) {
                targetX = 0;
                progress = (this._toggleWidth - Math.abs(this._currentX)) / this._toggleWidth;
            } else {
                targetX = -this._toggleWidth;
                progress = Math.abs(this._currentX) / this._toggleWidth;
            }

            if (!this._settings.animate || progress >= 1) {
                dom.setStyle(this._container, 'transform', `translateX(${targetX}px)`);
                this._currentX = targetX;
                this._setState(enabled);
                this._animating = false;
                return;
            }

            const progressRemaining = 1 - progress;

            this._animating = true;
            dom.animate(
                this._container,
                (node, newProgress) => {
                    const currentX = Core.lerp(this._currentX, targetX, progress + (newProgress * progressRemaining));
                    dom.setStyle(node, 'transform', `translateX(${currentX}px)`);
                },
                {
                    duration: this._settings.duration * progressRemaining
                }
            ).then(_ => {
                this._currentX = targetX;
                this._setState(enabled);
            }).finally(_ => {
                this._animating = false;
            });
        },

        /**
         * Refresh the disabled styling.
         */
        _refreshDisabled() {
            if (dom.is(this._node, ':disabled')) {
                dom.addClass(this._outerContainer, this.constructor.classes.disabled);
            } else {
                dom.removeClass(this._outerContainer, this.constructor.classes.disabled);
            }
        },

        /**
         * Set the switch checkbox state.
         * @param {Boolean} enabled Whether to enable the switch checkbox.
         */
        _setState(enabled) {
            if (this.getState() === enabled) {
                return;
            }

            dom.setProperty(this._node, 'checked', enabled);

            dom.triggerEvent(this._node, 'change.ui.switch');
        }

    });


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


    // Switch default options
    Switch.defaults = {
        size: 'md',
        onStyle: 'primary',
        offStyle: 'secondary',
        dividerStyle: 'light',
        onText: 'ON',
        offText: 'OFF',
        labelWidth: null,
        animate: true,
        duration: 500
    };

    // Switch classes
    Switch.classes = {
        disabled: 'switch-disabled',
        hide: 'visually-hidden',
        outer: 'overflow-hidden user-select-none switch-outer',
        toggle: 'd-table-cell text-center',
        toggleDivider: 'switch-toggle-divider',
        toggleOff: 'switch-toggle-off',
        toggleOn: 'switch-toggle-on'
    };

    UI.initComponent('switch', Switch);

    UI.Switch = Switch;

});