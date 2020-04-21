export default class Dropdown {
  constructor({options, voxView}) {
    this.options = options
    this.voxView = voxView
  }

  makeMenuItem(optLabel) {
    const menuItem = document.createElement('option');
    menuItem.innerText = optLabel;
    return menuItem;
  }

  handleMenuItemSelect(e) {
    const selected = e.target.value
    fetch(`images/${selected}/${selected}.data.json`)
    .then(data => data.json())
    .then(rgbValues => {
      this.voxView.set_colors(rgbValues);
      this.voxView.render()
    })
  }

  render() {
    const container = document.createElement('select');

    container.setAttribute('class', 'image-selector')

    const defaultMenuItem = document.createElement('option');
    defaultMenuItem.innerText = '-----';
    container.appendChild(defaultMenuItem);

    this.options.map(this.makeMenuItem)
    .forEach(domNode => {
      container.appendChild(domNode);
    })

    container.addEventListener('change', this.handleMenuItemSelect.bind(this))

    return container;
  }
}