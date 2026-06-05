const input = document.querySelector("input");
const form = document.querySelector(".search-form");
const dictionary = document.querySelector(".dictionary-app");

async function dictionaryFn(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.title === "No Definitions Found") {
        throw new Error("Word not found");
    }

    return data[0];
}

async function fetchAndCreateCard() {
    try {

        const word = input.value.trim();

        if (!word) return;

        dictionary.innerHTML = "<p>Loading...</p>";

        const data = await dictionaryFn(word);

        const partOfSpeechArray = data.meanings.map(
            meaning => meaning.partOfSpeech
        );

        const definition =
            data.meanings[0]?.definitions[0]?.definition ||
            "No definition available";

        const example =
            data.meanings[0]?.definitions[0]?.example ||
            "No example available";

        const phonetic =
            data.phonetic ||
            data.phonetics[0]?.text ||
            "N/A";

        const audio =
            data.phonetics.find(item => item.audio)?.audio || "";

        dictionary.innerHTML = `
            <div class="card">

                <div class="property">
                    <span>Word</span>
                    <span>${data.word}</span>
                </div>

                <div class="property">
                    <span>Phonetic</span>
                    <span>${phonetic}</span>
                </div>

                <div class="property">
                    <span>Parts of Speech</span>
                    <span>${partOfSpeechArray.join(", ")}</span>
                </div>

                <div class="property">
                    <span>Definition</span>
                    <span>${definition}</span>
                </div>

                <div class="property">
                    <span>Example</span>
                    <span>${example}</span>
                </div>

                ${
                    audio
                        ? `
                    <div class="property">
                        <span>Pronunciation</span>
                        <audio controls>
                            <source src="${audio}" type="audio/mpeg">
                        </audio>
                    </div>
                `
                        : ""
                }

            </div>
        `;

    } catch (error) {

        dictionary.innerHTML = `
            <div class="card">
                <h3 class="error">Word not found!</h3>
            </div>
        `;

        console.error(error);
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchAndCreateCard();
});