document.addEventListener('DOMContentLoaded', function() {
    // --- CONFIGURAZIONE ---
    const googleSheetCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQRYZz5cm8M6XWpz9aFh62Pw-2q-7pIpViKFV_Zv4qlJMWYTQwg2zMW9L1U_s3QfPdrQtNPvmD8cBUx/pub?gid=62264278&single=true&output=csv";
    
    // Mostra queste 3 allerte in questo ordine
    const eventiDaMostrare = ['vento', 'mareggiate', 'neve'];

    const mappaColori = {
        "Rossa": "red", "Arancione": "orange", "Gialla": "yellow",
        "Verde": "green", "Nessuna": "green", "Bianca": "white"
    };

    // Il percorso corretto "immagini/nomefile.svg" è definito qui
    const eventiInfo = {
        'idrogeologica': { testo: 'RISCHIO IDROGEOLOGICO', dettaglio: 'FRANE VALANGHE', icona: 'immagini/idrogeologico.svg' },
        'idraulica':     { testo: 'RISCHIO IDRAULICO', dettaglio: 'ALLAGAMENTI', icona: 'immagini/idraulico.svg' },
        'temporali':     { testo: 'RISCHIO TEMPORALI', dettaglio: 'FULMINI GRANDINE', icona: 'immagini/temporali.svg' },
        'vento':         { testo: 'RISCHIO VENTO', dettaglio: 'RAFFICHE FORTI', icona: 'immagini/vento.svg' },
        'neve':          { testo: 'RISCHIO NEVE', dettaglio: 'ACCUMULI ABBONDANTI', icona: 'immagini/neve.svg' },
        'mareggiate':    { testo: 'RISCHIO MAREGGIATE', dettaglio: 'ONDE PERICOLOSE', icona: 'immagini/mareggiate.svg' }
    };

    // --- FUNZIONE OROLOGIO ---
    function aggiornaOrologio() {
        const now = new Date();
        const mesi = ["GEN", "FEB", "MAR", "APR", "MAG", "GIU", "LUG", "AGO", "SET", "OTT", "NOV", "DIC"];
        
        const dataStr = `${now.getDate()} ${mesi[now.getMonth()]}`;
        const oraStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        // Assicurati che nel tuo HTML ci siano <span id="data"> e <span id="ora">
        const dataElement = document.getElementById('data');
        const oraElement = document.getElementById('ora');
        if (dataElement) dataElement.textContent = dataStr;
        if (oraElement) oraElement.textContent = oraStr;
    }

    // --- FUNZIONE PRINCIPALE PER LE ALLERTE ---
    async function caricaEVisualizzaAllerte() {
        try {
            const response = await fetch(googleSheetCsvUrl + '&_cacheBuster=' + new Date().getTime());
            if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
            const datiCsv = await response.text();
            
            const righe = datiCsv.trim().split('\n');
            const header = righe[0].split(','); 
            const valori = righe[1].split(',');

            const allerte = {};
            header.forEach((titolo, i) => allerte[titolo.trim().toLowerCase()] = valori[i].trim());

            const container = document.getElementById('container');
            container.innerHTML = ''; 

            eventiDaMostrare.forEach(evento => {
                const coloreItaliano = allerte[evento] || "Nessuna";
                const colore = mappaColori[coloreItaliano] || "green";
                const info = eventiInfo[evento];
                
                const testoPrimario = (colore === 'green' || colore === 'white') ? 'NO ALLARME' : 'ALLARME';
                const testoSecondario = info.testo;
                const testoTerziario = info.dettaglio;

                const divEvento = document.createElement('div');
                divEvento.className = 'evento'; 
                
                // *** CORREZIONE APPLICATA QUI ***
                // Il tag img ora usa solo "${info.icona}", che contiene già il percorso completo.
                divEvento.innerHTML = `
                    <div class="icona-container ${colore}">
                        <img src="${info.icona}" class="icona" alt="">
                    </div>
                    <div class="testo">
                        <span class="testo-primario ${colore}-text">${testoPrimario}</span>
                        <span class="testo-secondario">${testoSecondario}</span>
                        <span class="testo-terziario">${testoTerziario}</span>
                    </div>
                `;
                container.appendChild(divEvento);
            });

        } catch (error) {
            console.error("Errore nel caricamento dei dati:", error);
            document.getElementById('container').innerHTML = '<div class="loading red">Errore caricamento.</div>';
        }
    }

    // --- ESECUZIONE ---
    aggiornaOrologio(); // Esegui l'orologio subito
    setInterval(aggiornaOrologio, 60000); // Aggiorna l'orologio ogni minuto (60 * 1000 ms)

    caricaEVisualizzaAllerte(); // Esegui le allerte subito
    setInterval(caricaEVisualizzaAllerte, 900000); // Aggiorna le allerte ogni 15 minuti (15 * 60 * 1000 ms)
});
