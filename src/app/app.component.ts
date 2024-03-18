import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Chart from 'chart.js/auto';

// Define your custom color palette
const customColors = [
  'rgba(255, 99, 132, 0.8)', // Red
  'rgba(54, 162, 235, 0.8)', // Blue
  'rgba(255, 205, 86, 0.8)', // Yellow
  // Add more colors as needed
];

// Set the custom color palette in the global options
// @ts-ignore
Chart.defaults.backgroundColor = customColors;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
