import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import {StatistiquesService} from "../service/statistiques/statistiques.service";
import {Degre} from "../models/Degre";

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
  private doughnutChartDegre: MultiDataSet;
  private nbValide: Degre[];
  private nbEnCours: Degre[];
  private nbNonValide: Degre[];
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


    // const spePromise = this.tableListService.getSpecialiteObs().toPromise();
    //
    // spePromise.then( (values) => {
    //   const spe = values;


    this.initPieChart('SI3');

    this.initSucceedRateChart();
    this.initStudentByCountry();

    this.initSucceedByCounty();

    /*
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
        */

    /**
     *   Succeed Graph Init
     */


    /**
     *   Validation Donut Init
     */


    /**
     *   Number Of Students For Every Country
     */


    /**
     *   Number Of Succeed And Failure For Every Country
     */


  }

  initPieChart(promo: string) {
    const promotionPro = this.statistiquesService.getPieChart(promo).toPromise();

    promotionPro.then((value) => {


      const validationDonut = new Chartist.Pie('#ct-chart-pie', {
        series: [value[0].degre, value[1].degre, value[2].degre]
      }, {
        startAngle: 270,
        showLabel: true
      });
    });
  }


  initSucceedRateChart() {

    const succeed2016Pro = this.statistiquesService.getNumberSucceed('2016').toPromise();
    const succeed2017Pro = this.statistiquesService.getNumberSucceed('2017').toPromise();
    const succeed2018Pro = this.statistiquesService.getNumberSucceed('2018').toPromise();

    Promise.all([succeed2016Pro, succeed2017Pro, succeed2018Pro]).then((values) => {

      const succeed2016 = values[0];
      const succeed2017 = values[1];
      const succeed2018 = values[2];


      const DataDailySalesChart: any = {
        labels: ['2016', '2017', '2018'],
        series: [
          [(succeed2016[1].degre * 100) / (succeed2016[1].degre + succeed2016[0].degre), (succeed2017[1].degre * 100) / (succeed2017[1].degre + succeed2017[0].degre), (succeed2018[1].degre * 100) / (succeed2018[1].degre + succeed2018[0].degre)]
        ]
      };

      const optionsDailySalesChart: any = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        high: 110,
        chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
      }

      const sucessRate = new Chartist.Line('#sucessRate', DataDailySalesChart, optionsDailySalesChart);

    });

  }

  initStudentByCountry() {
    const japonPro = this.statistiquesService.getNumberStudents('japon').toPromise();
    const canadaPro = this.statistiquesService.getNumberStudents('canada').toPromise();
    const colombiePro = this.statistiquesService.getNumberStudents('colombie').toPromise();

    Promise.all([japonPro, canadaPro, colombiePro]).then((values) => {
      const japon = values[0];
      const canada = values[1];
      const colombie = values[2];


      const numberOfStudents = new Chartist.Bar('#numberOfStudents', {
        labels: ['Japon', 'Canada', 'Colombie'],
        series: [
          [japon[0].degre, canada[0].degre, colombie[0].degre],
          [japon[2].degre, canada[1].degre, colombie[1].degre],
          [japon[1].degre, canada[2].degre, colombie[2].degre]
        ]
      }, {
        seriesBarDistance: 15,
        axisX: {
          offset: 20
        },
        axisY: {
          offset: 25,
          labelInterpolationFnc: function (value) {
            return value
          },
          scaleMinSpace: 20
        }
      });

    });
  }


  initSucceedByCounty() {

    const japonPro = this.statistiquesService.getNumberSucceedCountry('japon').toPromise();
    const canadaPro = this.statistiquesService.getNumberSucceedCountry('canada').toPromise();
    const colombiePro = this.statistiquesService.getNumberSucceedCountry('colombie').toPromise();

    Promise.all([japonPro, canadaPro, colombiePro]).then((values) => {

      console.log(values[0]);
      console.log(values[1]);
      console.log(values[2]);

      const japon = values[0];
      const canada = values[1];
      const colombie = values[2];


      const numberSucceedFailure = new Chartist.Bar('#numberSucceedFailure', {
        labels: ['Japon', 'Canada', 'Colombie'],
        series: [
          [japon[0].degre, canada[0].degre, colombie[0].degre],
          [japon[1].degre, canada[1].degre, colombie[1].degre],
        ]
      }, {
        stackBars: true,
        axisY: {
          labelInterpolationFnc: function (value) {
            return value;
          }
        }
      }).on('draw', function (Degre) {
        if (Degre.type === 'bar') {
          Degre.element.attr({
            style: 'stroke-width: 30px'
          });
        }
      });
    });

  }

}
