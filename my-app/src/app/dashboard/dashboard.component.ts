import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as Chartist from 'chartist';
import { StatistiquesService } from '../service/statistiques/statistiques.service';

@Component({
  selector: 'app-dashboard',
  providers: [StatistiquesService],
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  constructor(private statistiquesService: StatistiquesService) {
  }

  ngOnInit() {

    this.initPieChart('SI3');

    this.initSucceedRateChart();

    this.initStudentByCountry();

    this.initSucceedByCounty();

  }


  /**
   *   Succeed Graph Init
   */
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



  /**
   *   Validation Donut Init
   */
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
          [(succeed2016[1].degre * 100) / (succeed2016[1].degre + succeed2016[0].degre),
          (succeed2017[1].degre * 100) / (succeed2017[1].degre + succeed2017[0].degre),
          (succeed2018[1].degre * 100) / (succeed2018[1].degre + succeed2018[0].degre)]
        ]
      };

      const optionsDailySalesChart: any = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        high: 110,
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
      }

      const sucessRate = new Chartist.Line('#sucessRate', DataDailySalesChart, optionsDailySalesChart);

    });

  }


  /**
   *   Number Of Students For Every Country
   */
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


  /**
   *   Number Of Succeed And Failure For Every Country
   */
  initSucceedByCounty() {

    const japonPro = this.statistiquesService.getNumberSucceedCountry('japon').toPromise();
    const canadaPro = this.statistiquesService.getNumberSucceedCountry('canada').toPromise();
    const colombiePro = this.statistiquesService.getNumberSucceedCountry('colombie').toPromise();

    Promise.all([japonPro, canadaPro, colombiePro]).then((values) => {


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
        }).on('draw', function (degre2) {
          if (degre2.type === 'bar') {
            degre2.element.attr({
              style: 'stroke-width: 30px'
            });
          }
        });
    });

  }

}
