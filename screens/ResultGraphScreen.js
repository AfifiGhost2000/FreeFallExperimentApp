import React, { useState, useRef } from 'react';
import { View, Dimensions, Alert, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';



const screenWidth = Dimensions.get('window').width;

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const formatScientific = (number) => {
  if (number === 0) return '0';
  const exponent = Math.floor(Math.log10(Math.abs(number)));
  const mantissa = formatNumber((number / Math.pow(10, exponent)));
  return `${mantissa}e${exponent}`;
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

const calculateAcceleration = (data) => {
  if (data.length < 2) return 0;

  const gradients = [];
  for (let i = 1; i < data.length; i++) {
    const dy = data[i].height - data[i - 1].height;
    const dx = data[i].time - data[i - 1].time;
    gradients.push(dy / dx);
  }

  const secondGradients = [];
  for (let i = 1; i < gradients.length; i++) {
    const dGradient = gradients[i] - gradients[i - 1];
    const dt = data[i + 1].time - data[i].time;
    secondGradients.push(dGradient / dt);
  }

  const averageAcceleration = secondGradients.reduce((a, b) => a + b, 0) / secondGradients.length;
  return averageAcceleration;
};

const calculateAccelerationGraph2 = (data) => {
  if (data.length < 2) return 0;

  const gradients = [];
  for (let i = 1; i < data.length; i++) {
    const dy = data[i].height - data[i - 1].height;
    const dx = (data[i].time ** 2) - (data[i - 1].time ** 2);
    gradients.push(dy / dx);
  }

  const averageAcceleration = gradients.reduce((a, b) => a + b, 0) / gradients.length;
  return averageAcceleration * 2; // multiply by 2 to get acceleration
};

const generateDataObject = (size) => {
  let timeValue = 0;
  let heightValue = 0;


  const dataArray = Array.from({ length: size  }, (_, index) => {
    const obj = {
      time: timeValue ,
      height: heightValue
    };
    timeValue += 1;
    heightValue += 1;
    return obj;
  });

  return dataArray;
};




const ResultGraphScreen = ({ route }) => {
  const { data } = route.params ?? {};
  const chartRef1 = useRef();
  const chartRef2 = useRef();

  
  
  
 
  const graphData1 = {
    labels: data?.map(item => formatNumber(item.time)),
    datasets: [
      {
        data: data?.map(item => item.height),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Height vs Time'],
  };



  const labels1 = data?.map(item => formatNumber(item.time));
  // const labels2 = data?.filter(item => item.time ** 2 !== 0).map(item => formatNumber(item.time ** 2));
  const labels2 = data?.map(item => formatNumber(item.time ** 2));
     // Create an array of indices from 0 to the length of labels1
     const indicesArr = Array.from({ length: labels1.length }, (_, index) => index);
    const duplicatedDataObj = generateDataObject(labels1.length);
    const duplicatedDataArray = duplicatedDataObj?.map(item => formatNumber(item.time))

  const combinedLabels = [...labels1, ...labels2];

 
  
  const getHeightForLabel = (label) => {
    const dataItem = data.find(item => formatNumber(item.time) === label || formatNumber(item.time ** 2) === label);
    return dataItem ? dataItem.height : 0;
  };

  const heights = labels2.map(label => getHeightForLabel(label));

  

  const graphData2 = {
    labels: labels2,
    datasets: [
      {
        data: heights,
        color: (opacity = 1) => `rgba(244, 65, 134, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Height vs Time²'],
  };

  const acceleration1 = calculateAcceleration(data);
  const acceleration2 = calculateAccelerationGraph2(data);

  return (
    <View style={styles.container}>
      {data && data.length > 0 ? (
        <>
          <View ref={chartRef1}>
            <LineChart
              data={graphData1}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              segments={data.length - 1} // To get proper spacing between data points
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
              
                
             
            />
            <Text style={styles.accelerationText}>Acceleration: {formatScientific(acceleration1 || 0)} m/s²</Text>
          </View>

          <View ref={chartRef2}>
            <LineChart
              data={graphData2}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
             
              bezier
              
              segments={combinedLabels.length - 1}
              
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
            <Text style={styles.accelerationText}>Acceleration: {formatScientific(acceleration2 || 0)} m/s²</Text>
          </View>
        
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No data available!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  noDataContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 30,
    padding: 20,
    marginTop: 0.5 * screenWidth,
  },
  noDataText: {
    fontSize: 18,
    color: '#D0342C',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  accelerationText: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
    textAlign: 'center',
  },
  yAxisLabel: {
    position: 'absolute',
    left: 10,
    top: 100,
    transform: [{ rotate: '-90deg' }],
    fontSize: 12,
    color: 'grey',
  },
  xAxisLabel: {
    alignSelf: 'center',
    marginTop: 8,
    fontSize: 12,
    color: 'grey',
  },
});

export default ResultGraphScreen;
