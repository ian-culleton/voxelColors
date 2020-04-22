(function () {
  'use strict';

  class ColorTrie {
    constructor() {
      this._storage = {};
      this._total_added = 0;
    }

    addColor(color) {
      let [r, g, b] = color;
      if(this._storage[r] === undefined) this._storage[r] = {};

      if(this._storage[r][g] === undefined) this._storage[r][g] = {};

      if(this._storage[r][g][b] === undefined) {
        this._storage[r][g][b] = 1;
        this._total_added++;
      }

      if(this._storage[r][g][b] > 0) this._storage[r][g][b]++;
    }

    contains(color) {
      let [r, g, b] = color;
      if(!this._storage[r]) return false;
      if(!this._storage[r][g]) return false;
      if(!this._storage[r][g][b]) return false;
      return true;
    }

    density(color) {
      let [r, g, b] = color;
      if(!this._storage[r]) return false;
      if(!this._storage[r][g]) return false;
      if(!this._storage[r][g][b]) return false;
      return this._storage[r][g][b] / this._total_added;
    }

    count(color) {
      let [r, g, b] = color;
      if(!this._storage[r]) return false;
      if(!this._storage[r][g]) return false;
      if(!this._storage[r][g][b]) return false;
      return this._storage[r][g][b];
    }
  }

  class VoxelView {
    constructor({
      num_colors=16,
      mount_point=document.body,
      outline=false,
      label=false,
      opacity=false
    }) {
      this.num_colors = 0;
      this.edge_dim = 0;
      this.ratio = 0;
      this.dims = [0, 0, 0];
    
      this.group_scale = 3;
    
      this.velocity = {
        x: 0, y: 0, z: 0
      };
    
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer();
      this.group = new THREE.Group();
      this.trie = new ColorTrie();
    
      this.colors_to_render = [];

      this.mount_point = mount_point;
      this.useOutline = outline;
      this.useLabel = label;
      this.useOpacity = opacity;
      this.num_colors = num_colors;
      this.edge_dim = Math.round(Math.cbrt(num_colors));
      this.ratio = this.edge_dim / 256;
      this.dims = [
        this.edge_dim,
        this.edge_dim,
        this.edge_dim
      ];

      this.renderer.setSize(
        this.mount_point.getBoundingClientRect().width, 
        this.mount_point.getBoundingClientRect().height
      );

      if(this.useLabel) {
        mount_point.appendChild(this.make_label());
      }

      mount_point.appendChild(this.renderer.domElement);
    }
    
    set_colors(color_list) {
      this.scene.remove(this.group.id);

      this.colors_to_render = color_list;
    }

    make_label() {
      const container = document.createElement('div');

      container.innerText = "QAED to pan, WS to zoom, drag to rotate.";

      container.style.textAlign = "center";
      container.style.backgroundColor = "gainsboro";
      container.style.width = window.innerWidth;

      return container;
    }

    make_entry_group() {
      const normalized_colors = this.colors_to_render.map(color => {
        const scaled_color = [
          Math.round(color[0] * this.ratio), 
          Math.round(color[1] * this.ratio), 
          Math.round(color[2] * this.ratio)
        ];
        return scaled_color;
      });

      const unique_normalized_colors = normalized_colors
      .filter((color) => {
        const found = this.trie.contains(color);
        this.trie.addColor(color);
        return !found
      }); 

      const trieMaxDensity = Math.max.apply(null, unique_normalized_colors.map(col => this.trie.density(col)));

      return unique_normalized_colors
      .map((color, idx, allColors) => {
        
    
        const x = Number(color[0]), 
          y = Number(color[1]), 
          z = Number(color[2]),
          universe_size = this.group_scale,
          unit_size = (1 / this.edge_dim) * universe_size,
          half_universe_size = universe_size / 2;

        var geometry = new THREE.BoxGeometry(
          unit_size,
          unit_size, 
          unit_size,
          1, 1, 1);
        var material = new THREE.MeshBasicMaterial({ 
          color: new THREE.Color(
            (x / this.edge_dim), 
            (y / this.edge_dim), 
            (z / this.edge_dim),
          ),
          transparent: true,
          opacity: this.useOpacity ? this.trie.density(color) / trieMaxDensity : 1,
          vertexColors: true
        });
        var cube = new THREE.Mesh( geometry, material );
        cube.translateX(unit_size + ((x * unit_size) - half_universe_size - unit_size / 2));
        cube.translateY(unit_size + ((y * unit_size) - half_universe_size - unit_size / 2));
        cube.translateZ(unit_size + ((z * unit_size) - half_universe_size - unit_size / 2));
        return cube;
      })
    }

    animate() {
      requestAnimationFrame( this.animate.bind(this) );
      this.group.rotation.x += this.velocity.x;
      this.group.rotation.y += this.velocity.y;
      this.group.rotation.z += this.velocity.z;
      this.renderer.render( this.scene, this.camera );
    }

    draw_outline() {
      const universe_size = this.group_scale,
      unit_size = (1 / this.edge_dim) * universe_size,
      half_universe_size = universe_size / 2;

      var geometry = new THREE.PlaneGeometry( this.group_scale + 0.5, this.group_scale + 0.5);
      var material = new THREE.MeshBasicMaterial( {
        color: 0xffffff, 
        side: THREE.DoubleSide,
        wireframe: true,
        transparent: true,
        opacity: 0.15
      } );

      var side1 = new THREE.Mesh( geometry, material );
      side1.translateZ(half_universe_size + 0.5);
      side1.translateX(unit_size / 2);
      side1.translateY(unit_size / 2);
      this.group.add( side1 );

      var side2 = new THREE.Mesh( geometry, material );
      side2.rotateX(Math.PI / 2);
      side2.translateZ(half_universe_size);
      side2.translateX(unit_size / 2);
      side2.translateY(unit_size / 2);
      this.group.add( side2 );

      var side3 = new THREE.Mesh( geometry, material );
      side3.rotateY(Math.PI / 2);
      side3.translateZ(half_universe_size + 0.5);
      side3.translateX(unit_size / -2);
      side3.translateY(unit_size / 2);
      this.group.add( side3 );

      var side4 = new THREE.Mesh( geometry, material );
      side4.translateZ(-half_universe_size);
      side4.translateX(unit_size / 2);
      side4.translateY(unit_size / 2);
      this.group.add( side4 );

      var side5 = new THREE.Mesh( geometry, material );
      side5.rotateX(Math.PI / 2);
      side5.translateZ(-half_universe_size - 0.5);
      side5.translateX(unit_size / 2);
      side5.translateY(unit_size / 2);
      this.group.add( side5 );

      var side6 = new THREE.Mesh( geometry, material );
      side6.rotateY(Math.PI / 2);
      side6.translateZ(-half_universe_size);
      side6.translateX(unit_size / -2);
      side6.translateY(unit_size / 2);
      this.group.add( side6 );
    }

    handle_key_press(e) {
      const zoom_speed = 0.1;
      if (e.key === 'w') this.camera.position.z -= zoom_speed;
      if (e.key === 's') this.camera.position.z += zoom_speed;
      if (e.key === 'a') this.camera.position.x -= zoom_speed;
      if (e.key === 'd') this.camera.position.x += zoom_speed;
      if (e.key === 'q') this.camera.position.y -= zoom_speed;
      if (e.key === 'e') this.camera.position.y += zoom_speed;
    }

    handle_mouse_move(e) {
      const scale = 0.001;
      if(e.which === 1) {
        this.velocity.x = e.movementY * scale;
        this.velocity.y = e.movementX * scale;
      }
    }

    render() {
      this.make_entry_group().forEach(voxel => {
        this.group.add(voxel);
      });

      if(this.useOutline) {
        this.draw_outline();
      }

      this.mount_point.addEventListener('keydown', this.handle_key_press.bind(this));

      this.mount_point.addEventListener('mousemove', this.handle_mouse_move.bind(this));

      this.scene.add(this.group);
      this.camera.position.z = 5;

      this.animate(this);
    }
    
  }

  class UrlReader {
    static read() {
      if(window === undefined || window.location === undefined) {
        console.warn("WARNING: UrlReader can't detect the URL on your browser.");
      }
      const qString = window.location.href.split('?').pop();
      const queries = qString.split('&').map(pair => pair.split('='));
      const queryMap = {};
      queries.forEach(query => {
        queryMap[query[0]] = query[1];
      });
      return queryMap
    }
  }

  const { p, num_colors, outline, opacity } = UrlReader.read();

  const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
  const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
  const isSupported = isSafari || isChrome;

  if(isSupported) {
    const voxView = new VoxelView({
      num_colors: num_colors || 256,
      mount_point: document.getElementById("MountPoint"),
      outline: outline === "true",
      opacity: opacity === "true"
    });
    
    fetch(`images/${p}/${p}.data.json`)
    .then(data => data.json())
    .then(rgbValues => {
      voxView.set_colors(rgbValues);
      voxView.render();
    });
  } else {
    document.body.innerHTML = '<div class="error-message-container"><div class="error-message">This plugin is not supported on your browser.  Please use Google Chrome or Safari.</div></div>';
  }

}());
