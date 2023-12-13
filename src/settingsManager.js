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

//     addSetting(settingConfig) {
//     if (!this.settingsContainer) {
//         throw new Error('Settings container not initialized.');
//     }

//     let settingElement;
//     const { sltype, name, options } = settingConfig;

//     switch (sltype) {
//         case 'sl-input':
//             settingElement = document.createElement('sl-input');
//             break;
//         case 'sl-range':
//             settingElement = document.createElement('sl-range');
//             break;
//         default:
//             throw new Error(`Unsupported setting type: ${sltype}`);
//     }

//     for (let [key, value] of Object.entries(options)) {
//         if (value !== null) { // Only set non-null properties
//             settingElement[key] = value;
//         }
//     }

//     this.settingsContainer.appendChild(settingElement);
//     this.settings[name] = settingElement;
// }


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
