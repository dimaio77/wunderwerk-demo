///<reference path='List.ts' />

module Wunderwerk {

    export interface Map<T> {

        count: number;
        empty: boolean;

        updated: boolean;

        keys: ArrayList<string>;
        values: ArrayList<T>;

        clear(): boolean;

        at(key: string): null | T;
        key(value: T): null | string;

        add(key: string, value: T): boolean;
        replace(key: string, value: T): null | T;

        remove(value: T): boolean;
        removeAt(key: string): null | T;

        rename(value: T, newName: string): null | string;

        each(callback: (key: string, value: T) => void): void;
    }

    /**
    * A hash map implementation of the Map interface.
    */

    export class HashMap<T> implements Map<T> {

        private m_values: { [index: string]: T; };

        private m_count: number;

        private m_counted: boolean;
        private m_updated: boolean;

        /**
         * Constructor.
         * @param {null | { [index: string]: T; }} values: Initial values or null.
         */

        constructor(values: null | { [index: string]: T; } = null) {
            this.m_values = {};

            if (values !== null) {
                for (let key in values) {
                    this.m_values[key] = values[key];
                }
            }

            this.m_updated = true;
            this.m_counted = false;
        }

        /**
         * Creates a copy of the hash map.
         * @return {HashMap<T>} A copy of the hash map.
         */

        copy(): HashMap<T> {
            return new HashMap<T>(this.m_values);
        }

        /**
         * Returns the number of entries in the hash map.
         * @return {number} The number of entries in the hash map.
         */

        get count(): number {
            if (!this.m_counted) {
                this.m_count = 0;

                for (let key in this.m_values) {
                    this.m_count++;
                }

                this.m_counted = true;
            }

            return this.m_count;
        }

        /**
         * Checks whether the hash map is empty.
         * @return {boolean} True if the number of entries in the hash map is zero, false otherwise.
         */

        get empty(): boolean {
            return this.count === 0;
        }

        /**
         * Checks whether any entries have been added, replaced, removed or renamed since the last check.
         * @return {boolean} True if the hash map has been updated since the last check, false otherwise.
         */

        get updated(): boolean {
            let updated = this.m_updated;

            this.m_updated = false;

            return updated;
        }

        /**
         * Collects and returns the keys of all entries in the hash map.
         * @return {ArrayList<string>} An hash map containing the keys of all entries in the hash map.
         */

        get keys(): ArrayList<string> {
            let keys = new ArrayList<string>();

            for (let key in this.m_values) {
                keys.add(key);
            }

            return keys;
        }

        /**
         * Collects and returns all entries in the hash map.
         * @return {ArrayList<string>} An hash map containing all entries in the hash map.
         */

        get values(): ArrayList<T> {
            let values = new ArrayList<T>();

            for (let key in this.m_values) {
                values.add(this.m_values[key]);
            }

            return values;
        }

        /**
         * Removes all entries from the hash map.
         * @return {boolean} True if any entries have been removed, false otherwise.
         */

        clear(): boolean {
            let removedAny = false;

            for (let key in this.m_values) {
                delete this.m_values[key];

                removedAny = true;
            }

            if (removedAny) {
                this.m_updated = true;
                this.m_counted = false;
            }

            return removedAny;
        }

        /**
         * Returns a reference to the entry with the given key (or null if there is no entry with this key).
         * @param {string} key: The requested key.
         * @return {null | T} The entry with the given key or null.
         */

        at(key: string): null | T {
            if (this.m_values.hasOwnProperty(key)) {
                return this.m_values[key];
            }

            return null;
        }

        /**
         * Checks whether the given value is an entry of the hash map.
         * @param {T} value: The requested value.
         * @return {boolean} True if the value is an entry of the map, false otherwise.
         */

        has(value: T): boolean {
            return this.key(value) !== null;
        }

        /**
         * Returns the key of the given value (or null if the value is not an entry of the map).
         * @param {T} value: The requested value.
         * @return {null | string} The key of the given value or null.
         */

        key(value: T): null | string {
            for (let key in this.m_values) {
                if (this.m_values[key] == value) {
                    return key;
                }
            }

            return null;
        }

        /**
         * Adds a new key/value pair to the map array (unless the map already contains a value with the given key).
         * @param {string} key: The key to be added.
         * @param {T} value: The value to be added.
         * @return {boolean} True if the pair was successfully added, false otherwise.
         */

        add(key: string, value: T): boolean {
            if (this.at(key)) {
                return false;
            }

            this.m_values[key] = value;

            this.m_updated = true;
            this.m_counted = false;

            return true;
        }

        /**
         * Replaces the entry with the given key with the given value and returns the replaced value.
         * @param {string} key: The key of the entry that is to be replaced.
         * @param {T} value: The new value replacing the old entry.
         * @return {null | number} The replaced value or null.
         */

        replace(key: string, value: T): null | T {
            let replacedValue = this.at(key);

            this.m_values[key] = value;

            this.m_updated = true;
            this.m_counted = false;

            return replacedValue;
        }

        /**
         * Removes the entry with the given value from the hash map.
         * @param {T} value: The value to be removed from the map.
         * @return {null | number} True if the value has been found and removed, false otherwise.
         */

        remove(value: T): boolean {
            for (let key in this.m_values) {
                if (this.m_values[key] == value) {
                    delete this.m_values[key];

                    this.m_updated = true;
                    this.m_counted = false;

                    return true;
                }
            }

            return false;
        }

        /**
         * Removes the entry with the given key from the hash map and returns the removed value.
         * @param {string} key: The key to be removed from the map.
         * @return {null | number} The removed value or null.
         */

        removeAt(key: string): null | T {
            if (this.m_values.hasOwnProperty(key)) {
                let removedValue = this.m_values[key];

                delete this.m_values[key];

                this.m_updated = true;
                this.m_counted = false;

                return removedValue;
            }

            return null;
        }

        /**
         * Finds and renames the entry with the given value and returns the old key
         * (or null if no entry with the given value was found in the map).
         * @param {T} value: The value to be renamed.
         * @param {string} newKey: The value's new key.
         * @return {null | string} The value's old key or null.
         */

        rename(value: T, newKey: string): null | string {
            for (let key in this.m_values) {
                if (this.m_values[key] == value) {
                    delete this.m_values[key];

                    this.m_values[newKey] = value;

                    this.m_updated = true;
                    this.m_counted = false;

                    return key;
                }
            }

            return null;
        }

        /**
         * Iterates over the entries in the hash map and executes the given callback function on each of them.
         * @param {(key: string, value: T) => void} callback: The callback function to be executed on each entry of the map.
         */

        each(callback: (key: string, value: T) => void) {
            for (let key in this.m_values) {
                callback(key, this.m_values[key]);
            }
        }

    }

}