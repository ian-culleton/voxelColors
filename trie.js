
class ColorTrie {
  _storage = {}

  addColor(color) {
    let [r, g, b] = color
    if(this._storage[r] === undefined) this._storage[r] = {}

    if(this._storage[r][g] === undefined) this._storage[r][g] = {}

    if(this._storage[r][g][b] === undefined) this._storage[r][g][b] = true
  }

  contains(color) {
    let [r, g, b] = color
    if(!this._storage[r]) return false;
    if(!this._storage[r][g]) return false;
    if(!this._storage[r][g][b]) return false;
    return true;
  }
}

window.ColorTrie = ColorTrie