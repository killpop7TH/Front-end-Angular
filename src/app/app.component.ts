import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Taza } from './taza';
import { TazaService } from './taza.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public tazas: Taza[];
  public editTaza: Taza;
  public deleteTaza: Taza;

  constructor(private tazaService: TazaService) {}

  ngOnInit() {
    this.getTazas();
  }

  public getTazas(): void {
    this.tazaService.getTazas().subscribe({
      next: (response: Taza[]) => {
        this.tazas = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }
  //add taza
  public onAddTaza(addForm: NgForm): void {
    document.getElementById('close-btn').click();
    this.tazaService.addTaza(addForm.value).subscribe({
      next: (response: Taza) => {
        console.log(response);
        this.getTazas();
        addForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      },
    });
  }
  //update taza
  public onDeleteTaza(tazaId: number): void {
    document.getElementById('close-btn-updateModal').click();
    this.tazaService.deleteTaza(tazaId).subscribe({
      next: (response: void) => {
        console.log(response);
        this.getTazas();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }
  //update taza for sum up stock
  public onUpdateTaza(taza: Taza): void {
    if (
      isNaN(
        parseFloat(
          (<HTMLInputElement>document.getElementById('newStock')).value
        )
      )
    ) {
      document.getElementById('close-btn-updateModal').click();
    } else {
      let nStock: number = parseFloat(
        (<HTMLInputElement>document.getElementById('newStock')).value
      );
      taza.stock = Number(taza.stock) + nStock;
      (<HTMLInputElement>document.getElementById('newStock')).value = '';
      document.getElementById('close-btn-updateModal').click();
      this.tazaService.updateTaza(taza).subscribe({
        next: (response: Taza) => {
          console.log(response);
          this.getTazas();
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message);
        },
      });
    }
  }
  //update taza for substrack stock
  public onUpdateTaza2(taza: Taza): void {
    if (
      isNaN(
        parseFloat(
          (<HTMLInputElement>document.getElementById('newStock2')).value
        )
      )
    ) {
      document.getElementById('close-btn-updateModal').click();
    } //If sold less or equal to stock
    else if (
      parseFloat(
        (<HTMLInputElement>document.getElementById('newStock2')).value
      ) <= Number(taza.stock)
    ) {
      //SOLD BAJA
      if (String(taza.calidad) == 'baja') {
        let nStock: number = parseFloat(
          (<HTMLInputElement>document.getElementById('newStock2')).value
        );
        //check if required stock is more than 10
        let roundResult = nStock / 10;
        let roundResult2 = Math.floor(roundResult);
        if (roundResult2 == 0) {
          //No gifted tazas
          taza.stock = Number(taza.stock) - nStock;
          (<HTMLInputElement>document.getElementById('newStock2')).value = '';
          document.getElementById('close-btn-updateModal').click();
          this.tazaService.updateTaza(taza).subscribe({
            next: (response: Taza) => {
              console.log(response);
              this.getTazas();
            },
            error: (error: HttpErrorResponse) => {
              alert(error.message);
            },
          });
        } else {
          //Gift
          //Tazas de calidad baja a regalar
          let giftedTotal = roundResult2 * 2;
          //sum of sold + gifted to check if this taza is baja
          let nStock2 = nStock + giftedTotal;
          //check if taza.stock >= nStock2
          if (Number(taza.stock) >= nStock2) {
            taza.stock = Number(taza.stock) - nStock2;
          (<HTMLInputElement>document.getElementById('newStock2')).value = '';
          document.getElementById('close-btn-updateModal').click();
          this.tazaService.updateTaza(taza).subscribe({
            next: (response: Taza) => {
              console.log(response);
              this.getTazas();
            },
            error: (error: HttpErrorResponse) => {
              alert(error.message);
            },
          });

          } else {
            alert(
              'La cantidad solicitada + lo regalado excede el stock disponible, por favor elija otra cantidad o producto!'
            );
          }
        }
      } else {
        //SOLD ALTA
        

      }
    } else {
      //stock < required products
      alert(
        'La cantidad solicitada excede el stock disponible, por favor elija otra cantidad o producto!'
      );
    }
  }

  //Modal dinamic selection
  public onOpenModal(taza: Taza, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addTazaModal');
    }
    if (mode === 'edit') {
      this.editTaza = taza;
      button.setAttribute('data-target', '#updateTazaModal');
    }
    if (mode === 'edit2') {
      this.editTaza = taza;
      button.setAttribute('data-target', '#updateTazaModal2');
    }
    if (mode === 'delete') {
      this.deleteTaza = taza;
      button.setAttribute('data-target', '#deleteTazaModal');
    }
    container.appendChild(button);
    button.click();
  }
}
