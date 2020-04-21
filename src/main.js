import VoxelView from './voxel-view'
import UrlReader from './url-reader'


const queryMap = UrlReader.read()

console.log(queryMap)

const voxView = new VoxelView({
  num_colors: queryMap.num_colors || 256,
  mount_point: document.body
})

fetch(`assets/${queryMap.p}/${queryMap.p}.data.json`)
.then(data => data.json())
.then(rgbValues => {
  voxView.set_colors(rgbValues);
  voxView.render()
})

// voxView.set_colors(rgbVals);

// voxView.render()