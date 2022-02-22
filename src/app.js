
const ctx = document.getElementById('mainchart');

class GraphManager {
  constructor() {
    this.graphs = {};
    this.labels = {};
    this.datapoints = {};
    this.graph_configs = {};
  }

  graph_data(ds_name) {
    var data = {
      labels: this.labels[ds_name],
      datasets: [{
        data: this.datapoints[ds_name],
        fill: false,
        borderColor: '#3cd2a5',
        tension: 0.1
      }]
    };
    return data;
  }

  graph_config(ds_name) {
    const config = {
      type: 'line',
      data: this.graph_data(ds_name),
      options: {
        responsive: true,
        color: '#fff',
        plugins: {
          title: {
            display: true,
            text: ds_name
          },
          legend: false
        }
      },
    };
    return config;
  }

  dataset_exists(ds_name) {
    return ds_name in this.graphs;
  }

  init_dataset(ds_name) {
    /* Init data structures */
    this.labels[ds_name] = [];
    this.datapoints[ds_name] = [];

    /* Make the canvas */
    var canvas = document.createElement('canvas');
    canvas.id = 'canvas_' + ds_name;
    var container = document.getElementById('canvas_container');
    container.appendChild(canvas);

    /* Make the graph */
    this.graphs[ds_name] = new Chart(canvas, this.graph_config(ds_name))
  }

  push_point(ds_name, label, value) {
    if(!ds_name in this.labels) {
      this.init_dataset(ds_name);
    }

    this.labels[ds_name].push(label);
    this.datapoints[ds_name].push(value);
    this.graphs[ds_name].update();
  }

  destroy(ds_name) {
    if(this.dataset_exists(ds_name)) {
      this.graphs[ds_name].destroy();
      delete this.graphs[ds_name];
      delete this.labels[ds_name];
      delete this.datapoints[ds_name];
  
      var element = document.getElementById('canvas_' + ds_name);
      element.remove();
    }
  }

  destory_all() {
    var dataset_names = Object.keys(this.graphs);

    for(var i=0; i <= dataset_names.length; i++) {
      this.destroy(dataset_names[i]);
    }
  }
}


var gm = new GraphManager();


require('electron').ipcRenderer.on('webserver', (event, message) => {

    var ds_name = message.data.dataset;
    var label = message.data.x;
    var value = message.data.y;

    if(message.url === '/point') {
      if(!gm.dataset_exists(ds_name)) {
        gm.init_dataset(ds_name);
      }
    }

    if(message.url === '/point') {
      gm.push_point(ds_name, label, value);
    }
    
    if(message.url === '/reset') {
      gm.destroy(ds_name);
    }

    if(message.url === '/resetAll') {
      gm.destory_all();
    }
})

const update_graph = () => {
    const data = {
        labels: dt_labels,
        datasets: [{
          data: dt_dataset,
          fill: false,
          borderColor: '#3cd2a5',
          tension: 0.1
        }]
      };
      
      const config = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          color: '#fff',
          plugins: {
            title: {
              display: false,
              text: 'Chart.js Line Chart'
            },
            legend: false
          }
        },
      };
      if(mainchart === null) {
        mainchart = new Chart(ctx, config);
      }
      else {
          mainchart.update();
      }
       
}
