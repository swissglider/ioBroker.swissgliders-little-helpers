"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeSGElementRemoverHelper = void 0;
const IHelper_1 = require("./IHelper");
class NativeSGElementRemoverHelper extends IHelper_1.Helper {
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
        if (commandName === 'deleteNativeElements') {
            //stop overwritte on all changes the object !
            const message = {
                instanceName: '',
                command: 'stopListeningToAll',
                message: {},
            };
            const result = await this.adapter.sendToAsync(this.adapter.namespace, 'general', message);
            if (result &&
                result !== null &&
                result !== undefined &&
                typeof result === 'object' &&
                !('error' in result)) {
                // start deleting
                this.deleteNativeElements(obj);
            }
            else {
                if (result !== undefined) {
                    this.adapter.sendTo(obj.from, obj.command, result, obj.callback);
                }
                else {
                    this.adapter.sendTo(obj.from, obj.command, { error: 'unknown error while trying to stop deleteNativeElements' }, obj.callback);
                }
            }
            return true;
        }
        return false;
    }
    /**
     * Deletes all the native elements in the message.entries from the types defined in message.types
     */
    async deleteNativeElements(obj) {
        if (obj &&
            obj !== null &&
            obj !== undefined &&
            typeof obj === 'object' &&
            'message' in obj &&
            obj.message &&
            obj.message !== null &&
            obj.message !== undefined &&
            typeof obj.message === 'object' &&
            'message' in obj.message &&
            obj.message.message &&
            obj.message.message !== null &&
            obj.message.message !== undefined &&
            typeof obj.message.message === 'object' &&
            'types' in obj.message.message &&
            obj.message.message.types &&
            obj.message.message.types !== null &&
            obj.message.message.types !== undefined &&
            Array.isArray(obj.message.message.types) &&
            'entries' in obj.message.message &&
            obj.message.message.entries &&
            obj.message.message.entries !== null &&
            obj.message.message.entries !== undefined &&
            Array.isArray(obj.message.message.entries)) {
            const deleteOnElement = [];
            const devicesEmpty = await this.getAllDevicesChannelsStatesEnums(obj.message.message.types);
            for (const [key, value] of Object.entries(devicesEmpty)) {
                if (value &&
                    value !== undefined &&
                    'native' in value &&
                    value.native !== undefined &&
                    typeof value.native === 'object' &&
                    Object.keys(value.native).length > 0) {
                    let toDelete = false;
                    try {
                        for (const entry of obj.message.message.entries) {
                            const temp = entry.split('.').reduce((o, i) => o[i], value.native);
                            if (temp !== null && temp !== undefined) {
                                deleteOnElement.push(`<b>${entry}</b> <span style="color:black">delete on</span> <b>${key}</b>`);
                                const path = entry.split('.');
                                const toDeleteParam = path.pop();
                                const hal = path.reduce((o, i) => o[i], value.native);
                                delete hal[toDeleteParam];
                                toDelete = true;
                            }
                        }
                    }
                    catch (e) {
                        continue;
                    }
                    if (toDelete) {
                        await this.adapter.setForeignObjectAsync(key, value);
                        this.adapter.log.debug(`finished saving ${key}`);
                    }
                }
            }
            // Feedback to the caller
            if ('callback' in obj && obj.callback && obj.callback !== null && obj.callback !== undefined) {
                const result = {
                    title: 'Enum Natice Elements',
                    message: `All configured Elements are deleted: <br><b style="color:red;">Please start the NativeSGGeneralHelper again, this was stopped</b><br>
                    <pre>${JSON.stringify(obj.message.message.entries, null, 3)}</pre><hr>from the following types: <br><pre>${JSON.stringify(obj.message.message.types, null, 3)}</pre><hr>Changes done on the following objects: <br><pre>${JSON.stringify(deleteOnElement, null, 3)}</pre>`,
                };
                this.adapter.sendTo(obj.from, obj.command, result, obj.callback);
            }
        }
        else if (obj &&
            obj !== null &&
            obj !== undefined &&
            typeof obj === 'object' &&
            'callback' in obj &&
            obj.callback &&
            obj.callback !== null &&
            obj.callback !== undefined) {
            const result = {
                title: 'Enum Native Elements',
                error: `Something wrong with the message: <br><hr><pre>${JSON.stringify(obj, null, 3)}</pre>`,
            };
            this.adapter.sendTo(obj.from, obj.command, result, obj.callback);
        }
        else {
            this.adapter.log.error('Something wrong with the message');
        }
        return;
    }
}
exports.NativeSGElementRemoverHelper = NativeSGElementRemoverHelper;
