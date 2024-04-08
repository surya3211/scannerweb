document.getElementById('scanButton').addEventListener('click', async function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (file) {
        try {
            const reader = new FileReader();
            reader.onload = async function() {
                try {
                    const imageData = reader.result.split(',')[1];
                    const apiKey = 'YOUR_API_KEY'; // Replace with your actual OCR.Space API key
                    const response = await fetch('https://api.ocr.space/parse/image', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: `apikey=${encodeURIComponent(apiKey)}&base64image=${encodeURIComponent(imageData)}`
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.ParsedResults && data.ParsedResults.length > 0) {
                            const parsedText = data.ParsedResults[0].ParsedText;
                            const toxicIngredientsList = ["arsenic", "lead", "mercury", "cyanide", "arsenic", /* Add more toxic ingredients here */];
                            let toxicIngredientsFound = false;
                            toxicIngredientsList.forEach(toxicIngredient => {
                                if (parsedText.toLowerCase().includes(toxicIngredient.toLowerCase())) {
                                    toxicIngredientsFound = true;
                                }
                            });
                            if (toxicIngredientsFound) {
                                document.getElementById('result').innerText = "Toxic ingredients are present.";
                            } else {
                                document.getElementById('result').innerText = "No toxic ingredients found.";
                            }
                        } else {
                            throw new Error('No text detected in the image.');
                        }
                    } else {
                        if (response.status === 403) {
                            throw new Error('API key is not authorized to access the OCR.Space API.');
                        } else {
                            const errorData = await response.json();
                            throw new Error(`Error: ${errorData.ErrorMessage}`);
                        }
                    }
                } catch (error) {
                    console.error('Error during OCR:', error);
                    document.getElementById('result').innerText = "No Toxic Ingredients found.";
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error during file reading:', error);
            document.getElementById('result').innerText = "Error during file reading. Please try again.";
        }
    } else {
        alert('Please select an image file.');
    }
});
