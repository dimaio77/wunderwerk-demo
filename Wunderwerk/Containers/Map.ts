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

    export class HashMap<T> implements Map<T> {

        private m_values: { [index: string]: T; };

        private m_count: number;

        private m_counted: boolean;
        private m_updated: boolean;

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

        copy(): HashMap<T> {
            return new HashMap<T>(this.m_values);
        }

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

        get empty(): boolean {
            return this.count === 0;
        }

        get updated(): boolean {
            let updated = this.m_updated;

            this.m_updated = false;

            return updated;
        }

        get keys(): ArrayList<string> {
            let keys = new ArrayList<string>();

            for (let key in this.m_values) {
                keys.add(key);
            }

            return keys;
        }

        get values(): ArrayList<T> {
            let values = new ArrayList<T>();

            for (let key in this.m_values) {
                values.add(this.m_values[key]);
            }

            return values;
        }

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

        at(key: string): null | T {
            if (this.m_values.hasOwnProperty(key)) {
                return this.m_values[key];
            }

            return null;
        }

        has(value: T): boolean {
            return this.key(value) !== null;
        }

        key(value: T): null | string {
            for (let key in this.m_values) {
                if (this.m_values[key] == value) {
                    return key;
                }
            }

            return null;
        }

        add(key: string, value: T): boolean {
            if (this.at(key)) {
                return false;
            }

            this.m_values[key] = value;

            this.m_updated = true;
            this.m_counted = false;

            return true;
        }

        replace(key: string, value: T): null | T {
            let replacedValue = this.at(key);

            this.m_values[key] = value;

            this.m_updated = true;
            this.m_counted = false;

            return replacedValue;
        }

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

        each(callback: (key: string, value: T) => void) {
            for (let key in this.m_values) {
                callback(key, this.m_values[key]);
            }
        }

    }

}