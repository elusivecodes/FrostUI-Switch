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
