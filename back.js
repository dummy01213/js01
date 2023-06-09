OPENAI_API_KEY = "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"

var heading = document.getElementById("heading")
heading.href = "/"
var txtMsg = document.getElementById("txtMsg")
var txtOutput = document.getElementById("txtOutput")
var options = document.getElementById("options")
txtOutput.style.display = "None"

function useGpt(title, waitingMessage, instruction) {
    // https://www.codeproject.com/Articles/5350454/Chat-GPT-in-JavaScript

    options.style.display = "none"
    var userInput = txtMsg.value
    if (userInput == "") {
        alert("write something")
        return
    }
    txtOutput.style.display = "inline-block"
    txtOutput.value = waitingMessage
    var sUrl = "https://api.openai.com/v1/completions";
    var sModel = "text-davinci-003";
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", sUrl);

    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + OPENAI_API_KEY)

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            var oJson = { "error": "custom error" }
            try {
                oJson = JSON.parse(xhttp.responseText)
            } catch (error) {
                txtOutput.value = error.message
                console.log(error)
            }
            if (!oJson.error) {
                console.log(oJson);
                s = oJson.choices[0]["text"];
                res = s.split("\n\n");
                txtOutput.value = title + "\n\n" + s.slice(s.indexOf("\n\n") + 2)
            }
        }
    }

    var iMaxTokens = 2048;
    var sUserId = "1";
    var dTemperature = 0.5;

    var data = {
        model: sModel,
        prompt: instruction + "\n\n" + userInput,
        max_tokens: iMaxTokens,
        user: sUserId,
        temperature: dTemperature,
        frequency_penalty: 0.0, //Number between -2.0 and 2.0  
        //Positive value decrease the model's likelihood 
        //to repeat the same line verbatim.
        presence_penalty: 0.0, //Number between -2.0 and 2.0. 
        //Positive values increase the model's likelihood 
        //to talk about new topics.
        stop: ["#", ";"] //Up to 4 sequences where the API will stop generating 
            //further tokens. The returned text will not contain 
            //the stop sequence.
    }
    xhttp.send(JSON.stringify(data))
}

const summarizeButton = document.getElementById("summarize-icon")
const notesButton = document.getElementById("notes-icon")
const grammar = document.getElementById("grammar-icon")

notesButton.onclick = function() { useGpt("[Generated notes]", "Making notes for you...", "Study this paragraph and make notes for me") }
grammar.onclick = function() { useGpt("[Fixed the grammar]", "Fixing the mistakes...", "Correct this to standard English:") }
summarizeButton.onclick = function() { useGpt("[Summarized result]", "Summarizing...", "Can you please summarize this:") }