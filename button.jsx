// Create the button element
const button = document.createElement('button');
button.textContent = 'Click Me';

// Style the button
button.style.backgroundColor = 'blue';
button.style.color = 'white';
button.style.padding = '10px 20px';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';

// Add functionality
button.addEventListener('click', () => {
  console.log('Button clicked!');
  // Add your desired action here
});

// Append the button to the DOM
document.body.appendChild(button);

fetch('https://api.weather.gov/gridpoints/BOX/69,92/forecast')
        .then(response => response.json())
        .then(data => console.log(data));