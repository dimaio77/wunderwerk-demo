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

    /**
    * A dynamic array implementation of the List interface.
    */

    export class ArrayList<T> implements List<T> {

        private m_values: T[];

        private m_updated: boolean;

        /**
         * Constructor.
         * @param {null | T[]} values: Initial values or null.
         */

        constructor(values: null | T[] = null) {
            if (values) {
                this.m_values = values.slice();
            } else {
                this.m_values = [];
            }

            this.m_updated = true;
        }

        /**
         * Creates a copy of the array list.
         * @return {ArrayList<T>} A copy of the array list.
         */

        copy(): ArrayList<T> {
            return new ArrayList<T>(this.m_values);
        }

        /**
         * Returns the number of elements in the array list.
         * @return {number} The number of elements of the array list.
         */

        get count(): number {
            return this.m_values.length;
        }

        /**
         * Checks whether the array list is empty.
         * @return {boolean} True if the number of elements in the array list is zero, false otherwise.
         */

        get empty(): boolean {
            return (this.m_values.length === 0);
        }

        /**
         * Checks whether any elements have been added, replaced, removed or swapped since the last check.
         * @return {boolean} True if the array list has been updated since the last check, false otherwise.
         */

        get updated(): boolean {
            let updated = this.m_updated;

            this.m_updated = false;

            return updated;
        }

        /**
         * Returns a reference to the first element in the array list (or null if the list is empty).
         * @return {null | T} The first element (or null).
         */

        get first(): null | T {
            if (this.m_values.length === 0) {
                return null;
            }

            return this.m_values[0];
        }

        /**
         * Returns a reference to the last element in the array list (or null if the list is empty).
         * @return {null | T} The last element (or null).
         */

        get last(): null | T {
            if (this.m_values.length === 0) {
                return null;
            }

            return this.m_values[this.m_values.length - 1];
        }

        /**
         * Removes all elements from the array list.
         * @return {boolean} True if any elements have been removed, false otherwise.
         */

        clear(): boolean {
            if (this.m_values.length === 0) {
                return false;
            }

            this.m_values.length = 0;

            this.m_updated = true;

            return true;
        }

        /**
         * Returns a reference to the element at the given index (or null if the index is out of range).
         * @param {number} index: The requested index. Must be zero or positive.
         * @return {null | T} The element at the given index or null.
         */

        at(index: number): null | T {
            if (index >= this.m_values.length) {
                return null;
            }

            return this.m_values[index];
        }

        /**
         * Checks whether the given value is an element of the array list.
         * @param {T} value: The requested value.
         * @return {boolean} True if the value is an element of the list, false otherwise.
         */

        has(value: T): boolean {
            return this.index(value) !== null;
        }

        /**
         * Returns the array index of the given value (or null if the value is not an element of the list).
         * @param {T} value: The requested value.
         * @return {null | number} The array index of the given value or null.
         */

        index(value: T): null | number {
            for (let i = 0, len = this.m_values.length; i < len; i++) {
                if (this.m_values[i] == value) {
                    return i;
                }
            }

            return null;
        }

        /**
         * Adds a value to the list array and returns the array index of the new element
         * (or null if the array already has an element with the same value and duplicate entries are not allowed).
         * @param {T} value: The value to be added.
         * @param {boolean} allowDuplicates: Whether of not to allow duplicate entries.
         * @return {null | number} The array index of the new element or null.
         */

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

        /**
         * Replaces the element at the given index with the given value and returns the replaced value.
         * @param {number} index: The index of the element that is to be replaced.
         * @param {T} value: The new value replacing the old element.
         * @return {null | number} The replaced value or null.
         */

        replace(index: number, value: T): null | T {
            let replacedValue = this.m_values[index];

            this.m_values[index] = value;

            this.m_updated = true;

            return replacedValue;
        }

        /**
         * Removes the element with the given value from the array list.
         * @param {T} value: The value to be removed from the list.
         * @return {null | number} True if the value has been found and removed, false otherwise.
         */

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

        /**
         * Removes the element at the given index from the array list and returns the removed value.
         * @param {number} index: The array index to be removed from the list.
         * @return {null | number} The removed value or null.
         */

        removeAt(index: number): null | T {
            if (index >= this.m_values.length) {
                return null;
            }

            let removedValue = this.m_values[index];

            this.m_values.splice(index, 1);

            this.m_updated = true;

            return removedValue;
        }

        /**
         * Swaps the array elements with the two given values.
         * @param {T} first: The first value.
         * @param {T} second: The second value.
         * @return {boolean} True if the elements have been successfully swapped, false otherwise.
         */

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

        /**
         * Swaps the array elements at the two given indices.
         * @param {number} firstIndex: The first array index. Must be zero or positive.
         * @param {number} secondIndex: The second array index. Must be zero or positive.
         * @return {boolean} True if the elements have been successfully swapped, false otherwise.
         */

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

        /**
         * Iterates over the elements in the array list and executes the given callback function on each of them.
         * @param {(index: number, value: T) => void} callback: The callback function to be executed on each element of the list.
         */

        each(callback: (index: number, value: T) => void) {
            for (let i = 0, len = this.m_values.length; i < len; i++) {
                callback(i, this.m_values[i]);
            }
        }

    }

}