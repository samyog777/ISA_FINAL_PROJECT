<?php
$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "weather_samyog";
 
$data = json_decode(file_get_contents("php://input")); //modify the json object into php object using json_decode
 
// Create a database connection
$conn = new mysqli($servername, $username, $password, $dbname);
 
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$city = $data->city;
$temperature = $data->data->main->temp;
$humidity = $data->data->main->humidity;
$pressure = $data->data->main->pressure;
$wind = $data->data->wind->speed;
$description = $data->data->weather[0]->description;
 
// Check if data for the same city and date already exists
$existingDataQuery = "SELECT * FROM weather_data_samyog WHERE city = '$city' AND DATE(date) = CURDATE()";
$existingDataResult = $conn->query($existingDataQuery);
// Using if else statement to find if the city is saved or not
if ($existingDataResult->num_rows > 0) {
    echo "Data for the same city and date already exists. Skipping insertion.";
} else {
    // Insert the new weather data
    $insertQuery = "INSERT INTO weather_data_samyog (city, date, temperature, humidity, pressure, wind, description)
                    VALUES ('$city', NOW(), '$temperature', '$humidity', '$pressure', '$wind', '$description')";
 
    if ($conn->query($insertQuery) === TRUE) {
        echo "Data saved successfully";
    } else {
        echo "Error: " . $insertQuery . "<br>" . $conn->error;
    }
}
// Close database 
$conn->close();
?>
