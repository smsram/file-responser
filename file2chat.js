let fileType = ""; // Variable to store file type
        let fileUrl = ""; // Variable to store file URL
        let imageUrls = []; // Array to store image URLs

        // Handle PDF Upload
        document.getElementById('fileInput').addEventListener('change', async function(event) {
            const file = event.target.files[0];
            fileType = "file"; // Set fileType to "file"

            if (!file) {
                alert("Please select a PDF file.");
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('https://file.io', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('PDF upload failed');
                }

                const data = await response.json();

                if (data.success) {
                    fileUrl = data.link; // Store file URL
                    const fileResultDiv = document.getElementById('fileResult');
                    const fileLink = document.getElementById('fileLink');
                    
                    fileLink.href = data.link;
                    fileLink.textContent = data.link;

                    fileResultDiv.style.display = 'block';
                } else {
                    throw new Error(data.message || 'Unknown error occurred');
                }
            } catch (error) {
                alert("Error: " + error.message);
            }
        });

        // Handle Image Upload
        document.getElementById('imageInput').addEventListener('change', async function(event) {
            const image = event.target.files[0];
            fileType = "image"; // Set fileType to "image"

            if (!image) {
                alert("Please select an image.");
                return;
            }

            const formData = new FormData();
            formData.append('file', image);

            try {
                const response = await fetch('https://file.io', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Image upload failed');
                }

                const data = await response.json();

                if (data.success) {
                    imageUrls = [data.link]; // Store image URL in an array
                    const imageResultDiv = document.getElementById('imageResult');
                    const imageLink = document.getElementById('imageLink');
                    
                    imageLink.href = data.link;
                    imageLink.textContent = data.link;

                    imageResultDiv.style.display = 'block';
                } else {
                    throw new Error(data.message || 'Unknown error occurred');
                }
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
        
        // Submit Button Click Handler
        document.getElementById('submitButton').addEventListener('click', async function() {
    const userPrompt = document.getElementById('userPrompt').value;

    if (!userPrompt) {
        alert("Please enter a user prompt before submitting.");
        return;
    }

    if (!fileType || (!fileUrl && imageUrls.length === 0)) {
        alert("Please upload a file or image before submitting.");
        return;
    }

    // Display user prompt in the chat
    const chatMessagesDiv = document.getElementById('chat-messages');
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('chat-message', 'user-message');
    userMessageDiv.textContent = userPrompt;
    chatMessagesDiv.appendChild(userMessageDiv);

    // Prepare the payload for the request
    const payload = {
        fileType: fileType,
        userPrompt: userPrompt,
    };

    // Add imageUrls or fileUrl to payload based on fileType
    if (fileType === "image") {
        payload.imageUrls = imageUrls.filter(url => url !== "");
    } else if (fileType === "file") {
        payload.fileUrl = fileUrl.trim();
    }

    try {
        const response = await fetch('https://flask-app2-fileai.onrender.com/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // Extract the result text
        const resultText = result.result || "No response from server";

        // Display the response in the chat
        const responseMessageDiv = document.createElement('div');
        responseMessageDiv.classList.add('chat-message', 'response-message');
        responseMessageDiv.textContent = resultText;
        chatMessagesDiv.appendChild(responseMessageDiv);

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Check the console for details.');
    }
});
