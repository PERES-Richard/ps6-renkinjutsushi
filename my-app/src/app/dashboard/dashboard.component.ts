import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType } from "chart.js";
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: '../../../../../../WebstormProjects/ps6-renkinjutsushi/my-app/src/app/dashboard/dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private doughnutChartType: ChartType;
  private doughnutChartLabels: Label[];
  private doughnutChartData: MultiDataSet;

  constructor() {
  }

  ngOnInit() {


    /**
     *   Succeed Graph Init
     */

    const dataDailySalesChart: any = {
      labels: ['2012', '2013', '2014', '2015', '2016', '2017', '2018'],
      series: [
        [80, 82, 75, 85, 80, 76, 72]
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 50,
      high: 100,
      chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
    }

    const sucessRate = new Chartist.Line('#sucessRate', dataDailySalesChart, optionsDailySalesChart);



    /**
     *   Validation Donut Init
     */

    const validationDonut = new Chartist.Pie('#ct-chart-pie', {
      series: [50,20,40]
    }, {
      startAngle: 270,
      showLabel: true
    });




    /**
     *   Number Of Students For Every Country
     */

    const numberOfStudents = new Chartist.Bar('#numberOfStudents', {
      labels: ['Country 1', 'Country 2', 'Country 3', 'Country 4'],
      series: [
        [6, 4, 8, 7],
        [4, 3, 7, 12],
        [8, 3, 1, 6]
      ]
    }, {
      seriesBarDistance: 15,
      axisX: {
        offset: 20
      },
      axisY: {
        offset: 25,
        labelInterpolationFnc: function(value) {
          return value
        },
        scaleMinSpace: 20
      }
    });


    /**
     *   Number Of Succeed And Failure For Every Country
     */

      const numberSucceedFailure = new Chartist.Bar('#numberSucceedFailure', {
      labels: ['Country 1', 'Country 2', 'Country 3', 'Country 4'],
      series: [
        [8, 12, 14, 13],
        [2, 4, 5, 3],
      ]
    }, {
      stackBars: true,
      axisY: {
        labelInterpolationFnc: function(value) {
          return value;
        }
      }
    }).on('draw', function(data) {
      if(data.type === 'bar') {
        data.element.attr({
          style: 'stroke-width: 30px'
        });
      }
    });

  }

}
