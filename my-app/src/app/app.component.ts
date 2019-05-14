import { Component} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private file;
  private _bol;

  fileChange(file) {
    this.file = file.target.files[0];
    if(this.file.name.substr(-4) != ".csv"){
      document.getElementById("para").innerHTML = "Le fichier "+this.file.name+" n'est pas un fichier .csv";
    }
    else{
      this.verifyCSV()
      if(this._bol){
      }
      else{
        document.getElementById("para").innerHTML = this.file.name+" est invalide";
      }
    }
  }

  verifyCSV(){
    var reader = new FileReader();
    reader.onload = (event: Event) => {
      let text = reader.result as string;
      var allTextLines = text.split(/\r\n|\n/);
      for(var i = 0; i<allTextLines.length; i++){
        let entries = allTextLines[i].split(',');
        if(typeof(entries[0])!= "string" || typeof(entries[1])!= "string" || typeof(entries[2])!= "string" || typeof(entries[3])!= "number" || typeof(entries[4])!= "string" || typeof(entries[5])!= "number" || typeof(entries[6])!= "number" || typeof(entries[7])!= "number" || typeof(entries[8])!= "string" || typeof(entries[9])!= "number" || typeof(entries[10])!= "number"){
          this._bol = false;
          return
        }
      }
      this._bol = true;
      return;
    };
    reader.readAsText(this.file);
  }
}
