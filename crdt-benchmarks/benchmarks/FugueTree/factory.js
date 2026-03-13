import seedrandom from "seedrandom";
import { FugueTree } from "../../../dist/dts/FugueTree/FugueTree.js";
import { AbstractCrdt, CrdtFactory, } from "../../js-lib/index.js"; // eslint-disable-line

export const name = "FugueTree";

/**
 * @implements {CrdtFactory}
 */
export class FugueFactory {
  constructor() {
    this.rng = seedrandom("42");
  }

  /**
   * @param {function(Uint8Array):void} [updateHandler]
   */
  create(updateHandler) {
    return new FugueCRDT(this.rng, updateHandler);
  }

  getName() {
    return name;
  }
}

/**
 * @implements {AbstractCrdt}
 */
export class FugueCRDT {
  /**
   * @param {seedrandom.prng} _rng
   * @param {function(Uint8Array):void} [updateHandler]
   */
  constructor(_rng, updateHandler) {
    // FugueTree takes (ws, documentID, userIdentity)
    // We pass null for ws since benchmarks are local (no network)
    this.doc = new FugueTree(null, "benchmark-doc", "benchmark-user");
    this.updateHandler = updateHandler ?? null;
  }

  /**
   * @return {Uint8Array}
   */
  getEncodedState() {
    return this.doc.save();
  }

  /**
   * @param {Uint8Array} update
   */
  applyUpdate(update) {
    this.doc.load(update);
  }

  /**
   * Insert text into the internal shared text implementation.
   *
   * @param {number} index
   * @param {string} text
   */
  insertText(index, text) {
    this.doc.insertMultiple(index, text);
    if (this.updateHandler) {
      this.updateHandler(this.doc.save());
    }
  }

  /**
   * Delete text from the internal shared text implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteText(index, len) {
    this.doc.deleteMultiple(index, len);
    if (this.updateHandler) {
      this.updateHandler(this.doc.save());
    }
  }

  /**
   * @return {string}
   */
  getText() {
    return this.doc.observe();
  }

  /**
   * Insert several items into the internal shared array implementation.
   * FugueTree is text-only, so we coerce elements to strings.
   *
   * @param {number} index
   * @param {Array<any>} elems
   */
  insertArray(index, elems) {
    this.insertText(index, elems.join(""));
  }

  /**
   * Delete several items from the internal shared array implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteArray(index, len) {
    this.deleteText(index, len);
  }

  /**
   * @return {Array<any>}
   */
  getArray() {
    return this.getText().split("");
  }

  /**
   * @param {function (AbstractCrdt): void} f
   */
  transact(f) {
    // FugueTree has no transaction API; operations are applied immediately.
    f(this);
  }

  free() {}
}