import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import {StatistiquesService} from "../service/statistiques/statistiques.service";
import {Data} from "../models/Data";

@Component({
  selector: 'app-dashboard',
  providers: [StatistiquesService],
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private doughnutChartType: ChartType;
  private doughnutChartLabels: Label[];
  private doughnutChartData: MultiDataSet;
  private variable3: Data[]=[];
  private nbValide: Number[]=[0];
  private nbEnCours: Number[]=[0];
  private nbNonValide: Number[]=[0];
  private nbCanada2016: Number[];
  private nbCanada2017: Number[];
  private nbCanada2018: Number[];
  private nbColombie2016: Number[];
  private nbColombie2017: Number[];
  private nbColombie2018: Number[];
  private nbJapon2016: Number[];
  private nbJapon2017: Number[];
  private nbJapon2018: Number[];

  constructor(private statistiquesService: StatistiquesService) {
  }

  ngOnInit() {


    const variable2 = this.statistiquesService.getNumberStudents().subscribe( (tmp) => {
      this.variable3=tmp
    });

    const variable3 = this.statistiquesService.getValide().subscribe((tmp) => {
      this.nbValide=tmp
    });
    const variable4 = this.statistiquesService.getEnCours().subscribe((tmp) => {
      this.nbEnCours=tmp
    });
    const variable5 = this.statistiquesService.getNonValide().subscribe((tmp) => {
      this.nbNonValide=tmp
    });
    const variable6 = this.statistiquesService.getStudentsCanada2016().subscribe((tmp) => {
      this.nbCanada2016=tmp
    });
    const variable7 = this.statistiquesService.getStudentsCanada2017().subscribe((tmp) => {
      this.nbCanada2017=tmp
    });
    const variable8 = this.statistiquesService.getStudentsCanada2018().subscribe((tmp) => {
      this.nbCanada2018=tmp
    });
    const variable9 = this.statistiquesService.getStudentsColombie2016().subscribe((tmp) => {
      this.nbColombie2016=tmp
    });
    const variable10 = this.statistiquesService.getStudentsColombie2017().subscribe((tmp) => {
      this.nbColombie2017=tmp
    });
    const variable11 = this.statistiquesService.getStudentsColombie2018().subscribe((tmp) => {
      this.nbColombie2018=tmp
    });
    const variable12 = this.statistiquesService.getStudentsJapon2016().subscribe((tmp) => {
      this.nbJapon2016=tmp
    });
    const variable13 = this.statistiquesService.getStudentsJapon2017().subscribe((tmp) => {
      this.nbJapon2017=tmp
    });
    const variable14 = this.statistiquesService.getStudentsJapon2018().subscribe((tmp) => {
      this.nbJapon2018=tmp
    });

    /**
     *   Succeed Graph Init
     */

    const dataDailySalesChart: any = {
      labels: ['2012', '2013', '2014', '2015', '2016', '2017', '2018'],
      series: [
        [80, 82, 75, 85, 80, 76, 70]
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
      series: [20,50,30]
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
      if (data.type === 'bar') {
        data.element.attr({
          style: 'stroke-width: 30px'
        });
      }
    });

  }

}
