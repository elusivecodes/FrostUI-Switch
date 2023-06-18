import $ from '@fr0st/query';
import { BaseComponent, generateId } from '@fr0st/ui';

/**
 * Switch Class
 * @class
 */
export default class Switch extends BaseComponent {
    /**
     * New Switch constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [options] The options to create the Switch with.
     */
    constructor(node, options) {
        super(node, options);

        const id = $.getAttribute(this._node, 'id');
        this._label = $.findOne(`label[for="${id}"]`);

        if (this._label && !$.getAttribute(this._label, 'id')) {
            $.setAttribute(this._label, { id: generateId('switch-label') });
            this._labelId = true;
        }

        this._render();
        this._refresh();
        this._refreshDisabled();
        this._events();

        this._currentX = -this._toggleWidth;

        const checked = $.getProperty(this._node, 'checked');
        this._animateState(checked);
    }

    /**
     * Disable the Switch.
     */
    disable() {
        $.setAttribute(this._node, { disabled: true });
        this._refreshDisabled();
    }

    /**
     * Dispose the Switch.
     */
    dispose() {
        if (this._labelId) {
            $.removeAttribute(this._label, 'id');
        }

        $.remove(this._outerContainer);
        $.removeEvent(this._node, 'focus.ui.switch');
        $.removeEvent(this._node, 'change.ui.switch');
        $.removeAttribute(this._node, 'tabindex');
        $.removeClass(this._node, this.constructor.classes.hide);

        this._label = null;
        this._outerContainer = null;
        this._container = null;
        this._onToggle = null;
        this._divider = null;
        this._offToggle = null;

        super.dispose();
    }

    /**
     * Enable the Switch.
     */
    enable() {
        $.removeAttribute(this._node, 'disabled');
        this._refreshDisabled();
    }

    /**
     * Get the switch checkbox state.
     * @return {Boolean} Whether the switch checkbox is enabled.
     */
    getState() {
        return $.getProperty(this._node, 'checked');
    }

    /**
     * Set the switch checkbox state.
     * @param {Boolean} checked Whether to enable the switch checkbox.
     */
    setState(checked) {
        this._animateState(checked);
    }

    /**
     * Toggle switch checkbox state.
     */
    toggleState() {
        const checked = this.getState();
        this._animateState(!checked);
    }
}
