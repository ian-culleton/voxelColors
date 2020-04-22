import VoxelView from './voxel-view'
import UrlReader from './url-reader'

const { p, num_colors, outline, opacity } = UrlReader.read()

const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))
const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
const isSupported = isSafari || isChrome

if(isSupported) {
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
} else {
  document.body.innerHTML = '<div class="error-message-container"><div class="error-message">This plugin is not supported on your browser.  Please use Google Chrome or Safari.</div></div>'
}
