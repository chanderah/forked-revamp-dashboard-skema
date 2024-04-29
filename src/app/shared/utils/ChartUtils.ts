// @ts-nocheck
const getOrCreateLegendList = ({ containerID, flexDirection }) => {
  const legendContainer = document.getElementById(containerID);
  let listContainer = legendContainer.querySelector('ul');

  if (!listContainer) {
    listContainer = document.createElement('ul');
    listContainer.style.display = 'flex';
    listContainer.style.flexDirection = flexDirection ?? 'column';
    listContainer.style.justifyContent = 'center';
    listContainer.style.flexWrap = 'wrap';
    listContainer.style.gap = '12px';
    listContainer.style.marginLeft = 0;
    listContainer.style.padding = 0;

    legendContainer.appendChild(listContainer);
  }

  return listContainer;
};

export const htmlLegendPlugin = {
  id: 'htmlLegend',
  afterUpdate(chart, _, options) {
    const ul = getOrCreateLegendList(options);
    const { flexDirection, percentagesValueFontSize, fontWeight } = options;

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    let percentages = [];
    if (chart.data.datasets.length)
      percentages = chart.data.datasets[0].percentages;

    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.style.cursor = 'pointer';
      li.style.display = 'flex';
      li.style.flexDirection = flexDirection ?? 'column';
      li.style.marginLeft = '10px';
      li.style.gap = '7px';

      li.onclick = () => {
        const { type } = chart.config;
        if (type === 'pie' || type === 'doughnut') {
          // Pie and doughnut charts only have a single dataset and visibility is per item
          chart.toggleDataVisibility(item.index);
        } else {
          chart.setDatasetVisibility(
            item.datasetIndex,
            !chart.isDatasetVisible(item.datasetIndex)
          );
        }
        chart.update();
      };

      // Color box
      const boxSpan = document.createElement('span');
      boxSpan.style.background = item.fillStyle;
      boxSpan.style.borderColor = item.strokeStyle;
      boxSpan.style.borderWidth = item.lineWidth + 'px';
      boxSpan.style.display = 'inline-block';
      boxSpan.style.flexShrink = 0;
      boxSpan.style.height = '10px';
      boxSpan.style.marginRight = '10px';
      boxSpan.style.width = '5px';

      // Text
      const textContainer = document.createElement('p');
      textContainer.style.color = item.fontColor;
      textContainer.style.fontWeight = fontWeight ?? '500';
      textContainer.style.margin = 0;
      textContainer.style.padding = 0;
      textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

      const text = document.createTextNode(item.text);
      textContainer.appendChild(text);

      const labelContainer = document.createElement('div');
      labelContainer.style.display = 'flex';
      labelContainer.style.alignItems = 'center';
      labelContainer.appendChild(boxSpan);
      labelContainer.appendChild(textContainer);
      
      const valueContainer = document.createElement('div');
      valueContainer.style.display = 'flex';
      valueContainer.style.alignItems = 'baseline';
      // valueContainer.classList.add('gap-3');

      const value = document.createElement('div');
      value.style.textDecoration = item.hidden ? 'line-through' : '';
      if (percentagesValueFontSize) {
        value.style.fontSize = percentagesValueFontSize;
        value.style.fontWeight = fontWeight;
      } else {
        value.classList.add('text-3xl');
        value.classList.add('font-bold');
      }
      value.appendChild(document.createTextNode(percentages?.[index] ?? '-'));

      const percent = document.createElement('div');
      if (percentagesValueFontSize) {
        percent.style.fontSize = percentagesValueFontSize;
        value.style.fontWeight = fontWeight;
      } else {
        percent.classList.add('text-xs');
        percent.classList.add('text-400');
      }
      percent.appendChild(document.createTextNode('%'));

      valueContainer.appendChild(value);
      valueContainer.appendChild(percent);
      li.appendChild(labelContainer);
      li.appendChild(valueContainer);
      ul.appendChild(li);
    });
  },
};

export const barOpacityPlugin = {
  id: 'barOpacityPlugin',
  beforeDraw: function (chart, _, options) {
    chart.data.datasets.forEach((dataset) => {
      dataset.backgroundColor = dataset.backgroundColor.replace(
        '0.5',
        `${options.opacity}`
      );
    });
  },
};
