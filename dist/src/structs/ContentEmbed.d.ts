/**
 * @private
 */
export class ContentEmbed {
    /**
     * @param {Object} embed
     */
    constructor(embed: Object);
    embed: Object;
    /**
     * @return {number}
     */
    getLength(): number;
    /**
     * @return {Array<any>}
     */
    getContent(): Array<any>;
    /**
     * @return {boolean}
     */
    isCountable(): boolean;
    /**
     * @return {ContentEmbed}
     */
    copy(): ContentEmbed;
    /**
     * @param {number} offset
     * @return {ContentEmbed}
     */
    splice(offset: number): ContentEmbed;
    /**
     * @param {ContentEmbed} right
     * @return {boolean}
     */
    mergeWith(right: ContentEmbed): boolean;
    /**
     * @param {Transaction} transaction
     * @param {Item} item
     */
    integrate(transaction: Transaction, item: Item): void;
    /**
     * @param {Transaction} transaction
     */
    delete(transaction: Transaction): void;
    /**
     * @param {StructStore} store
     */
    gc(store: StructStore): void;
    /**
     * @param {AbstractUpdateEncoder} encoder
     * @param {number} offset
     */
    write(encoder: AbstractUpdateEncoder, offset: number): void;
    /**
     * @return {number}
     */
    getRef(): number;
}
export function readContentEmbed(decoder: AbstractUpdateDecoder): ContentEmbed;
import { Transaction } from "../utils/Transaction.js";
import { Item } from "./Item.js";
import { StructStore } from "../utils/StructStore.js";
import { AbstractUpdateEncoder } from "../utils/UpdateEncoder.js";
import { AbstractUpdateDecoder } from "../utils/UpdateDecoder.js";
