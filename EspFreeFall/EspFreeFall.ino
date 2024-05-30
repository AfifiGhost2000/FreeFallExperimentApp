#include <WiFi.h>
#include <HTTPClient.h>

// Replace with your actual WiFi credentials and server address
const char* ssid = "OPPO Anas";
const char* password = "00000000";
const char* serverName = "http://192.168.66.26:3000/sendtime";

// Define the pin numbers
const int Buzzer = 5;   // Buzzer Pin
const int FirLED = 19;  // First IR sensor LED
const int LirLED = 23;  // Last IR sensor LED
const int FirPin = 18;  // First IR sensor pin to start timer
const int LirPin = 4;   // Last IR sensor pin to stop timer

// Define the variables for the interrupt routine
volatile unsigned long startTime = 0;
volatile unsigned long endTime = 0;
volatile bool isTiming = false;

// This function is called when the first IR sensor goes LOW
void IRAM_ATTR isrStart() {
  if (!isTiming) {
    startTime = millis();
    isTiming = true;
    digitalWrite(FirLED, HIGH);
  }
}

// This function is called when the last IR sensor goes LOW
void IRAM_ATTR isrEnd() {
  if (isTiming) {
    endTime = millis();
    isTiming = false;
    digitalWrite(LirLED, HIGH);
  }
}

float readSensorTime() {
  float timeInSeconds = 0.0;
  if (!isTiming && startTime != 0 && endTime != 0) {
    unsigned long elapsedTime = endTime - startTime;
    timeInSeconds = elapsedTime / 1000.0; // Convert milliseconds to seconds

    // Print results to serial monitor
    digitalWrite(LirLED, HIGH);
    Serial.print("Time in Seconds: ");
    Serial.print(timeInSeconds);
    Serial.println(" s");
    digitalWrite(Buzzer, HIGH);
    delay(1000);
    digitalWrite(Buzzer, LOW);

    // Reset variables for next measurement
    startTime = 0;
    endTime = 0;
    digitalWrite(FirLED, LOW);
    digitalWrite(LirLED, LOW);
  }

  return timeInSeconds;
}

// Handler for the /time endpoint
void handleTimeRequest(float time) {
  if (WiFi.status() == WL_CONNECTED) {
  
    HTTPClient http;

    http.begin(serverName);

    if (time > 0) { // Only send if there's valid time data
      // Measurement complete, send time
      http.addHeader("Content-Type", "application/json");
      String jsonResponse = "{\"time\":";
      jsonResponse += time;
      jsonResponse += "}";
      int httpResponseCode = http.POST(jsonResponse);
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      http.end();
    } else {
      // Measurement not yet complete or hasn't started
      Serial.println("No valid data to send.");
    }
  }
}

void setup() {
  // Start the serial communication
  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Print the IP address
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Set pin modes
  pinMode(Buzzer, OUTPUT);
  pinMode(FirLED, OUTPUT);
  pinMode(LirLED, OUTPUT);
  pinMode(FirPin, INPUT);
  pinMode(LirPin, INPUT);

  // Attach the interrupt routines to the IR sensor pins
  attachInterrupt(digitalPinToInterrupt(FirPin), isrStart, FALLING);
  attachInterrupt(digitalPinToInterrupt(LirPin), isrEnd, FALLING);
}

void loop() {
  // Check if timing has completed and read the sensor time
  float time = readSensorTime();
  if (time > 0) { // Only handle time request if valid time is measured
    handleTimeRequest(time);
  }
}
