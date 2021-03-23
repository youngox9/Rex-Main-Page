/* eslint-disable array-callback-return */
/* eslint-disable no-throw-literal */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */

function Imgur(options) {
  if (!this || !(this instanceof Imgur)) {
    return new Imgur(options);
  }

  if (!options) {
    options = {};
  }

  if (!options.clientid) {
    throw 'Provide a valid Client Id here: https://api.imgur.com/';
  }

  this.clientid = options.clientid;
  this.endpoint = 'https://api.imgur.com/3/image';
  this.callback = options.callback || undefined;
  this.dropzone = document.querySelectorAll('.dropzone');
  this.info = document.querySelectorAll('.info');
  // Start
  this.run();
}

Imgur.prototype = {
  createEls(name, props, text) {
    let el = document.createElement(name); let
      p;
    for (p in props) {
      if (props.hasOwnProperty(p)) {
        el[p] = props[p];
      }
    }
    if (text) {
      el.appendChild(document.createTextNode(text));
    }
    return el;
  },
  insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  },
  post(path, data, callback) {
    let xhttp = new XMLHttpRequest();

    xhttp.open('POST', path, true);
    xhttp.setRequestHeader('Authorization', `Client-ID ${this.clientid}`);
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 300) {
          let response = '';
          try {
            response = JSON.parse(this.responseText);
          } catch (err) {
            response = this.responseText;
          }
          callback.call(window, response);
        } else {
          throw new Error(`${this.status} - ${this.statusText}`);
        }
      }
    };
    xhttp.send(data);
    xhttp = null;
  },
  createDragZone() {
    let p1; let p2; let
      input;

    p1 = this.createEls('p', {}, 'Drop Image File Here');
    p2 = this.createEls('p', {}, 'Or click here to select image');
    input = this.createEls('input', { type: 'file', multiple: 'multiple', className: 'input', accept: 'image/*' });

    Array.prototype.forEach.call(this.info, function (zone) {
      zone.appendChild(p1);
      zone.appendChild(p2);
    });
    Array.prototype.forEach.call(this.dropzone, function (zone) {
      zone.appendChild(input);
      this.status(zone);
      this.upload(zone);
    }.bind(this));
  },
  loading() {
    let div; let table; let
      img;

    div = this.createEls('div', { className: 'loading-modal' });
    table = this.createEls('table', { className: 'loading-table' });
    img = this.createEls('img', { className: 'loading-image', src: './css/loading-spin.svg' });

    div.appendChild(table);
    table.appendChild(img);
    document.body.appendChild(div);
  },
  status(el) {
    let div = this.createEls('div', { className: 'status' });

    this.insertAfter(el, div);
  },
  matchFiles(file, zone, fileCount) {
    let status = zone.nextSibling;

    if (file.type.match(/image/) && file.type !== 'image/svg+xml') {
      document.body.classList.add('loading');
      status.classList.remove('bg-success', 'bg-danger');
      status.innerHTML = '';

      let fd = new FormData();
      fd.append('image', file);

      this.post(this.endpoint, fd, function (data) {
        if (fileCount[0] + 1 == fileCount[1]) {
          document.body.classList.remove('loading');
        }
        typeof this.callback === 'function' && this.callback.call(this, data);
      }.bind(this));
    } else {
      status.classList.remove('bg-success');
      status.classList.add('bg-danger');
      status.innerHTML = 'Invalid archive';
    }
  },
  upload(zone) {
    let events = ['dragenter', 'dragleave', 'dragover', 'drop'];
    let file; let target; let i; let
      len;

    zone.addEventListener('change', function (e) {
      if (e.target && e.target.nodeName === 'INPUT' && e.target.type === 'file') {
        target = e.target.files;

        for (i = 0, len = target.length; i < len; i += 1) {
          file = target[i];
          this.matchFiles(file, zone, [i, target.length]);
        }
      }
    }.bind(this), false);

    events.map(function (event) {
      zone.addEventListener(event, function (e) {
        if (e.target && e.target.nodeName === 'INPUT' && e.target.type === 'file') {
          if (event === 'dragleave' || event === 'drop') {
            e.target.parentNode.classList.remove('dropzone-dragging');
          } else {
            e.target.parentNode.classList.add('dropzone-dragging');
          }
        }
      }, false);
    });
  },
  run() {
    let loadingModal = document.querySelector('.loading-modal');

    if (!loadingModal) {
      this.loading();
    }
    this.createDragZone();
  }
};

export default Imgur;
