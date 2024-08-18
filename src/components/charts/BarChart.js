import { Container } from "react-bootstrap";
import { Bar, Line } from "react-chartjs-2";

const BarChart = ({ data, title, type, showLegend, width, totalAmount }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
        display: showLegend,
      },

      title: {
        display: true,
        text: title,
      },

      tooltip: {
        mode: "point",
        intersect: false,
        displayColors: type === "perc_value" ? false : true,
        callbacks: {
          label: function (context) {
            if (type === "currency") {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}€`;
            } else if (type === "perc_value") {
              return [`${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`, `Amount: ${((context.parsed.y / 100) * totalAmount).toFixed(2)}€`];
            } else if (type === "percentage") {
              return context.dataset.label + ": " + context.parsed.y.toFixed(2) + "%";
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
          color: "#1d1b1b43", // for the grid lines
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
            if (type === "currency") {
              if (Math.floor(value) === value) {
                return value.toFixed(2) + "€";
              }
            } else if (type === "percentage") {
              if (Math.floor(value) === value) {
                return value.toFixed(0) + "%";
              }
            } else {
              if (Math.floor(value) === value) {
                return value;
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
          color: "#ff090943", // for the grid lines
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
    <Container style={{ height: "30vh", width: width }}>
      <Bar options={options} data={data} />
    </Container>
  );
};

export default BarChart;
