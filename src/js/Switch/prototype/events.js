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
