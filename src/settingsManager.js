// settingsComponent.js

import { SlInput, SlRange, SlSwitch } from '@shoelace-style/shoelace'

export class SettingsManager {
    constructor() {
        this.settingsContainer = null
        this.settings = {}
    }

    init({ settingsElement }) {
        this.settingsContainer = document.querySelector(settingsElement)
    }

    addSetting(settingConfig) {
        // throw error is kebab case is used
        if (settingConfig.name.includes('-')) {
            throw new Error(
                'The name `' +
                    settingConfig.name +
                    '` must not contain a hypen. Use camelCase instead to create a valid variable name.'
            )
        }

        const { sltype, name, options } = settingConfig

        let settingElement = document.createElement(sltype)

        for (let [key, value] of Object.entries(options)) {
            if (value !== null) {
                // Only set non-null properties
                settingElement[key] = value
            }
            // some shoelace components use innerText instead of label
            if (key === 'label') {
                settingElement.innerText = value
            }
        }

        this.settingsContainer.appendChild(settingElement)
        this.settings[name] = settingElement

        // Define a getter for direct property access
        // be sure this is not a dubplicate property
        if (this.hasOwnProperty(name)) {
            throw new Error(`The name ${name} is already in use.`)
        }

        Object.defineProperty(this, name, {
            get: () => this.getSettingValue(name),
        })

        // console.log('getter created', name);
    }

    add(...settingConfigs) {
        settingConfigs.forEach((config) => this.addSetting(config))
    }

    getSettingValue(settingName) {
        if (!this.settings[settingName]) {
            throw new Error(`Setting ${settingName} not found.`)
        }

      // if the setting is a number, cast it to a number
        if (this.settings[settingName].type === 'number') {
            return Number(this.settings[settingName].value)
        }

        return (
            this.settings[settingName].value ??
            this.settings[settingName].checked ??
            null
        )
    }
}

export const mySettings = new SettingsManager()
