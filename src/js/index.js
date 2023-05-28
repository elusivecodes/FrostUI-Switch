import { initComponent } from '@fr0st/ui';
import Switch from './switch.js';
import { _events } from './prototype/events.js';
import { _animateState, _refresh, _refreshDisabled, _setState } from './prototype/helpers.js';
import { _render } from './prototype/render.js';

// Switch default options
Switch.defaults = {
    size: 'md',
    onStyle: 'text-bg-primary',
    offStyle: 'text-bg-secondary',
    dividerStyle: 'bg-body-tertiary',
    onText: 'ON',
    offText: 'OFF',
    labelWidth: null,
    dividerWidth: null,
    animate: true,
    duration: 500,
};

// Switch class names
Switch.classes = {
    disabled: 'switch-disabled',
    hide: 'visually-hidden',
    outer: 'switch-outer',
    switch: 'switch',
    toggleDivider: 'switch-toggle-divider',
    toggleOff: 'switch-toggle-off',
    toggleOn: 'switch-toggle-on',
};

// Switch prototype
const proto = Switch.prototype;

proto._animateState = _animateState;
proto._events = _events;
proto._refresh = _refresh;
proto._refreshDisabled = _refreshDisabled;
proto._render = _render;
proto._setState = _setState;

// Switch init
initComponent('switch', Switch);

export default Switch;
