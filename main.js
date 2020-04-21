const voxView = new VoxelView({
  num_colors: 256,
  // mount_point: document.body
})

voxView.set_colors(window.rgbVals);

voxView.render()