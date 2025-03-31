import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ResultTable = ({ results }) => {
  const { redPoints, yellowPoints, greenPoints, bluePoints } = results;
  
  const chartData = {
    labels: ['Kırmızı', 'Sarı', 'Yeşil', 'Mavi'],
    datasets: [
      {
        data: [redPoints, yellowPoints, greenPoints, bluePoints],
        backgroundColor: [
          '#DC2626',
          '#FBBF24',
          '#10B981',
          '#3B82F6',
        ],
        hoverBackgroundColor: [
          '#B91C1C',
          '#D97706',
          '#059669',
          '#2563EB',
        ],
      },
    ],
  };
  
  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14
          },
          padding: 20
        }
      }
    },
    cutout: '60%'
  };
  
  const totalPoints = redPoints + yellowPoints + greenPoints + bluePoints;
  
  const getPercentage = (points) => {
    return ((points / totalPoints) * 100).toFixed(1);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Test Sonuçları</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="max-w-md mx-auto">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
        
        <div>
          <table className="results-table">
            <thead>
              <tr>
                <th>Renk</th>
                <th>Puan</th>
                <th>Yüzde</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="color-red">Kırmızı</span>
                </td>
                <td className="text-center">{redPoints}</td>
                <td className="text-center">{getPercentage(redPoints)}%</td>
              </tr>
              <tr>
                <td>
                  <span className="color-yellow">Sarı</span>
                </td>
                <td className="text-center">{yellowPoints}</td>
                <td className="text-center">{getPercentage(yellowPoints)}%</td>
              </tr>
              <tr>
                <td>
                  <span className="color-green">Yeşil</span>
                </td>
                <td className="text-center">{greenPoints}</td>
                <td className="text-center">{getPercentage(greenPoints)}%</td>
              </tr>
              <tr>
                <td>
                  <span className="color-blue">Mavi</span>
                </td>
                <td className="text-center">{bluePoints}</td>
                <td className="text-center">{getPercentage(bluePoints)}%</td>
              </tr>
              <tr className="total-row">
                <td>Toplam</td>
                <td className="text-center">{totalPoints}</td>
                <td className="text-center">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold mb-3 text-gray-800">Renk Profili Anlamları:</h3>
        <ul className="space-y-2 text-gray-700">
          <li><strong className="text-red-600">Kırmızı:</strong> Güçlü, kararlı, lider özellikler taşıyan kişileri temsil eder.</li>
          <li><strong className="text-yellow-500">Sarı:</strong> Neşeli, sosyal, eğlenceli ve iletişimi güçlü kişileri temsil eder.</li>
          <li><strong className="text-green-600">Yeşil:</strong> Sakin, uyumlu, barışçıl ve destekleyici kişileri temsil eder.</li>
          <li><strong className="text-blue-600">Mavi:</strong> Düzenli, analitik, detaycı ve mükemmeliyetçi kişileri temsil eder.</li>
        </ul>
      </div>
    </div>
  );
};

export default ResultTable;
