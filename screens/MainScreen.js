import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AntDesign, Ionicons } from '@expo/vector-icons';

const MainScreen = ({ navigation }) => {
    const [height, setHeight] = useState('');
    const [experiments, setExperiments] = useState([
        { time: null },
        { time: null },
        { time: null },
    ]);
    const [averageTime, setAverageTime] = useState(null);
    const [acceleration, setAcceleration] = useState('');

    const [graphData, setGraphData] = useState([{ trialno: null, time: null, timesquared: null, height: null, acceleration: null }]);

    const [trialnum, setTrialnum] = useState(1);

    const sortData = (data) => {
        return [...data].sort((a, b) => {
            const timeDifference = a.time - b.time;
            if (timeDifference !== 0) {
                return timeDifference;
            } else {
                return a.timesquared - b.timesquared;
            }
        });
    };

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

    const formatTime = (time) => {
        return time < 60 ? `${time || 0} s` : `${Math.floor(time / 60)} m ${time % 60} s`;
    };

    const handleMeasureTime = async (experimentIndex) => {
        try {
            // 1. Height Validation (same as before)
            const heightValue = parseFloat(height);
            if (!heightValue || heightValue <= 0) {
                Alert.alert('Invalid Height', 'Please enter a valid height value greater than 0.');
                return;
            }

            // 2. Fetch Time Data from ESP8266
            const timeResponse = await fetch(`http://192.168.1.179:3000/gettime`);

            if (!timeResponse.ok) {
                throw new Error('Could not fetch time data from ESP32!');
            }

            const data = await timeResponse.json();
            const measuredTime = data.time;

            // 3. Update Experiment State (same as before)
            setExperiments((prevExperiments) =>
                prevExperiments.map((exp, index) =>
                    index === experimentIndex ? { ...exp, time: formatNumber(measuredTime) } : exp
                )
            );
        } catch (error) {
            Alert.alert('Error', error.message); // Display the specific error message
        }
    };

    const calculateResult = () => {
        const totalTime = experiments.reduce((sum, exp) => sum + parseFloat(exp.time || 0), 0);
        const avgtime = totalTime / experiments.length;
        const acc = (2 * parseFloat(height) * 0.01) / Math.pow(avgtime, 2);
        setAverageTime(avgtime);
        setAcceleration(acc);
    };

    const resetForNextTrial = () => {
        setGraphData((prevGraphData) => {
            const updatedGraphData = [
                ...prevGraphData,
                {
                    trialno: trialnum,
                    time: averageTime,
                    timesquared: averageTime ** 2,
                    height: height,
                    acceleration: acceleration,
                },
            ];
            console.log(updatedGraphData); // This will log the updated state
            return updatedGraphData;
        });
        // Reset states for next trial
        setTrialnum((prevTrialnum) => prevTrialnum + 1);
        setExperiments(experiments.map(() => ({ time: null })));
        setHeight('');
        setAverageTime(null);
    };

    const visualizeResult = () => {
        navigation.navigate('ResultGraphScreen', { data: sortData(graphData) });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.HeightContainer}>
                <Text style={styles.experimentTitle}>Height: </Text>
                <TextInput
                    style={styles.input}
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                />
                <Text>cm</Text>
            </View>

            <View style={styles.experimentContainer}>
                <Text style={styles.timeTitle}>Time</Text>
                {experiments.map((experiment, index) => (
                    <View key={index} style={styles.rowContainer}>
                        <Text style={styles.experimentTitle}>Experiment {index + 1}      </Text>
                        <Text style={styles.timeText}>{formatTime(experiment.time)}</Text>
                        <TouchableOpacity style={styles.measureButton} onPress={() => handleMeasureTime(index)}>
                            <Ionicons name="stopwatch" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={visualizeResult}>
                    <Text style={styles.buttonText}>Graph</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={calculateResult}>
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={resetForNextTrial}>
                    <Text style={styles.buttonText}>Next Trial</Text>
                </TouchableOpacity>

                <Text style={styles.resultText}>
                    Avg Time: {formatTime(averageTime || 0)} {'\n'} {averageTime ? formatNumber(averageTime) : 0} s
                </Text>
                <Text style={styles.resultText}>
                    {'\n'}{'\n'}Acceleration: {formatScientific(acceleration || 0)} m/s²
                </Text>
            </View>
        </ScrollView>
    );
};

        


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#f0f0f0', 
        padding: 20,
        marginBottom: 50
      },
      rowContainer: {
        flexDirection:'row',
        alignItems: 'center',
        marginBottom: 20
      },
      HeightContainer: { 
        width: '100%',
        backgroundColor: '#99DEC0', // Matches login screen 
        flexDirection:'row',
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 20, // Add spacing between experiments
      },
      experimentContainer: { 
        width: '100%',
        backgroundColor: '#99DEC0', // Matches login screen 
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 20, // Add spacing between experiments
      },
      experimentTitle: { 
        fontSize: 20, // Slightly smaller than login title
        fontWeight: 'bold',
        marginBottom: 15,
      },
      timeTitle: {
        fontSize: 20, // Slightly smaller than login title
        fontWeight: 'bold',
        marginBottom: 15,
        marginLeft: '60%'
      },
      input: {
        width: '50%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc', 
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
      },
      measureButton: {
        backgroundColor: '#E58CAE',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15, // Adjust for desired size
        marginVertical: 10,
        marginLeft: 40,
        position: 'relative',
        width: 60, // Adjust for desired size
        height: 60,
        borderRadius: 35, // Half of width/height for a perfect circle
    },
 
      actionButton: {
        backgroundColor: '#E58CAE', // Matches login screen
        borderRadius: 5,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        position: 'relative', 
        bottom: 0, 
        padding: 10,
        marginBottom: 80,
        borderTopWidth: 1, 
        borderTopColor: '#ccc',
        
      },
      resultText: {
        fontSize: 18,
        minWidth: 40,
        textAlign: 'center',
        marginTop: 70,
        marginBottom: 10,
        position: 'absolute'
      },
      timeText: {
        maxWidth: 90, // Set a minimum width to avoid layout shift
        textAlign: 'center',
      },
  });



export default MainScreen;