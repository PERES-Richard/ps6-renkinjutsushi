import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as Chartist from 'chartist';
import { StatistiquesService } from '../service/statistiques/statistiques.service';
import {Degre} from "../models/Degre";
import {TupleNameNumber} from "../models/TupleNameNumber";

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

    //Etat -1 doesn't exist so it will return all the students
    const countryPro = this.statistiquesService.getNumberStudents('-1').toPromise();
    let tab1: number[];
    let tab2: number[];
    let tab3: number[];
    Promise.all([countryPro]).then((value) => {


      // Name of the first three famous country ( country with the most of requests)
      const country1Name = value[0][0].pays;
      const country2Name = value[0][1].pays;
      const country3Name = value[0][2].pays;

      const country1Pro = this.statistiquesService.getNumberStudentsWithCountry(country1Name, '-1').toPromise();
      const country2Pro = this.statistiquesService.getNumberStudentsWithCountry(country2Name, '-1').toPromise();
      const country3Pro = this.statistiquesService.getNumberStudentsWithCountry(country3Name, '-1').toPromise();

      Promise.all([country1Pro, country2Pro, country3Pro]).then((values) => {


        tab1 = this.verificationOnCountryGraph(values[0]);
        tab2 = this.verificationOnCountryGraph(values[1]);
        tab3 = this.verificationOnCountryGraph(values[2]);


        const numberOfStudents = new Chartist.Bar('#numberOfStudents', {
          labels: [country1Name, country2Name, country3Name],
          series: [
            [tab1[0], tab2[0], tab3[0]],
            [tab2[1], tab2[1], tab3[1]],
            [tab3[2], tab2[2], tab3[2]]
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

  verificationOnCountryGraph(country: TupleNameNumber[]){
    let tab: number[] = [0,0,0];
    console.log("country length  "+country);
    if (country.length != 3){
      for (let i of country){
        tab[i.annee-2016] = i.nombre
      }
    }else {
      for (let j=0;j<country.length;j++){
        tab[j]=country[j].nombre;
        console.log("country "+j+ " " +country[j].nombre);
      }
    }
    return tab;
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
