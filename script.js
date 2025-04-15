document.getElementById("generate-btn").addEventListener("click", async () => {
    const prompt = document.getElementById("prompt").value;
    const output = document.getElementById("story-text");
    const tamilOutput = document.getElementById("tamil-story-text");
    const loadingIndicator = document.getElementById("loading");

    if (!prompt) {
        alert("Please enter a prompt!");
        return;
    }

    output.textContent = "";
    tamilOutput.textContent = "";
    loadingIndicator.textContent = "Generating story... Please wait...";

    try {
        const response = await fetch("http://127.0.0.1:5001/generate-story", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });

        const data = await response.json();
        loadingIndicator.textContent = "";

        document.getElementById("output").style.display = "block";
        document.getElementById("tamil-output").style.display = "block";

        output.textContent = data.english_story || "No English story generated.";
        tamilOutput.textContent = data.tamil_story || "No Tamil translation available.";

        document.getElementById("generate-audio-btn").style.display = "block";
    } catch (error) {
        loadingIndicator.textContent = "Error generating story. Please try again.";
    }
});

document.getElementById("generate-audio-btn").addEventListener("click", async () => {
    const tamilStory = document.getElementById("tamil-story-text").textContent;
    const audioPlayer = document.getElementById("audio-player");

    try {
        const response = await fetch("http://127.0.0.1:5001/generate-audio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: tamilStory }),
        });

        const data = await response.json();
        if (data.audio_url) {
            audioPlayer.src = data.audio_url;
            audioPlayer.style.display = "block";
            audioPlayer.play();
        }
    } catch (error) {
        alert("Error generating audio!");
    }
});
