document.addEventListener('DOMContentLoaded', () => {
    const zielHinzufuegenButton = document.getElementById('ziel-hinzufuegen-button');
    const neuesZielInput = document.getElementById('neues-ziel-input');
    const zieleListe = document.getElementById('ziele');
    const belohnungsListe = document.getElementById('belohnungs-liste');
    const belohnungHinzufuegenButton = document.getElementById('belohnung-hinzufuegen-button');
    const neueBelohnungInput = document.getElementById('neue-belohnung-input');
    const textRasierenAnzeige = document.getElementById('text-rasieren-anzeige');

    let ziele = JSON.parse(localStorage.getItem('ziele')) || [];
    let belohnungen = JSON.parse(localStorage.getItem('belohnungen')) || [];
    const vollstaendigerText = "Dieser Text wird durch deine Fortschritte rasiert!";

    function renderZiele() {
        zieleListe.innerHTML = '';
        ziele.forEach((ziel, zielIndex) => {
            const zielDiv = document.createElement('div');
            zielDiv.classList.add('ziel');

            const zielHeader = document.createElement('h3');
            zielHeader.textContent = ziel.name;
            zielDiv.appendChild(zielHeader);

            const aufgabenListe = document.createElement('ul');
            ziel.aufgaben.forEach((aufgabe, aufgabeIndex) => {
                const aufgabenItem = document.createElement('li');

                const aufgabeSpan = document.createElement('span');
                aufgabeSpan.textContent = aufgabe.name;
                aufgabenItem.appendChild(aufgabeSpan);

                const erledigenButton = document.createElement('button');
                erledigenButton.textContent = aufgabe.erledigt ? 'Wiederholen' : 'Erledigen';
                erledigenButton.classList.add('aufgabe-erledigen');
                erledigenButton.addEventListener('click', () => {
                    ziele[zielIndex].aufgaben[aufgabeIndex].erledigt = !ziele[zielIndex].aufgaben[aufgabeIndex].erledigt;
                    speichereDaten();
                    renderZiele();
                    updateTextRasieren();
                });
                aufgabenItem.appendChild(erledigenButton);

                const loeschenButton = document.createElement('button');
                loeschenButton.textContent = 'Löschen';
                loeschenButton.classList.add('aufgabe-loeschen');
                loeschenButton.addEventListener('click', () => {
                    ziele[zielIndex].aufgaben.splice(aufgabeIndex, 1);
                    speichereDaten();
                    renderZiele();
                    updateTextRasieren();
                });
                aufgabenItem.appendChild(loeschenButton);

                aufgabenListe.appendChild(aufgabenItem);
            });
            zielDiv.appendChild(aufgabenListe);

            const aufgabeHinzufuegenInput = document.createElement('input');
            aufgabeHinzufuegenInput.type = 'text';
            aufgabeHinzufuegenInput.placeholder = 'Neue Aufgabe hinzufügen';
            zielDiv.appendChild(aufgabeHinzufuegenInput);

            const aufgabeHinzufuegenButton = document.createElement('button');
            aufgabeHinzufuegenButton.textContent = 'Aufgabe hinzufügen';
            aufgabeHinzufuegenButton.addEventListener('click', () => {
                if (aufgabeHinzufuegenInput.value.trim()) {
                    ziele[zielIndex].aufgaben.push({ name: aufgabeHinzufuegenInput.value.trim(), erledigt: false });
                    aufgabeHinzufuegenInput.value = '';
                    speichereDaten();
                    renderZiele();
                    updateTextRasieren();
                }
            });
            zielDiv.appendChild(aufgabeHinzufuegenButton);

            const zielLoeschenButton = document.createElement('button');
            zielLoeschenButton.textContent = 'Ziel löschen';
            zielLoeschenButton.classList.add('aufgabe-loeschen');
            zielLoeschenButton.addEventListener('click', () => {
                ziele.splice(zielIndex, 1);
                speichereDaten();
                renderZiele();
                updateTextRasieren();
            });
            zielDiv.appendChild(zielLoeschenButton);

            zieleListe.appendChild(zielDiv);
        });
    }

    function renderBelohnungen() {
        belohnungsListe.innerHTML = '';
        belohnungen.forEach((belohnung, index) => {
            const belohnungsItem = document.createElement('li');
            belohnungsItem.classList.add('belohnung-element');
            belohnungsItem.textContent = belohnung;

            const loeschenButton = document.createElement('button');
            loeschenButton.textContent = 'Löschen';
            loeschenButton.classList.add('belohnung-loeschen');
            loeschenButton.addEventListener('click', () => {
                belohnungen.splice(index, 1);
                speichereDaten();
                renderBelohnungen();
            });
            belohnungsItem.appendChild(loeschenButton);

            belohnungsListe.appendChild(belohnungsItem);
        });
    }

    function speichereDaten() {
        localStorage.setItem('ziele', JSON.stringify(ziele));
        localStorage.setItem('belohnungen', JSON.stringify(belohnungen));
    }

    function updateTextRasieren() {
        const alleAufgaben = ziele.reduce((acc, ziel) => acc.concat(ziel.aufgaben), []);
        const erledigteAufgaben = alleAufgaben.filter(aufgabe => aufgabe.erledigt).length;
        const gesamtAufgaben = alleAufgaben.length;

        if (gesamtAufgaben > 0) {
            const fortschritt = erledigteAufgaben / gesamtAufgaben;
            const textLaenge = Math.max(0, Math.floor(vollstaendigerText.length * (1 - fortschritt)));
            textRasierenAnzeige.textContent = vollstaendigerText.substring(0, textLaenge);
        } else {
            textRasierenAnzeige.textContent = vollstaendigerText;
        }
    }

    zielHinzufuegenButton.addEventListener('click', () => {
        const zielName = neuesZielInput.value.trim();
        if (zielName) {
            ziele.push({ name: zielName, aufgaben: [] });
            neuesZielInput.value = '';
            speichereDaten();
            renderZiele();
            updateTextRasieren();
        }
    });

    belohnungHinzufuegenButton.addEventListener('click', () => {
        const belohnungName = neueBelohnungInput.value.trim();
        if (belohnungName) {
            belohnungen.push(belohnungName);
            neueBelohnungInput.value = '';
            speichereDaten();
            renderBelohnungen();
        }
    });

    renderZiele();
    renderBelohnungen();
    updateTextRasieren();
});
