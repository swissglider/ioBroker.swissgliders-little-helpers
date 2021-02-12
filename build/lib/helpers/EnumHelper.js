"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumHelper = void 0;
const IHelper_1 = require("./IHelper");
class EnumHelper extends IHelper_1.Helper {
    async onReady() {
        return;
    }
    async onUnload() {
        return;
    }
    async onMessage(commandName, obj) {
        if (!obj.callback || obj.callback === null || obj.callback === undefined) {
            return false;
        }
        if (commandName === 'getEnumConfiguration') {
            this.getEnumConfiguration(obj);
            return true;
        }
        else if (commandName === 'overwritteAllEnums') {
            this.overwritteAllEnums(obj);
        }
        else if (commandName === 'deleteAllEnums') {
            this.deleteAllEnums(obj);
        }
        return false;
    }
    /**
     * get enum configuration
     *
     */
    async getEnumConfiguration(obj) {
        this.adapter.log.debug('getEnumConfiguration started');
        if (obj !== null) {
            const enums = await this.adapter.getEnumsAsync('');
            if (enums !== null && enums !== undefined) {
                const new_enums = {};
                for (const [key, singel_enum] of Object.entries(enums)) {
                    const members = {};
                    for (const [keyS, value] of Object.entries(singel_enum)) {
                        if (value &&
                            value !== undefined &&
                            'common' in value &&
                            'members' in value.common &&
                            Array.isArray(value.common.members) &&
                            value.common.members.length > 0) {
                            members[keyS] = value.common.members;
                        }
                        else {
                            members[keyS] = [];
                        }
                    }
                    new_enums[key] = members;
                }
                if (obj && obj !== undefined && obj.callback) {
                    const date_now = new Date().toLocaleDateString();
                    const file_name = `enum_configuration_${date_now}.json`;
                    const result = {
                        title: 'Enum Configuration as JSON',
                        message: `Files saved as ${file_name}`,
                        toJSONFile: new_enums,
                        fileName: 'enum_configuration_' + file_name + '.json',
                    };
                    this.adapter.sendTo(obj.from, obj.command, result, obj.callback);
                }
            }
        }
        this.adapter.log.debug('getEnumConfiguration finished');
    }
    /**
     * Overwritte all the enums (delete all first) with the ones in the message
     */
    async overwritteAllEnums(obj) {
        this.adapter.log.debug('overwritteAllEnums started');
        if (obj !== null &&
            obj !== undefined &&
            'message' in obj &&
            obj.message !== undefined &&
            typeof obj.message === 'object' &&
            'additionText' in obj.message &&
            obj.message.additionText !== undefined &&
            typeof obj.message.additionText === 'string') {
            const new_enums = JSON.parse(obj.message.additionText);
            if (!new_enums || new_enums === undefined || typeof new_enums !== 'object') {
                this.adapter.log.error('overwritteAllEnums finished with Error: Input file is wrong');
                if (obj && obj !== undefined && obj.callback) {
                    const result = {
                        title: 'Enum Configuration as JSON',
                        error: `overwritteAllEnums finished with Error: Input file is wrong: <br><hr><br><pre>${obj.message.additionText}</pre>`,
                    };
                    this.adapter.sendTo(obj.from, obj.command, result, obj.callback);
                }
                return;
            }
            // 1) delete all enums on iobroker and also on the object it self
            this.deleteAllEnums(undefined);
            // 2) check if the main enum groups exists if not, create it (from the message)
            // 3) check if all the enum exists if not, create it (from the message)
            for (const [key, value] of Object.entries(new_enums)) {
                const tempEG = await this.adapter.getForeignObjectAsync(key);
                if (!tempEG || tempEG === null || tempEG === undefined) {
                    const tmpEnumObject = {
                        _id: key,
                        common: {
                            name: key.substring(key.indexOf('-') + 1),
                            members: [],
                            icon: '',
                            color: 'red',
                        },
                        type: 'enum',
                        native: {},
                    };
                    await this.adapter.setForeignObjectNotExistsAsync(key, tmpEnumObject);
                }
                if (value && value !== undefined && typeof value === 'object') {
                    for (const [keyE, valueE] of Object.entries(value)) {
                        let tempE = await this.adapter.getForeignObjectAsync(keyE);
                        if (!tempE || tempE === null || tempE === undefined) {
                            tempE = {
                                _id: keyE,
                                common: {
                                    name: keyE.substring(keyE.indexOf('-') + 1),
                                    members: [],
                                    icon: '',
                                    color: 'red',
                                },
                                type: 'enum',
                                native: {},
                            };
                        }
                        tempE.common.members = valueE;
                        await this.adapter.setForeignObjectAsync(keyE, tempE);
                    }
                }
            }
            // 4) answer to re  request
            if (obj && obj !== undefined && obj.callback) {
                const result = {
                    title: 'Enum Configuration as JSON',
                    icon: 'warning',
                    message: `all Enums are overwritten`,
                };
                this.adapter.sendTo(obj.from, obj.command, result, obj.callback);
            }
        }
        this.adapter.log.debug('overwritteAllEnums finished');
    }
    /**
     * delete all enums !!!!
     */
    async deleteAllEnums(obj) {
        const enums = await this.adapter.getEnumsAsync('');
        if (enums !== null && enums !== undefined) {
            for (const [, singel_enum] of Object.entries(enums)) {
                for (const [keyS, value] of Object.entries(singel_enum)) {
                    if (value &&
                        value !== undefined &&
                        'common' in value &&
                        'members' in value.common &&
                        Array.isArray(value.common.members) &&
                        value.common.members.length > 0) {
                        value.common.members = [];
                        await this.adapter.setForeignObjectAsync(keyS, value);
                    }
                }
            }
        }
        const types = obj &&
            obj !== undefined &&
            'message' in obj &&
            typeof obj.message === 'object' &&
            'message' in obj.message &&
            typeof obj.message.message === 'object' &&
            'types' in obj.message.message &&
            Array.isArray(obj.message.message.types)
            ? obj.message.message.types
            : undefined;
        const devicesEmpty = await this.getAllDevicesChannelsStatesEnums(types);
        for (const [key, value] of Object.entries(devicesEmpty)) {
            if (value &&
                value !== undefined &&
                'enums' in value &&
                value.enums !== undefined &&
                typeof value.enums === 'object' &&
                Object.keys(value.enums).length > 0) {
                value.enums = {};
                await this.adapter.setForeignObjectAsync(key, value);
            }
        }
        if (obj && obj !== undefined && obj.callback) {
            const result = {
                title: 'Enum Deletion',
                icon: 'delete_forever',
                message: `all Enums are deleted`,
            };
            this.adapter.sendTo(obj.from, obj.command, result, obj.callback);
        }
        return;
    }
}
exports.EnumHelper = EnumHelper;
