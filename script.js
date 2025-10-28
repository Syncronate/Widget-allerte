document.addEventListener('DOMContentLoaded', function() {
    // --- CONFIGURAZIONE ---
    const googleSheetCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQRYZz5cm8M6XWpz9aFh62Pw-2q-7pIpViKFV_Zv4qlJMWYTQwg2zMW9L1U_s3QfPdrQtNPvmD8cBUx/pub?gid=62264278&single=true&output=csv";
    const eventiDaMostrare = ['vento', 'mareggiate', 'neve'];

    const mappaColori = {
        "Rossa": "red",
        "Arancione": "orange",
        "Gialla": "yellow",
        "Verde": "green",
        "Nessuna": "green",
        "Bianca": "white"
    };

    // *** INIZIO SEZIONE MODIFICATA ***
    // Ho cambiato le estensioni dei file da .png a .svg
    const eventiInfo = {
        'idrogeologica': { testo: 'IDRO-GEOLOGICO', icona: 'idrogeologico.svg' },
        'idraulica': { testo: 'IDRAULICO', icona: 'idraulico.svg' },
        'temporali': { testo: 'TEMPORALI', icona: 'temporali.svg' },
        'vento': { testo: 'VENTO', icona: 'vento.svg' },
        'neve': { testo: 'NEVE', icona: 'neve.svg' },
        'mareggiate': { testo: 'MAREGGIATE', icona: 'mareggiate.svg' }
    };
    // *** FINE SEZIONE MODIFICATA ***

    async function caricaEVisualizzaAllerte() {
        try {
            const response = await fetch(googleSheetCsvUrl + '&_cacheBuster=' + new Date().getTime());
            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }
            const datiCsv = await response.text();
            
            const righe = datiCsv.trim().split('\n');
            const header = righe[0].split(','); 
            const valori = righe[1].split(',');

            const allerte = {};
            header.forEach((titolo, index) => {
                const titoloPulito = titolo.trim().toLowerCase();
                allerte[titoloPulito] = valori[index].trim();
            });

            const container = document.getElementById('container');
            container.innerHTML = ''; 

            eventiDaMostrare.forEach(evento => {
                const coloreItaliano = allerte[evento] || "Nessuna";
                const colore = mappaColori[coloreItaliano] || "green";
                const info = eventiInfo[evento];
                const testoPrimario = (colore === 'green' || colore === 'white') ? 'NO ALLARME' : 'ALLARME';
                const testoSecondario = info.testo;

                const divEvento = document.createElement('div');
                divEvento.className = 'evento'; 
                
                // *** NOTA AGGIUNTIVA ***
                // Assicurati che le icone si trovino in una cartella chiamata 'immagini'
                // Se sono nella stessa cartella dell'HTML, togli "immagini/" da qui sotto.
                divEvento.innerHTML = `
                    <div class="icona-container ${colore}">
                        <img src="immagini/${info.icona}" class="icona" alt="Icona ${testoSecondario}">
                    </div>
                    <div class="testo">
                        <span class="testo-primario ${colore}-text">${testoPrimario}</span>
                        <span class="testo-secondario">${testoSecondario}</span>
                    </div>
                `;
                
                container.appendChild(divEvento);
            });

        } catch (error) {
            console.error("Errore nel caricamento dei dati dal Google Sheet:", error);
            document.getElementById('container').innerHTML = '<div class="loading red">Errore nel caricamento dati.</div>';
        }
    }

    caricaEVisualizzaAllerte();
    setInterval(caricaEVisualizzaAllerte, 60000); // Aggiorna ogni 15 minuti
});
