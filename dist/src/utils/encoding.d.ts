export let DefaultDSEncoder: typeof DSEncoderV1;
export let DefaultDSDecoder: typeof DSDecoderV1;
export let DefaultUpdateEncoder: typeof UpdateEncoderV1;
export let DefaultUpdateDecoder: typeof UpdateDecoderV1;
export function useV1Encoding(): void;
export function useV2Encoding(): void;
export function writeClientsStructs(encoder: AbstractUpdateEncoder, store: StructStore, _sm: Map<number, number>): void;
export function readClientsStructRefs(decoder: AbstractUpdateDecoder, clientRefs: Map<number, Array<GC | Item>>, doc: Doc): Map<number, Array<GC | Item>>;
export function tryResumePendingDeleteReaders(transaction: Transaction, store: StructStore): void;
export function writeStructsFromTransaction(encoder: AbstractUpdateEncoder, transaction: Transaction): void;
export function readStructs(decoder: AbstractUpdateDecoder, transaction: Transaction, store: StructStore): void;
export function readUpdateV2(decoder: decoding.Decoder, ydoc: Doc, transactionOrigin?: any, structDecoder?: AbstractUpdateDecoder | undefined): void;
export function readUpdate(decoder: decoding.Decoder, ydoc: Doc, transactionOrigin?: any): void;
export function applyUpdateV2(ydoc: Doc, update: Uint8Array, transactionOrigin?: any, YDecoder?: typeof UpdateDecoderV1 | typeof UpdateDecoderV2 | undefined): void;
export function applyUpdate(ydoc: Doc, update: Uint8Array, transactionOrigin?: any): void;
export function writeStateAsUpdate(encoder: AbstractUpdateEncoder, doc: Doc, targetStateVector?: Map<number, number> | undefined): void;
export function encodeStateAsUpdateV2(doc: Doc, encodedTargetStateVector?: Uint8Array | undefined, encoder?: AbstractUpdateEncoder | undefined): Uint8Array;
export function encodeStateAsUpdate(doc: Doc, encodedTargetStateVector?: Uint8Array | undefined): Uint8Array;
export function readStateVector(decoder: AbstractDSDecoder): Map<number, number>;
export function decodeStateVectorV2(decodedState: Uint8Array): Map<number, number>;
export function decodeStateVector(decodedState: Uint8Array): Map<number, number>;
export function writeStateVector(encoder: AbstractDSEncoder, sv: Map<number, number>): AbstractDSEncoder;
export function writeDocumentStateVector(encoder: AbstractDSEncoder, doc: Doc): AbstractDSEncoder;
export function encodeStateVectorV2(doc: Doc, encoder?: AbstractDSEncoder | undefined): Uint8Array;
export function encodeStateVector(doc: Doc): Uint8Array;
import { DSEncoderV1 } from "./UpdateEncoder.js";
import { DSDecoderV1 } from "./UpdateDecoder.js";
import { UpdateEncoderV1 } from "./UpdateEncoder.js";
import { UpdateDecoderV1 } from "./UpdateDecoder.js";
import { AbstractUpdateEncoder } from "./UpdateEncoder.js";
import { StructStore } from "./StructStore.js";
import { AbstractUpdateDecoder } from "./UpdateDecoder.js";
import { GC } from "../structs/GC.js";
import { Item } from "../structs/Item.js";
import { Doc } from "./Doc.js";
import { Transaction } from "./Transaction.js";
import * as decoding from "lib0/decoding";
import { UpdateDecoderV2 } from "./UpdateDecoder.js";
import { AbstractDSDecoder } from "./UpdateDecoder.js";
import { AbstractDSEncoder } from "./UpdateEncoder.js";
