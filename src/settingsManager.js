// settingsComponent.js

import { SlInput, SlRange, SlSwitch } from '@shoelace-style/shoelace';

export class SettingsManager {
    constructor() {
        this.settingsContainer = null;
        this.settings = {};
    }

    init({ settingsElement }) {
        this.settingsContainer = document.querySelector(settingsElement);
    }

    addSetting(settingConfig) {
        const { sltype, name, options } = settingConfig;
        let settingElement = document.createElement(sltype);

        for (let [key, value] of Object.entries(options)) {
            if (value !== null) { // Only set non-null properties
                settingElement[key] = value;
            }
            // some shoelace components use innerText instead of label
            if (key === 'label') {
                settingElement.innerText = value;
            }
        }

        this.settingsContainer.appendChild(settingElement);
        this.settings[name] = settingElement;

        // Define a getter for direct property access
        Object.defineProperty(this, name, {
            get: () => this.getSettingValue(name)
        });
    }

    add(...settingConfigs) {
        settingConfigs.forEach(config => this.addSetting(config));
    }

    getSettingValue(settingName) {

        console.log('getter',this.settings[settingName]);

        if (!this.settings[settingName]) {
            throw new Error(`Setting ${settingName} not found.`);
        }

        return this.settings[settingName].value;
    }
}

export const mySettings = new SettingsManager();


function _toKebabCase(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
