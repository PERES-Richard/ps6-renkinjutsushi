import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as Chartist from 'chartist';
import { StatistiquesService } from '../service/statistiques/statistiques.service';
import {Degre} from "../models/Degre";

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
    let tab: number[]= [0,0,0,0];
    promotionPro.then((value) => {

      if (value.length != 4){
        for (let i of value){
          console.log(i);
          tab[i.etatdegre] = i.degre
        }
      }else {

        for (let j=0;j<value.length;j++){
          tab[j]=value[j].degre;
        }
      }
      const validationDonut = new Chartist.Pie('#ct-chart-pie', {
        series: [tab[0], tab[3], tab[1]+tab[2]]
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
    const countryPro = this.statistiquesService.getNumberStudents('-1').toPromise();

    Promise.all([countryPro]).then((value) => {

      const country1 = value[0][0].pays;
      const country2 = value[0][1].pays;
      const country3 = value[0][2].pays;

      // console.log("country1" + country1);
      // console.log("country2" + country2);
      // console.log("country3" + country3);

      const country11Pro = this.statistiquesService.getNumberStudentsWithCountry(country1, '-1').toPromise();
      const country22Pro = this.statistiquesService.getNumberStudentsWithCountry(country2, '-1').toPromise();
      const country33Pro = this.statistiquesService.getNumberStudentsWithCountry(country3, '-1').toPromise();

      Promise.all([country11Pro, country22Pro, country33Pro]).then((values) => {

        console.log('values ' + values[2]);

        // values[0].sort(this.sortByName);


        const country11 = [values[0][0], values[0][1], values[0][2]];
        const country22 = [values[1][0], values[1][1], values[1][2]];
        const country33 = [values[2][0], values[2][1], values[2][2]];

        console.log('values', country11[0], country11[1], country11[2]);
        console.log('values', country22[0]);
        console.log('values', country33[0]);

        const numberOfStudents = new Chartist.Bar('#numberOfStudents', {
          labels: [country11[0].pays, country22[0].pays, country33[0].pays],
          series: [
            [country11[0].nombre, country22[0].nombre, country33[0].nombre],
            [country11[1].nombre, country22[1].nombre, country33[1].nombre],
            [country11[2].nombre, country22[2].nombre, country33[2].nombre]
          ]
        }, {
            seriesBarDistance: 15,
            axisX: {
              offset: 20
            },
            axisY: {
              offset: 25,
              labelInterpolationFnc: function (result) {
                return result
              },
              scaleMinSpace: 20
            }
          });
      });
    });
  }

  sortByName(elementOne: any, elementTwo: any) {
    if (elementOne.nom_fr_fr < elementTwo.nom_fr_fr) {
      return 0;
    } else {
      return 1;
    }
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
