"use strict";
/*
 * Created with @iobroker/create-adapter v1.30.1
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwissglidersLittleHelpers = void 0;
// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = __importStar(require("@iobroker/adapter-core"));
const influx = __importStar(require("influx"));
const EnumHelper_1 = require("./lib/helpers/EnumHelper");
const NativeSGElementRemoverHelper_1 = require("./lib/helpers/NativeSGElementRemoverHelper");
const NativeSGGeneralParameterHelper_1 = require("./lib/helpers/NativeSGGeneralParameterHelper");
const types_to_search_devices = [
    // 'adapter',
    'channel',
    // 'config',
    'device',
    // 'enum',
    // 'folder',
    // 'group',
    // 'host',
    // 'info',
    // 'instance',
    'meta',
    // 'script',
    'state',
];
class SwissglidersLittleHelpers extends utils.Adapter {
    constructor(options = {}) {
        super({
            ...options,
            name: 'swissgliders-little-helpers',
        });
        this.nativeSGGeneralParameterHelper = new NativeSGGeneralParameterHelper_1.NativeSGGeneralParameterHelper(this);
        this.nativeSGElementRemoverHelper = new NativeSGElementRemoverHelper_1.NativeSGElementRemoverHelper(this);
        this.enumHelper = new EnumHelper_1.EnumHelper(this);
        this.on('ready', this.onReady.bind(this));
        this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        try {
            this.timerToStart();
            await this.enumHelper.onReady();
            await this.nativeSGGeneralParameterHelper.onReady();
            await this.nativeSGElementRemoverHelper.onReady();
            await this.enumHelper.onReady();
        }
        catch (error) {
            this.log.error('Error on SwissglidersLittleHelpers:onReady');
            this.log.debug(error.name);
            this.log.debug(error.message);
            this.log.debug(error.stack);
        }
        return;
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    async onUnload(callback) {
        try {
            if (this.timer) {
                clearTimeout(this.timer);
                await this.enumHelper.onUnload();
                await this.nativeSGElementRemoverHelper.onUnload();
                await this.nativeSGGeneralParameterHelper.onUnload();
            }
            callback();
        }
        catch (error) {
            this.log.error('Error on SwissglidersLittleHelpers:onUnload');
            this.log.debug(error.name);
            this.log.debug(error.message);
            this.log.debug(error.stack);
            callback();
        }
    }
    /**
     * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
     * Using this method requires "common.message" property to be set to true in io-package.json
     */
    async onMessage(obj) {
        try {
            if (typeof obj === 'object' && obj.message) {
                if (obj.command === 'general' &&
                    obj.message &&
                    obj.message !== null &&
                    obj.message !== undefined &&
                    typeof obj.message === 'object' &&
                    'instanceName' in obj.message &&
                    obj.message.instanceName !== null &&
                    obj.message.instanceName !== undefined &&
                    typeof obj.message.instanceName === 'string') {
                    if (obj.message.instanceName !== this.name && obj.message.instanceName !== '') {
                        // transfer to other adapters with according instanceNames
                        if ('command' in obj.message) {
                            this.sendTo(obj.message.instanceName, obj.message.command, obj.message.message, obj.callback);
                            return;
                        }
                        else {
                            this.sendTo(obj.message.instanceName, obj.message.message, obj.callback);
                            return;
                        }
                    }
                    else {
                        if (obj.callback) {
                            if ('command' in obj.message) {
                                if (obj.message.command === 'test') {
                                    // this.test(obj);
                                    return;
                                }
                                else if (await this.nativeSGElementRemoverHelper.onMessage(obj.message.command, obj)) {
                                    return;
                                }
                                else if (await this.nativeSGGeneralParameterHelper.onMessage(obj.message.command, obj)) {
                                    return;
                                }
                                else if (await this.enumHelper.onMessage(obj.message.command, obj)) {
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            const result = {
                title: 'Result from request',
                error: 'undefined <b>Achtung</b>',
            };
            this.sendTo(obj.from, obj.command, result, obj.callback);
        }
        catch (error) {
            this.log.error('Error on SwissglidersLittleHelpers:onMessage');
            this.log.debug(error.name);
            this.log.debug(error.message);
            this.log.debug(error.stack);
            if (obj.callback) {
                const result = {
                    title: 'Result from request',
                    error: `undefined <b>${JSON.stringify(error)}</b>`,
                };
                this.sendTo(obj.from, obj.command, result, obj.callback);
            }
        }
    }
    /**
     * test what ever you whant ;-)
     */
    async test(obj) {
        try {
            if (obj) {
            }
            else {
            }
            const stateName = 'hmip.0.devices.3014F711A0000A9BE993E1AC.channels.1.setPointTemperature';
            const firstName = 'test.test.1.setPointTemperature_New';
            const newName = 'test.test.1.setPointTemperature_New1';
            // create and activate
            const createResult = await this.sendToAsync('influxdb.0', 'enableHistory', {
                id: stateName,
                options: {
                    aliasId: firstName,
                    changesOnly: true,
                    debounce: 1000,
                    retention: 63072000,
                    maxLength: 10,
                    changesMinDelta: 0,
                    enabled: true,
                    changesRelogInterval: 120,
                },
            });
            this.log.warn(JSON.stringify(createResult));
            // deactivate
            this.sendToAsync('influxdb.0', 'disableHistory', { id: firstName });
            // rename
            const renameResult = await this.sendToAsync('influxdb.0', 'query', `select * into "${newName}" from "${firstName}" GROUP BY * ; DROP MEASUREMENT "${firstName}"`);
            this.log.warn(JSON.stringify(renameResult));
            // reactivate
            await this.sendToAsync('influxdb.0', 'enableHistory', {
                id: stateName,
                options: {
                    aliasId: newName,
                },
            });
            // list
            const listResult = await this.sendToAsync('influxdb.0', 'getEnabledDPs', {});
            if (listResult) {
                for (const [key, value] of Object.entries(listResult)) {
                    this.log.warn(key + ' : ' + JSON.stringify(value.aliasId));
                }
            }
        }
        catch (error) {
            this.log.error('Error on SwissglidersLittleHelpers:test');
            this.log.debug(error.name);
            this.log.debug(error.message);
            this.log.debug(error.stack);
        }
        return;
    }
    /**
     * Test influxdb directly
     */
    async testInfluxDBDirect() {
        try {
            const db_name = 'iobroker';
            const influ = new influx.InfluxDB({
                host: '192.168.88.101',
                port: 8086,
                protocol: 'http',
                username: '',
                password: '',
                database: db_name,
            });
            // this.log.warn(JSON.stringify(influ));
            // influ.getMeasurements().then((names) => this.log.warn('My measurement names are: ' + names.join(', ')));
            const dbName = await influ.getDatabaseNames();
            if (!dbName.includes(db_name)) {
                this.log.error(`Influx DB ${db_name} not exists!`);
            }
            const functions_enums = await this.getEnumsAsync('functions');
            for (const [key, value] of Object.entries(functions_enums['enum.functions'])) {
                // iterate over all function entries
                for (const id of value.common.members) {
                    const device_obj = await this.getForeignObjectAsync(id);
                    const device_state = await this.getForeignStateAsync(id);
                    if (device_obj && device_state) {
                        let channelName = null;
                        let deviceName = null;
                        let tmpID = id;
                        while (tmpID.lastIndexOf('.') != -1) {
                            const tmpObject = await this.getForeignObjectAsync(tmpID);
                            if (tmpObject && (tmpObject.type === 'device' || tmpObject.type === 'channel')) {
                                if (tmpObject.type === 'device') {
                                    deviceName = tmpObject.common.name;
                                }
                                if (tmpObject.type === 'channel') {
                                    channelName = tmpObject.common.name;
                                }
                            }
                            tmpID = tmpID.substring(0, tmpID.lastIndexOf('.'));
                        }
                        const re = /^[\wa-zA-Zäßüö+\s+-]+\.[\d]/;
                        const adapterNameA = re.exec(id);
                        if (!(adapterNameA && Array.isArray(adapterNameA) && adapterNameA.length > 0)) {
                            throw `now Adaptername for ${id} ???`;
                        }
                        const adapterName = adapterNameA[0];
                        deviceName = deviceName ? deviceName : '';
                        channelName = channelName ? channelName : '';
                        const readable_name = deviceName != ''
                            ? deviceName
                            : channelName != ''
                                ? channelName
                                : device_obj.common.name;
                        if (device_state.val === null || device_state.val === undefined) {
                            this.log.warn('InfluxDB can not handle null/non-existing values');
                            return;
                        } // InfluxDB can not handle null/non-existing values
                        if (typeof device_state.val === 'number' && isNaN(device_state.val)) {
                            this.log.warn('InfluxDB can not handle null/non-existing values');
                            return;
                        }
                        device_state.ts = parseInt(device_state.ts.toString(), 10);
                        // if less 2000.01.01 00:00:00
                        if (device_state.ts < 946681200000)
                            device_state.ts *= 1000;
                        if (typeof device_state.val === 'object') {
                            device_state.val = JSON.stringify(device_state.val);
                        }
                        const tags = {
                            adapterName: adapterName,
                            readableName: readable_name || '',
                            tagName: device_obj.common.name.toString(),
                            id: id,
                            function: key,
                            createdByAdapter: 'SG_InfluxDB',
                        };
                        if (deviceName != '') {
                            tags.deviceName = deviceName;
                        }
                        if (channelName != '') {
                            tags.channelName = channelName;
                        }
                        const pointToWrite = [
                            {
                                measurement: this.getMeasurementByID(id),
                                tags: tags,
                                fields: {
                                    value: device_state.val,
                                    time: device_state.ts,
                                    from: device_state.from || '',
                                    q: device_state.q || 0,
                                    ack: !!device_state.ack,
                                },
                            },
                        ];
                        await influ.writePoints(pointToWrite);
                    }
                }
            }
        }
        catch (error) {
            this.log.error('Error on SwissglidersLittleHelpers:testInfluxDBDirect');
            this.log.debug(error.name);
            this.log.debug(error.message);
            this.log.debug(error.stack);
        }
        return;
    }
    /**
     * Test include all the functions into the enums table
     */
    async updateEnumTable(obj) {
        try {
            if (obj) {
            }
            else {
            }
            const functions_enums = await this.getEnumsAsync('functions');
            // await this.sendToAsync('influxdb.0', 'query', `DROP MEASUREMENT enums`);
            const dpList = await this.sendToAsync('influxdb.0', 'getEnabledDPs', {});
            for (const [key, value] of Object.entries(functions_enums['enum.functions'])) {
                // iterate over all function entries
                for (const id of value.common.members) {
                    const device_obj = await this.getForeignObjectAsync(id);
                    if (device_obj) {
                        // start ******* create the new alias name !
                        let channelName = '';
                        let deviceName = '';
                        let tmpID = id;
                        while (tmpID.lastIndexOf('.') != -1) {
                            const tmpObject = await this.getForeignObjectAsync(tmpID);
                            if (tmpObject && (tmpObject.type === 'device' || tmpObject.type === 'channel')) {
                                if (tmpObject.type === 'device') {
                                    deviceName = tmpObject.common.name;
                                }
                                if (tmpObject.type === 'channel') {
                                    channelName = tmpObject.common.name;
                                }
                            }
                            tmpID = tmpID.substring(0, tmpID.lastIndexOf('.'));
                        }
                        const re = /^[\wa-zA-Zäßüö+\s+-]+\.[\d]/;
                        const adapterName = re.exec(id);
                        const readable_name = deviceName != '' ? deviceName : channelName != '' ? channelName : device_obj.common.name;
                        const newName = `i##name:${readable_name}##stateName:${device_obj.common.name}##channelName:${channelName}##deviceName:${deviceName}##adapterName:${adapterName}##id:${id}##type:${device_obj === null || device_obj === void 0 ? void 0 : device_obj.type}##function:${key}`;
                        // end ******* create the new alias name !
                        let dbToBeUpdated = true;
                        if (Object.keys(dpList).includes(id)) {
                            // --> datapoint exists in the db
                            const old_value = Object.entries(dpList).find(([key_]) => key_ === id);
                            if (old_value && 'aliasId' in old_value[1] && old_value[1]['aliasId'] === newName) {
                                // --> datapoint exists on the db with correct aliasID !!
                                // --> Nothing to do so far !
                                dbToBeUpdated = false;
                            }
                            else {
                                let old_name;
                                if (old_value && 'aliasId' in old_value[1]) {
                                    // --> datapoint exists on the db with wrong name aliasID
                                    old_name = old_value[1]['aliasId'];
                                }
                                else {
                                    // --> datapoint exists on the db without aliasID
                                    old_name = id;
                                }
                                // disable the measurements
                                this.sendToAsync('influxdb.0', 'disableHistory', { id: id });
                                // rename the measurements and drop the old one
                                await this.sendToAsync('influxdb.0', 'query', `select * into "${newName}" from "${old_name}" GROUP BY * ; DROP MEASUREMENT "${old_name}"`);
                            }
                        }
                        if (dbToBeUpdated) {
                            // create the measurement if not Datapoint not yet exists
                            // activate the measurement
                            await this.sendToAsync('influxdb.0', 'enableHistory', {
                                id: id,
                                options: {
                                    aliasId: newName,
                                },
                            });
                        }
                    }
                }
            }
        }
        catch (error) {
            this.log.error('Error on SwissglidersLittleHelpers:updateEnumTable');
            this.log.debug(error.name);
            this.log.debug(error.message);
            this.log.debug(error.stack);
        }
        return;
    }
    /**
     * start timer accodring to the time in ms configured in admin
     */
    async timerToStart() {
        try {
            this.timer = setTimeout(() => this.timerToStart(), 20000);
            // this.log.info('Timer started scan to Enums and Device');
            await this.testInfluxDBDirect();
            // this.log.info('Timer finished scan to Enums and Device');
        }
        catch (error) {
            this.log.error('Error on SwissglidersLittleHelpers:timerToStart');
            this.log.debug(error.name);
            this.log.debug(error.message);
            this.log.debug(error.stack);
        }
    }
    getMeasurementByID(id) {
        return id.replace(' ', '_');
    }
}
exports.SwissglidersLittleHelpers = SwissglidersLittleHelpers;
if (module.parent) {
    // Export the constructor in compact mode
    module.exports = (options) => new SwissglidersLittleHelpers(options);
}
else {
    // otherwise start the instance directly
    (() => new SwissglidersLittleHelpers())();
}
