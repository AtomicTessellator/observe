
const ctx = document.getElementById('mainchart');
var mainchart = null;

var dt_labels = [];
var dt_dataset = [];

require('electron').ipcRenderer.on('webserver', (event, message) => {
    if(message.url === '/point') {
        dt_labels.push(message.data.x);
        dt_dataset.push(message.data.y);
        update_graph();
    }
    if(message.url === '/reset') {
        if(mainchart) {
            mainchart.destroy();
            mainchart = null;
            dt_labels = [];
            dt_dataset = [];
        }
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
