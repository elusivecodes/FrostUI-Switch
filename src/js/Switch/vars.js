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
