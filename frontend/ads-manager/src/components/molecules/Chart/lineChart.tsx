// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";
import "chart.js/auto";
import type { ChartData, ChartOptions, ScatterDataPoint } from "chart.js";

type ChartType = {
  datasets: any[];
  charts?: any[];
};

export const LineChart = ({ datasets, charts }: ChartType) => {
  const [labels, setLabels] = React.useState<string[]>([]);
  const [dataRender, setDataRender] = React.useState([{}]);
  const [data, setData] = React.useState({
    labels: [],
    datasets: [],
  });

  //   let maxIncomes = Math.max.apply(
  //     Math,
  //     charts?.map((v) => v.totalIncomes)
  //   );

  //   if (maxIncomes) {
  //     const dataCount = maxIncomes + maxIncomes * 0.25;

  //     maxIncomes = dataCount.toFixed(0);
  //   }

  //   const maxVisitors = Math.max.apply(
  //     Math,
  //     charts?.map((v) => v.totalVisitors)
  //   );

  const options: ChartOptions<"line"> = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        beginAtZero: true,
        scaleLabel: {
          display: true,
          labelString: "Rp",
        },
      },
      //   y: {
      //     type: "linear",
      //     // display: sales !== -1 && (datasets.length === 2 || datasets.length === 1),
      //     display: false,
      //     min: 0,
      //     max: 100,
      //     ticks: {
      //       color: "#C05FD0",
      //       callback: function (value: any) {
      //         return Intl.NumberFormat("id-ID", {
      //           style: "currency",
      //           currency: "IDR",
      //         }).format(value);
      //       },
      //     },
      //   },
      //   y1: {
      //     type: "linear",
      //     display: true,
      //     grid: {
      //       drawOnChartArea: false,
      //     },
      //     min: 0,
      //     max: 200,
      //     ticks: {
      //       color: "#FFAE1B",
      //     },
      //   },
    },
    chart: {
      canvas: {
        parentNode: {
          style: {
            height: 50,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        align: "start",
        labels: {
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {},
    },
  };

  const plugins = [
    {
      id: "custom_legend",
      beforeInit: (chart: any) => {
        const fitValue = chart.legend.fit;

        chart.legend.fit = function fit() {
          fitValue.bind(chart.legend)();
          // eslint-disable-next-line no-return-assign
          return (this.height += 30);
        };
      },
    },
    {
      id: "custom_y_title",
      afterDraw: (chart: any) => {
        const {
          ctx,
          chartArea: { top },
        } = chart;
        ctx.save();
        ctx.fillStyle = "#444444";
        ctx.fillText("Rp", 0, top - 20);
        ctx.restore();
      },
    },
  ];

  React.useEffect(() => {
    if (charts) {
      const rev = charts.sort((a, b) => b.no - a.no);
      // console.log('reversed', reversed)

      const labels = rev.map((v) => moment(v.date).format("MM-DD"));
      setLabels(labels);
    } else {
      const arrDate = [];
      let i = 5;
      let j = 0;
      do {
        arrDate.push([
          moment().subtract(i, "days").format("D"),
          moment().subtract(i, "days").format("MMM"),
        ]);
        i = i - 1;
      } while (i > 0);
      if (i === 0) {
        do {
          arrDate.push([
            moment().add(j, "days").format("D"),
            moment().add(j, "days").format("MMM"),
          ]);
          j++;
        } while (j < 5);
      }
      setLabels(arrDate);
      setData((prev) => ({ ...prev, labels: arrDate }));
    }

    if (datasets) {
      setDataRender(datasets);
      setData((prev) => ({ ...prev, datasets: datasets }));
    }
  }, [charts, datasets]);

  return <Line options={options} data={data} plugins={plugins} />;
};
