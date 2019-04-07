/**
 * @module structs
 */

import {
  AbstractItem,
  AbstractItemRef,
  getItemCleanEnd,
  getItemCleanStart,
  getItemType,
  splitItem,
  changeItemRefOffset,
  GC,
  ItemDeleted,
  StructStore, Transaction, ID, AbstractType // eslint-disable-line
} from '../internals.js'

import * as encoding from 'lib0/encoding.js'
import * as decoding from 'lib0/decoding.js'

export const structJSONRefNumber = 5

export class ItemJSON extends AbstractItem {
  /**
   * @param {ID} id
   * @param {AbstractItem | null} left
   * @param {ID | null} origin
   * @param {AbstractItem | null} right
   * @param {ID | null} rightOrigin
   * @param {AbstractType<any>} parent
   * @param {string | null} parentSub
   * @param {Array<any>} content
   */
  constructor (id, left, origin, right, rightOrigin, parent, parentSub, content) {
    super(id, left, origin, right, rightOrigin, parent, parentSub)
    /**
     * @type {Array<any>}
     */
    this.content = content
  }
  /**
   * @param {ID} id
   * @param {AbstractItem | null} left
   * @param {ID | null} origin
   * @param {AbstractItem | null} right
   * @param {ID | null} rightOrigin
   * @param {AbstractType<any>} parent
   * @param {string | null} parentSub
   */
  copy (id, left, origin, right, rightOrigin, parent, parentSub) {
    return new ItemJSON(id, left, origin, right, rightOrigin, parent, parentSub, this.content)
  }
  get length () {
    return this.content.length
  }
  getContent () {
    return this.content
  }
  /**
   * @param {StructStore} store
   * @param {number} diff
   */
  splitAt (store, diff) {
    /**
     * @type {ItemJSON}
     */
    // @ts-ignore
    const right = splitItem(store, this, diff)
    right.content = this.content.splice(diff)
    return right
  }
  /**
   * @param {ItemJSON} right
   * @return {boolean}
   */
  mergeWith (right) {
    if (super.mergeWith(right)) {
      this.content = this.content.concat(right.content)
      return true
    }
    return false
  }
  /**
   * @param {encoding.Encoder} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    super.write(encoder, offset, structJSONRefNumber)
    const len = this.content.length
    encoding.writeVarUint(encoder, len - offset)
    for (let i = offset; i < len; i++) {
      const c = this.content[i]
      encoding.writeVarString(encoder, c === undefined ? 'undefined' : JSON.stringify(c))
    }
  }
}

export class ItemJSONRef extends AbstractItemRef {
  /**
   * @param {decoding.Decoder} decoder
   * @param {ID} id
   * @param {number} info
   */
  constructor (decoder, id, info) {
    super(decoder, id, info)
    const len = decoding.readVarUint(decoder)
    const cs = []
    for (let i = 0; i < len; i++) {
      const c = decoding.readVarString(decoder)
      if (c === 'undefined') {
        cs.push(undefined)
      } else {
        cs.push(JSON.parse(c))
      }
    }
    /**
     * @type {Array<any>}
     */
    this.content = cs
  }
  get length () {
    return this.content.length
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   * @return {ItemJSON|GC}
   */
  toStruct (transaction, offset) {
    const y = transaction.y
    const store = y.store
    if (offset > 0) {
      changeItemRefOffset(this, offset)
      this.content = this.content.slice(offset)
    }
    let parent
    if (this.parent !== null) {
      const parentItem = getItemType(store, this.parent)
      switch (parentItem.constructor) {
        case ItemDeleted:
        case GC:
          return new GC(this.id, this.content.length)
      }
      parent = parentItem.type
    } else {
      // @ts-ignore
      parent = y.get(this.parentYKey)
    }
    return new ItemJSON(
      this.id,
      this.left === null ? null : getItemCleanEnd(store, this.left),
      this.left,
      this.right === null ? null : getItemCleanStart(store, this.right),
      this.right,
      parent,
      this.parentSub,
      this.content
    )
  }
}