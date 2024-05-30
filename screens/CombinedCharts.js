// CombinedChart.js
import React from 'react';
import { View,  Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };
const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 2,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    xAxisLabel: 's',
    yAxisLabel: 'cm',
  };

const CombinedChart = ({ data }) => {

    const graphData1 = {
        labels: data?.map(item => formatNumber(item.label1)),
        datasets: [
          {
            data: data?.map(item => item.lineData),
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2,
          },
        ],
        legend: ['Height vs Time'],
      };
    
      const graphData2 = {
        labels: data?.map(item => formatNumber(item.label2)),
        datasets: [
          {
            data: data?.map(item => item.lineData),
            color: (opacity = 1) => `rgba(244, 65, 134, ${opacity})`,
            strokeWidth: 2,
          },
        ],
        legend: ['Height vs Time²'],
      };
  return (
    <View>

            <LineChart
              data={graphData1}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
              />
               <LineChart
              data={graphData2}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />

    </View>
    )
}

export default CombinedChart;