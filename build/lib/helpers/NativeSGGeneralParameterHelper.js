"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeSGGeneralParameterHelper = void 0;
const IHelper_1 = require("./IHelper");
const exclutionsList = [
    '0_userdata.0',
    'admin.0',
    'area-floor-room-handler.0',
    'device-availability.0',
    'harmonize-battery-states.0',
    'info.0',
    'javascript.0',
    'scene.0',
    'script.js',
    'swissglider1adapter.0',
    'web.0',
    'system.',
];
class NativeSGGeneralParameterHelper extends IHelper_1.Helper {
    constructor() {
        super(...arguments);
        this.allDevicesChannelsStatesEnums = {};
    }
    async onReady() {
        try {
            await this.unsubsrcibeToAll();
            await this.updateObjectsFor_NativeSwissgliderGeneralParameters();
            await this.subsrcibeToAll();
            this.listenToSubscribtions();
        }
        catch (error) {
            this.adapter.log.error('Error on NativeSGGeneralParameterHelper:NativeSGGeneralParameterHelper');
            this.adapter.log.debug(error.name);
            this.adapter.log.debug(error.message);
            this.adapter.log.debug(error.stack);
        }
        return;
    }
    async onUnload() {
        this.unsubsrcibeToAll();
        return;
    }
    async onMessage(commandName, obj) {
        //TODO
        try {
            if (!obj.callback || obj.callback === null || obj.callback === undefined) {
                return false;
            }
            if (commandName === 'stopListeningToAll') {
                await this.unsubsrcibeToAll();
                const returnMsg = 'unsubsrcibeToAll was succesfully done';
                this.adapter.log.silly(returnMsg);
                this.adapter.sendTo(obj.from, obj.command, { title: 'NativeSGGeneralParameterHelper.stopListeningToAll', message: returnMsg }, obj.callback);
                return true;
            }
            else if (commandName === 'startListeningToAll') {
                await this.subsrcibeToAll();
                this.listenToSubscribtions();
                const returnMsg = 'subsrcibeToAll was succesfully done';
                this.adapter.log.silly(returnMsg);
                this.adapter.sendTo(obj.from, obj.command, { title: 'NativeSGGeneralParameterHelper.startListeningToAll', message: returnMsg }, obj.callback);
                return true;
            }
            else if (commandName === 'writtingAllGeneralparameter') {
                await this.onReady();
                const returnMsg = 'writting done for all';
                this.adapter.log.silly(returnMsg);
                this.adapter.sendTo(obj.from, obj.command, { title: 'NativeSGGeneralParameterHelper.writtingAllGeneralparameter', message: returnMsg }, obj.callback);
                return true;
            }
        }
        catch (error) {
            this.adapter.log.error('Error on NativeSGGeneralParameterHelper:onMessage');
            this.adapter.log.debug(error.name);
            this.adapter.log.debug(error.message);
            this.adapter.log.debug(error.stack);
        }
        return false;
    }
    /**
     * the following parameter will be added or updated to the object given as parameter in native:swissglider:general:
     * If there the parameter is undefined, all object will be updated
     * :
     * (for channel/device/state)
     * adapterName => (i.e shelly.0)
     * instanceName => (i.e shelly)
     * instanceNunber => (i.e 0)
     * deviceName => if a device is above in the structure
     * channelName => if a channel is above in the structure
     * stateName => if it is a state (can be an object with languages)
     * id
     * displayName => if it is a state
     *
     * (for enum)
     * parentName => if available (can be an object with languages)
     * name => (can be an object with languages)
     * orgMembers => copy from common:memebers to compair on changes
     *
     */
    async updateObjectsFor_NativeSwissgliderGeneralParameters() {
        try {
            this.adapter.log.debug('Start Updating all Objects');
            this.allDevicesChannelsStatesEnums = await this.getAllDevicesChannelsStatesEnums();
            for (const [key, value] of Object.entries(this.allDevicesChannelsStatesEnums)) {
                await this.updateObjectFor_NativeSwissgliderGeneralParameters(key, value);
            }
            this.adapter.log.silly('Used times: ' + JSON.stringify(this.usedTimes));
            this.adapter.log.debug('Finished Updating all Objects');
        }
        catch (error) {
            this.adapter.log.error('Error on NativeSGGeneralParameterHelper:updateObjectsFor_NativeSwissgliderGeneralParameters');
            this.adapter.log.debug(error.name);
            this.adapter.log.debug(error.message);
            this.adapter.log.debug(error.stack);
        }
    }
    /**
     * the following parameter will be added or updated to the object given as parameter in native:swissglider:general:
     * => more details see method updateObjectsFor_NativeSwissgliderGeneralParameters
     */
    async updateObjectFor_NativeSwissgliderGeneralParameters(id, value) {
        if (id !== undefined) {
            if (value) {
                // to change
                await this.writNativeSGGeneralParameters(id, value);
            }
            else {
                // to delete
            }
        }
        return;
    }
    /**
     * subscribe to all
     */
    async subsrcibeToAll() {
        try {
            await this.adapter.subscribeForeignObjectsAsync('*');
        }
        catch (error) {
            this.adapter.log.error('Error on NativeSGGeneralParameterHelper:subsrcibeToAll');
            this.adapter.log.debug(error.name);
            this.adapter.log.debug(error.message);
            this.adapter.log.debug(error.stack);
        }
    }
    /**
     * unsubscribe to all
     */
    async unsubsrcibeToAll() {
        try {
            await this.adapter.unsubscribeForeignObjectsAsync('*');
        }
        catch (error) {
            this.adapter.log.error('Error on NativeSGGeneralParameterHelper:unsubsrcibeToAll');
            this.adapter.log.debug(error.name);
            this.adapter.log.debug(error.message);
            this.adapter.log.debug(error.stack);
        }
    }
    /**
     * listen on subscribed devices / channels / states / enums
     */
    listenToSubscribtions() {
        this.adapter.on('objectChange', async (id, obj) => {
            try {
                this.allDevicesChannelsStatesEnums = await this.getAllDevicesChannelsStatesEnums();
                if (obj) {
                    // The state was changed
                    await this.writNativeSGGeneralParameters(id, obj);
                    // TODO sendTo subscriber
                }
                else {
                    // The state was deleted
                    this.adapter.log.debug(`object ${id} deleted`);
                    // TODO sendTo subscriber
                }
            }
            catch (error) {
                this.adapter.log.error('Error on NativeSGGeneralParameterHelper:listenToSubscribtions');
                this.adapter.log.debug(error.name);
                this.adapter.log.debug(error.message);
                this.adapter.log.debug(error.stack);
            }
        });
    }
    /**
     * Write if needed the new objec native:swissglider:general entry
     */
    async writNativeSGGeneralParameters(id, obj) {
        var _a, _b;
        try {
            if (obj) {
                // test if needed
                if (!(exclutionsList.find((e) => id.startsWith(e)) === undefined)) {
                    return;
                }
                // The state was changed
                const oldSwissgliderGeneralStruct = ((_b = (_a = obj.native) === null || _a === void 0 ? void 0 : _a.swissglider) === null || _b === void 0 ? void 0 : _b.general)
                    ? obj.native.swissglider.general
                    : undefined;
                const dStart1 = new Date();
                const newSwissgliderGeneralStruct = await this.getINativeSwissgliderGeneralbyObject(id, obj);
                const dEnd1 = new Date();
                this.addUsedTime('writNativeSGGeneralParameters:getINativeSwissgliderGeneralbyObject', dStart1, dEnd1);
                const dStart2 = new Date();
                const isEqual = this.deepEqual(oldSwissgliderGeneralStruct, newSwissgliderGeneralStruct);
                const dEnd2 = new Date();
                this.addUsedTime('writNativeSGGeneralParameters:isEqual', dStart2, dEnd2);
                if (!isEqual) {
                    if (!obj.native || obj.native === null || obj.native === undefined) {
                        obj.native = {};
                    }
                    if (!('swissglider' in obj.native)) {
                        obj.native.swissglider = {};
                    }
                    obj.native.swissglider.general = newSwissgliderGeneralStruct;
                    const dStart3 = new Date();
                    await this.adapter.setForeignObjectAsync(id, obj);
                    const dEnd3 = new Date();
                    this.addUsedTime('writNativeSGGeneralParameters:setForeignObjectAsync', dStart3, dEnd3);
                }
            }
        }
        catch (error) {
            this.adapter.log.error('Error on NativeSGGeneralParameterHelper:writNativeSGGeneralParameters');
            this.adapter.log.debug(error.name);
            this.adapter.log.debug(error.message);
            this.adapter.log.debug(error.stack);
        }
        return;
    }
    /**
     * get INativeSwissgliderGeneral by object
     */
    async getINativeSwissgliderGeneralbyObject(id, obj) {
        const newSwissgliderGeneralStruct = {};
        let tmpID = id;
        const time1 = new Date();
        const time2 = new Date();
        while (tmpID.lastIndexOf('.') != -1) {
            const time1_1 = new Date();
            const tmpObject = this.allDevicesChannelsStatesEnums[tmpID];
            const time1_2 = new Date();
            this.addUsedTime('getINativeSwissgliderGeneralbyObject:1_1', time1_1, time1_2);
            if (tmpObject &&
                tmpObject.common.name &&
                tmpObject.common.name !== undefined &&
                tmpObject.common.name !== '' &&
                (tmpObject.type === 'device' || tmpObject.type === 'channel' || tmpObject.type === 'enum')) {
                if (tmpObject.type === 'device') {
                    newSwissgliderGeneralStruct.deviceName = tmpObject.common.name;
                }
                if (tmpObject.type === 'channel' &&
                    tmpObject.common.name !== 'Sensors and switches' &&
                    tmpObject.common.name !== 'Lights') {
                    newSwissgliderGeneralStruct.channelName = tmpObject.common.name;
                }
                if (tmpObject.type === 'enum') {
                    newSwissgliderGeneralStruct.parentName = tmpObject.common.name;
                }
            }
            tmpID = tmpID.substring(0, tmpID.lastIndexOf('.'));
        }
        const time3 = new Date();
        if (!('deviceName' in newSwissgliderGeneralStruct) ||
            newSwissgliderGeneralStruct.deviceName !== undefined ||
            newSwissgliderGeneralStruct.deviceName === '') {
            if ('channelName' in newSwissgliderGeneralStruct &&
                newSwissgliderGeneralStruct.channelName !== undefined &&
                newSwissgliderGeneralStruct.channelName !== '') {
                newSwissgliderGeneralStruct.deviceName = newSwissgliderGeneralStruct.channelName;
            }
        }
        const time4 = new Date();
        const re = /((^[\wa-zA-Zäßüö+\s+-]+)\.([\d]))/;
        const adapterNameA = re.exec(id);
        if (adapterNameA && Array.isArray(adapterNameA) && adapterNameA.length === 4) {
            newSwissgliderGeneralStruct.adapterName = adapterNameA[1];
            newSwissgliderGeneralStruct.instanceName = adapterNameA[2];
            newSwissgliderGeneralStruct.instanceNunber = Number(adapterNameA[3]);
        }
        const time5 = new Date();
        newSwissgliderGeneralStruct.id = id;
        if (obj.type !== 'enum') {
            if (obj.common.name && !(obj.common.name === null) && !(obj.common.name === undefined)) {
                if (typeof obj.common.name === 'string') {
                    newSwissgliderGeneralStruct.stateName = obj.common.name;
                }
                else {
                    this.adapter.log.error(`Statename for ${id} could not be set name: ${JSON.stringify(obj.common.name)}`);
                }
            }
            if ('channelName' in newSwissgliderGeneralStruct &&
                newSwissgliderGeneralStruct.channelName !== undefined &&
                newSwissgliderGeneralStruct.channelName !== '' &&
                'deviceName' in newSwissgliderGeneralStruct &&
                newSwissgliderGeneralStruct.deviceName !== undefined &&
                newSwissgliderGeneralStruct.deviceName !== '') {
                newSwissgliderGeneralStruct.displayName =
                    newSwissgliderGeneralStruct.deviceName + '.' + newSwissgliderGeneralStruct.channelName;
            }
            else {
                const tmpDN = 'channelName' in newSwissgliderGeneralStruct &&
                    newSwissgliderGeneralStruct.channelName !== undefined &&
                    newSwissgliderGeneralStruct.channelName !== ''
                    ? newSwissgliderGeneralStruct.channelName
                    : 'deviceName' in newSwissgliderGeneralStruct &&
                        newSwissgliderGeneralStruct.deviceName !== undefined &&
                        newSwissgliderGeneralStruct.deviceName !== ''
                        ? newSwissgliderGeneralStruct.deviceName
                        : newSwissgliderGeneralStruct.stateName;
                if (tmpDN && tmpDN !== null && tmpDN !== undefined)
                    newSwissgliderGeneralStruct.displayName = tmpDN;
            }
        }
        else {
            if (obj.common.name !== undefined)
                newSwissgliderGeneralStruct.enumName = obj.common.name;
            newSwissgliderGeneralStruct.orgMembers = obj.common.members;
        }
        const time6 = new Date();
        this.addUsedTime('getINativeSwissgliderGeneralbyObject:1', time1, time2);
        this.addUsedTime('getINativeSwissgliderGeneralbyObject:2', time2, time3);
        this.addUsedTime('getINativeSwissgliderGeneralbyObject:3', time3, time4);
        this.addUsedTime('getINativeSwissgliderGeneralbyObject:4', time4, time5);
        this.addUsedTime('getINativeSwissgliderGeneralbyObject:5', time5, time6);
        return newSwissgliderGeneralStruct;
    }
}
exports.NativeSGGeneralParameterHelper = NativeSGGeneralParameterHelper;
