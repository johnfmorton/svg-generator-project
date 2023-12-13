// settingsComponent.js

import { SlInput, SlRange } from '@shoelace-style/shoelace';

export class SettingsManager {
    constructor() {
        this.settingsContainer = null;
        this.settings = {};
    }

    init({ settingsElement }) {
        this.settingsContainer = document.querySelector(settingsElement);
    }

    addSetting(settingConfig) {
        if (!this.settingsContainer) {
            throw new Error('Settings container not initialized.');
        }

        let settingElement;
        const { sltype, name, options } = settingConfig;

        switch (sltype) {
            case 'sl-input':
                settingElement = new SlInput();
                break;
            case 'sl-range':
                settingElement = new SlRange();
                break;
            default:
                throw new Error(`Unsupported setting type: ${sltype}`);
        }

        Object.assign(settingElement, options);
        this.settingsContainer.appendChild(settingElement);
        this.settings[name] = settingElement;
    }

    add(...settingConfigs) {
        settingConfigs.forEach(config => this.addSetting(config));
    }

    getSettingValue(settingName) {
        if (!this.settings[settingName]) {
            throw new Error(`Setting ${settingName} not found.`);
        }

        return this.settings[settingName].value;
    }
}

export const mySettings = new SettingsManager();
