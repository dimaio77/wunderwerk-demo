module Wunderwerk {

    export interface List<T> {

        count: number;
        empty: boolean;

        updated: boolean;

        first: null | T;
        last: null | T;

        clear(): boolean;

        at(index: number): null | T;
        index(value: T): null | number;

        add(value: T, allowDuplicates: boolean): null | number;
        replace(index: number, value: T): null | T;

        remove(value: T): boolean;
        removeAt(index: number): null | T;

        swap(first: T, second: T): boolean;
        swapAt(firstIndex: number, secondIndex: number): boolean;

        each(callback: (index: number, value: T) => void): void;

    }

    export class ArrayList<T> implements List<T> {

        private m_values: T[];

        private m_updated: boolean;

        constructor(values: null | T[] = null) {
            if (values) {
                this.m_values = values.slice();
            } else {
                this.m_values = [];
            }

            this.m_updated = true;
        }

        copy(): ArrayList<T> {
            return new ArrayList<T>(this.m_values);
        }

        get count(): number {
            return this.m_values.length;
        }

        get empty(): boolean {
            return (this.m_values.length === 0);
        }

        get updated(): boolean {
            let updated = this.m_updated;

            this.m_updated = false;

            return updated;
        }

        get first(): null | T {
            if (this.m_values.length === 0) {
                return null;
            }

            return this.m_values[0];
        }

        get last(): null | T {
            if (this.m_values.length === 0) {
                return null;
            }

            return this.m_values[this.m_values.length - 1];
        }

        clear(): boolean {
            if (this.m_values.length === 0) {
                return false;
            }

            this.m_values.length = 0;

            this.m_updated = true;

            return true;
        }

        at(index: number): null | T {
            if (index >= this.m_values.length) {
                return null;
            }

            return this.m_values[index];
        }

        has(value: T): boolean {
            return this.index(value) !== null;
        }

        index(value: T): null | number {
            for (let i = 0, len = this.m_values.length; i < len; i++) {
                if (this.m_values[i] == value) {
                    return i;
                }
            }

            return null;
        }

        add(value: T, allowDuplicates = true): null | number {
            if (!allowDuplicates) {
                if (this.index(value) !== null) {
                    return null;
                }
            }

            this.m_values.push(value);

            this.m_updated = true;

            return this.m_values.length - 1;
        }

        replace(index: number, value: T): null | T {
            let replacedValue = this.m_values[index];

            this.m_values[index] = value;

            this.m_updated = true;

            return replacedValue;
        }

        remove(value: T): boolean {
            for (let i = this.m_values.length - 1; i >= 0; i--) {
                if (this.m_values[i] == value) {
                    this.m_values.splice(i, 1);

                    this.m_updated = true;

                    return true;
                }
            }

            return false;
        }

        removeAt(index: number): null | T {
            if (index >= this.m_values.length) {
                return null;
            }

            let removedValue = this.m_values[index];

            this.m_values.splice(index, 1);

            this.m_updated = true;

            return removedValue;
        }

        swap(first: T, second: T): boolean {
            let firstIndex = this.index(first),
                secondIndex = this.index(second);

            if (firstIndex === null) {
                return false;
            }

            if (secondIndex === null) {
                return false;
            }

            let swapped = this.swapAt(firstIndex, secondIndex);

            if (swapped) {
                this.m_updated = true;
            }

            return swapped;
        }

        swapAt(firstIndex: number, secondIndex: number): boolean {
            if (firstIndex >= this.m_values.length) {
                return false;
            }

            if (secondIndex >= this.m_values.length) {
                return false;
            }

            let secondValue = this.m_values[secondIndex];

            this.m_values[secondIndex] = this.m_values[firstIndex];
            this.m_values[firstIndex] = secondValue;

            this.m_updated = true;

            return true;
        }

        each(callback: (index: number, value: T) => void): void {
            for (let i = 0, len = this.m_values.length; i < len; i++) {
                callback(i, this.m_values[i]);
            }
        }

    }

}