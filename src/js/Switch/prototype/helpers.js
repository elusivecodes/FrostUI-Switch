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
