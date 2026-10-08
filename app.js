const statusElement =
    document.getElementById("status");

const connectionText =
    document.getElementById("connectionText");

const note =
    document.getElementById("note");

const saveNote =
    document.getElementById("saveNote");

const clearNote =
    document.getElementById("clearNote");


function updateConnectionStatus() {

    if (navigator.onLine) {

        statusElement.textContent =
            "🟢 Online";

        connectionText.textContent =
            "You are currently online.";

    } else {

        statusElement.textContent =
            "🔴 Offline";

        connectionText.textContent =
            "You are offline. The cached website is still available.";
    }
}


window.addEventListener(
    "online",
    updateConnectionStatus
);

window.addEventListener(
    "offline",
    updateConnectionStatus
);


saveNote.addEventListener(
    "click",
    () => {

        localStorage.setItem(
            "offlineNote",
            note.value
        );

        alert(
            "Note saved on this device."
        );
    }
);


clearNote.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "offlineNote"
        );

        note.value = "";
    }
);


const savedNote =
    localStorage.getItem(
        "offlineNote"
    );

if (savedNote) {

    note.value = savedNote;
}


updateConnectionStatus();


if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        async () => {

            try {

                await navigator.serviceWorker.register(
                    "sw.js"
                );

                console.log(
                    "Service Worker registered."
                );

            } catch (error) {

                console.error(
                    "Service Worker registration failed:",
                    error
                );
            }
        }
    );
}