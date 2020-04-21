
export default class ColorTrie {
  _storage = {}
  _total_added = 0

  addColor(color) {
    let [r, g, b] = color
    if(this._storage[r] === undefined) this._storage[r] = {}

    if(this._storage[r][g] === undefined) this._storage[r][g] = {}

    if(this._storage[r][g][b] === undefined) {
      this._storage[r][g][b] = 1
      this._total_added++
    }

    if(this._storage[r][g][b] > 0) this._storage[r][g][b]++
  }

  contains(color) {
    let [r, g, b] = color
    if(!this._storage[r]) return false;
    if(!this._storage[r][g]) return false;
    if(!this._storage[r][g][b]) return false;
    return true;
  }

  density(color) {
    let [r, g, b] = color
    if(!this._storage[r]) return false;
    if(!this._storage[r][g]) return false;
    if(!this._storage[r][g][b]) return false;
    return this._storage[r][g][b] / this._total_added;
  }

  count(color) {
    let [r, g, b] = color
    if(!this._storage[r]) return false;
    if(!this._storage[r][g]) return false;
    if(!this._storage[r][g][b]) return false;
    return this._storage[r][g][b];
  }
}
