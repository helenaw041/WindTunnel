const slider = document.getElementById("speedSlider");
const targetSpeedValue = document.getElementById("targetSpeedValue");
const speedInput = document.getElementById("speedInput");
const applySpeedButton = document.getElementById("apply-speed")
const speedValue = document.getElementById("speedValue")

slider.addEventListener("input", () => {
  const value = slider.value;
  targetSpeedValue.textContent = value;
});

applySpeedButton.addEventListener("onclick", () => {

});
