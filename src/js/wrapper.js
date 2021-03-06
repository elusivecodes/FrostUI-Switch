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

    // {{code}}
});