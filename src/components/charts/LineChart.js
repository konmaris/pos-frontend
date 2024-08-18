import { Container } from "react-bootstrap";
import { Line } from "react-chartjs-2";

const LineChart = ({ data, title, type }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
        display: true,
      },

      title: {
        display: true,
        text: title,
      },

      tooltip: {
        mode: "point",
        intersect: false,
        callbacks: {
          label: function (context) {
            if (type === "currency") {
              return context.dataset.label + ": " + context.parsed.y.toFixed(2) + "€";
            } else {
              return context.dataset.label + ": " + context.parsed.y;
            }
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: "#41414143", // for the grid lines
          tickColor: "#000000e1", // for the tick mark

          tickLength: 10, // just to see the dotted line
          tickWidth: 2,
          offset: true,
          drawTicks: false, // true is default

          drawOnChartArea: true, // true is default
        },
        ticks: {
          maxTicksLimit: 6,
          callback: function (value, index, values) {
            if (type !== "currency") {
              if (Math.floor(value) === value) {
                return value;
              }
            } else {
              if (Math.floor(value) === value) {
                return value.toFixed(2) + "€";
              }
            }
          },
          color: "#4a4a4a",
          font: {
            size: 12,
            weight: 400,
          },
          padding: 20,
        },

        beginAtZero: true,
      },
      x: {
        display: true,
        grid: {
          color: "#41414143", // for the grid lines
          tickColor: "#000000e1", // for the tick mark

          tickLength: 10, // just to see the dotted line
          tickWidth: 2,
          offset: true,
          drawTicks: false, // true is default

          drawOnChartArea: false, // true is default
        },
        ticks: {
          color: "#4a4a4a",
          font: {
            size: 12,
            weight: 400,
          },
          padding: 20,
        },
      },
    },
  };

  return (
    <Container style={{ height: "40vh", width: "100%" }}>
      <Line options={options} data={data} />
    </Container>
  );
};

export default LineChart;
