import VoxelView from './voxel-view'
import UrlReader from './url-reader'
import Dropdown from './dropdown'

const { p, num_colors, outline, opacity } = UrlReader.read()

const voxView = new VoxelView({
  num_colors: num_colors || 256,
  mount_point: document.getElementById("MountPoint"),
  outline: outline === "true",
  opacity: opacity === "true"
})

fetch(`images/${p}/${p}.data.json`)
.then(data => data.json())
.then(rgbValues => {
  voxView.set_colors(rgbValues);
  voxView.render()
})

// fetch('/images')
// .then(data => data.json())
// .then(images => {
//   let dd = new Dropdown({options: images, voxView});
//   document.body.appendChild(dd.render());
// })