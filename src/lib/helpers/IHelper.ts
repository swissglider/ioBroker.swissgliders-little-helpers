import * as utils from '@iobroker/adapter-core';

export interface IHelperConstructor {
    new (adapter: utils.AdapterInstance): IHelper;
}

interface IHelper {
    onReady(): Promise<void>;
    onUnload(): Promise<void>;
}

export abstract class Helper implements IHelper {
    protected usedTimes: { [key: string]: number } = {};
    constructor(protected adapter: utils.AdapterInstance) {}

    abstract async onReady(): Promise<void>;
    abstract async onUnload(): Promise<void>;
    abstract async onMessage(commandName: string, obj: ioBroker.Message): Promise<boolean>;

    protected addUsedTime(name: string, from: Date, to: Date): void {
        const startTime = from.getTime();
        const endTime = to.getTime();
        const usedSeconds = endTime - startTime;

        if (name in this.usedTimes) {
            this.usedTimes[name] = this.usedTimes[name] + usedSeconds;
        } else {
            this.usedTimes[name] = usedSeconds;
        }
    }

    /**
     * get all devices / channels / states / enums if parameter is undefined
     */
    protected async getAllDevicesChannelsStatesEnums(
        types_to_search_devices: string[] = ['channel', 'device', 'state', 'enum'],
    ): Promise<{ [key: string]: ioBroker.Object }> {
        if (!(types_to_search_devices && types_to_search_devices !== null && types_to_search_devices !== undefined)) {
            types_to_search_devices = ['channel', 'device', 'state', 'enum'];
        }
        const returnStruct: { [key: string]: ioBroker.Object } = {};
        for (const typeID in types_to_search_devices) {
            const type = types_to_search_devices[typeID];
            const devicesTyped = await this.adapter.getForeignObjectsAsync('*', type);
            for (const [key, value] of Object.entries(devicesTyped)) {
                returnStruct[key] = value;
            }
        }
        return returnStruct;
    }

    /**
     * deep compare opjects
     */
    protected deepEqual(object1: { [key: string]: any }, object2: { [key: string]: any }): boolean {
        const isObject = (object: any): boolean => {
            return object !== null && object !== undefined && typeof object === 'object';
        };

        if (!(isObject(object1) && isObject(object2))) {
            return false;
        }
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (const key of keys1) {
            const val1 = object1[key];
            const val2 = object2[key];
            const areObjects = isObject(val1) && isObject(val2);
            if ((areObjects && !this.deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
                return false;
            }
        }

        return true;
    }
}
