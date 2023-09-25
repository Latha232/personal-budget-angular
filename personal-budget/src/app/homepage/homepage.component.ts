import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as d3 from 'd3';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';


interface ChartData {
  datasets: {
    data: number[],
    backgroundColor: string[]
  }[];
  labels: string[];
}

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements AfterViewInit {

  public dataSource: ChartData = {
    datasets: [{
      data: [0], // Add some initial data
      backgroundColor: [
        '#ffcd56',
        '#ff6384',
        '#36a2eb',
        '#fd6b19',
      ]
    }],
    labels: []
  };

  private myPieChart: Chart | undefined;
  http: any;

  constructor(private dataService: DataService) { }

  ngAfterViewInit(): void {
    this.dataService.dataSource$.subscribe((data: any) => {
      this.updateCharts(data);
    });

    this.createD3Chart();

    // Fetch data only if it hasn't been fetched before
    if (this.dataService.isDataEmpty()) {
      this.dataService.fetchDataFromBackend();

      this.http.get('http://localhost:3000/budget')
        .subscribe((res: any) => {
          for (var i = 0; i < res.myBudget.length; i++) {
            this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
            this.dataSource.labels[i] = res.myBudget[i].title;
            this.createChart();
          }
        });
    }
  }

  createChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (ctx) {
      this.myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          datasets: this.dataSource.datasets,
          labels: this.dataSource.labels
        }
      });
    }
  }

  createD3Chart() {
    const dataset = [10, 20, 30, 40, 50];

    d3.select("#new-chart")
      .selectAll("div")
      .data(dataset)
      .enter()
      .append("div")
      .style("height", (d) => d * 10 + "px")
      .text((d) => d);
  }

  updateCharts(data: any[]) {
    const newData = data.map((item: any) => item.value);
  
    if (this.myPieChart) {
      this.myPieChart.data!.datasets![0].data = newData; 
      this.myPieChart.data!.labels = data.map((item: any) => item.title);
  
      this.myPieChart.update();
    }
  }
  
}
