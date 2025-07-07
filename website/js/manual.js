const slider = document.getElementById("speedSlider");
const targetSpeedValue = document.getElementById("targetSpeedValue");
const speedInput = document.getElementById("speedInput");
const applySpeedButton = document.getElementById("apply-speed")
const speedValue = document.getElementById("speedValue")

slider.addEventListener("input", () => {
  const value = slider.value;
  targetSpeedValue.textContent = value;
});

applySpeedButton.onclick =  () => {
  console.log("POST")
  const url = '/'; // Replace with your API endpoint
  const data = {
    command: 'set_wind_speed',
    wind_speed: parseFloat(slider.value)
  };
  
  fetch(url, {
    method: 'POST', // Specify the HTTP method as POST
    headers: {
      'Content-Type': 'application/json' // Indicate that the body is JSON
    },
    body: JSON.stringify(data) // Convert the JavaScript object to a JSON string
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Parse the JSON response
  })
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
};
