import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { IconPencilComponent } from '../../../../core/components/icons/pencil/pencil.component';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';

@Component({
  selector: 'app-clipping',
  standalone: true,
  imports: [
    TableModule,
    CheckboxModule,
    ButtonModule,
    IconPencilComponent,
    IconNewspaperComponent,
  ],
  templateUrl: './clipping.component.html',
  styleUrl: './clipping.component.scss',
})
export class ClippingComponent {
  customers!: any[];

  totalRecords!: number;

  loading: boolean = false;

  selectAll: boolean = false;

  selectedCustomers!: any[];

  ngOnInit() {
    this.loading = true;
  }

  getData = () => {
    return [
      {
        id: 1000,
        name: 'James Butt',
        country: {
          name: 'Algeria',
          code: 'dz',
        },
        company: 'Benton, John B Jr',
        date: '2015-09-13',
        status: 'unqualified',
        verified: true,
        activity: 17,
        representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png',
        },
        balance: 70663,
      },
      {
        id: 1001,
        name: 'James Butt 2',
        country: {
          name: 'Algeria',
          code: 'dz',
        },
        company: 'Benton, John B Jr',
        date: '2015-09-13',
        status: 'unqualified',
        verified: true,
        activity: 17,
        representative: {
          name: 'Ioni Bowcher',
          image: 'ionibowcher.png',
        },
        balance: 70663,
      },
    ];
  };

  loadCustomers(event: TableLazyLoadEvent) {
    this.loading = true;

    setTimeout(() => {
      const data = this.getData();
      this.customers = data;
      this.totalRecords = data.length;
      this.loading = false;
    }, 1000);
  }

  onSelectionChange(value = []) {
    this.selectAll = value.length === this.totalRecords;
    this.selectedCustomers = value;
  }

  log = () => {
    console.log('hai');
  };
}
