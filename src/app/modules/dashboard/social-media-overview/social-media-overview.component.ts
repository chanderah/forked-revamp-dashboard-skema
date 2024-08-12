import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WordCloudComponent } from '../components/word-cloud/word-cloud.component';

@Component({
  selector: 'app-social-media-index',
  standalone: true,
  imports: [CommonModule, WordCloudComponent],
  templateUrl: './social-media-overview.component.html',
  styleUrl: './social-media-overview.component.scss',
})
export class SocialMediaOverviewComponent {
  res = {
    message: 'get success...',
    data: [
      {
        name: 'mandiri',
        weight: 1278,
      },
      {
        name: 'saham',
        weight: 855,
      },
      {
        name: 'bantuan',
        weight: 799,
      },
      {
        name: 'bansos',
        weight: 787,
      },
      {
        name: 'pajak',
        weight: 734,
      },
      {
        name: 'grup',
        weight: 698,
      },
      {
        name: 'pencairan',
        weight: 588,
      },
      {
        name: 'ekonomi',
        weight: 513,
      },
      {
        name: 'masyarakat',
        weight: 512,
      },
      {
        name: 'bpnt',
        weight: 496,
      },
      {
        name: 'pertumbuhan',
        weight: 479,
      },
      {
        name: 'dana',
        weight: 456,
      },
      {
        name: 'penerima',
        weight: 427,
      },
      {
        name: 'level',
        weight: 396,
      },
      {
        name: 'perusahaan',
        weight: 387,
      },
      {
        name: 'kuartal',
        weight: 379,
      },
      {
        name: 'turun',
        weight: 353,
      },
      {
        name: 'pasar',
        weight: 350,
      },
      {
        name: 'pemerintah',
        weight: 350,
      },
      {
        name: 'data',
        weight: 336,
      },
      {
        name: 'sosial',
        weight: 327,
      },
      {
        name: 'program',
        weight: 312,
      },
      {
        name: 'menyetorkan',
        weight: 307,
      },
      {
        name: 'informasi',
        weight: 305,
      },
      {
        name: 'kartu',
        weight: 293,
      },
      {
        name: 'sektor',
        weight: 291,
      },
      {
        name: 'saldo',
        weight: 287,
      },
      {
        name: 'keuangan',
        weight: 287,
      },
      {
        name: 'rakyat',
        weight: 272,
      },
      {
        name: 'keluarga',
        weight: 265,
      },
      {
        name: 'kredit',
        weight: 259,
      },
      {
        name: 'cair',
        weight: 253,
      },
      {
        name: 'perdagangan',
        weight: 252,
      },
      {
        name: 'senin',
        weight: 251,
      },
      {
        name: 'tahap',
        weight: 250,
      },
      {
        name: 'indeks',
        weight: 246,
      },
      {
        name: 'terbesar',
        weight: 229,
      },
      {
        name: 'ihsg',
        weight: 228,
      },
      {
        name: 'penyaluran',
        weight: 224,
      },
      {
        name: 'value',
        weight: 222,
      },
    ],
    total_word: 40,
  };

  isLoadingWordCloud: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  get wordCloudData() {
    return this.res.data.map((v) => {
      return {
        text: v.name,
        value: v.weight,
      };
    });
  }
}
