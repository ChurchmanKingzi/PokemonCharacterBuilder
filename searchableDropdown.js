// searchableDropdown.js - Erweiterung für durchsuchbare Dropdown-Menüs

document.addEventListener('DOMContentLoaded', function() {
    // Konfigurationsparameter
    const SEARCH_TIMEOUT = 1500; // Zeit in Millisekunden, wie lange Tastenanschläge gespeichert werden

    // State-Objekt für die Suche in Dropdown-Menüs
    const dropdownSearchState = {
        searchString: '',          // Aktueller Suchstring
        lastKeyTime: 0,            // Zeitstempel des letzten Tastendrucks
        activeDropdown: null,      // Aktuell aktives Dropdown
        searchTimeout: null        // Timeout-ID zum Zurücksetzen des Suchstrings
    };

    // Hilfsfunktion zum Zurücksetzen des Suchstrings nach Timeout
    function resetSearchString() {
        dropdownSearchState.searchString = '';
        dropdownSearchState.lastKeyTime = 0;
        // Timeout-ID löschen
        dropdownSearchState.searchTimeout = null;
    }

    // Funktion zum Suchen und Scrollen zu passendem Element
    function searchAndScrollToMatch(dropdown, searchText) {
        if (!dropdown || !searchText) return false;
        
        // Alle Optionen im Dropdown
        const options = dropdown.querySelectorAll('.custom-select-option');
        if (!options.length) return false;
        
        // Suche nach übereinstimmenden Optionen
        const searchTextLower = searchText.toLowerCase();
        
        for (let i = 0; i < options.length; i++) {
            const optionText = options[i].textContent.trim().toLowerCase();
            
            // Überspringe die leere Standardoption ("-- xyz auswählen --")
            if (optionText.includes('--')) continue;
            
            // Wenn der Text mit dem Suchstring beginnt
            if (optionText.startsWith(searchTextLower)) {
                // Zum Element scrollen
                options[i].scrollIntoView({ block: 'nearest' });
                
                // Optional: Hervorheben des gefundenen Elements
                options.forEach(opt => opt.classList.remove('search-highlight'));
                options[i].classList.add('search-highlight');
                
                return true;
            }
        }
        
        return false;
    }

    // Event-Handler für Tastatureingaben auf dem Dokument
    document.addEventListener('keydown', function(event) {
        // Nur fortfahren, wenn ein Dropdown geöffnet ist
        const openDropdown = document.querySelector('.custom-select-dropdown[style*="display: block"]');
        if (!openDropdown) return;
        
        // Enter-Taste drücken, um aktuelle Auswahl zu bestätigen
        if (event.key === 'Enter') {
            const highlightedOption = openDropdown.querySelector('.search-highlight') || 
                                     openDropdown.querySelector('.custom-select-option:hover');
            
            if (highlightedOption) {
                // Simuliere einen Klick auf das Element
                highlightedOption.click();
                // Prevent default Enter-Verhalten
                event.preventDefault();
                return;
            }
        }
        
        // Ignoriere Steuerungstasten, außer Enter
        if (event.key.length > 1 && event.key !== 'Enter') return;
        
        // Aktualisiere das aktive Dropdown
        dropdownSearchState.activeDropdown = openDropdown;
        
        // Überprüfe, ob ein neuer Suchvorgang begonnen werden soll oder an den bestehenden angehängt
        const currentTime = Date.now();
        if (currentTime - dropdownSearchState.lastKeyTime > SEARCH_TIMEOUT) {
            // Neuer Suchvorgang: Suchstring zurücksetzen
            dropdownSearchState.searchString = '';
        }
        
        // Aktualisiete Zeitstempel
        dropdownSearchState.lastKeyTime = currentTime;
        
        // Füge den Tastendrück zum Suchstring hinzu
        dropdownSearchState.searchString += event.key.toLowerCase();
        
        // Suche nach passenden Einträgen
        searchAndScrollToMatch(openDropdown, dropdownSearchState.searchString);
        
        // Timeout zurücksetzen, wenn bereits einer läuft
        if (dropdownSearchState.searchTimeout) {
            clearTimeout(dropdownSearchState.searchTimeout);
        }
        
        // Neuen Timeout setzen
        dropdownSearchState.searchTimeout = setTimeout(resetSearchString, SEARCH_TIMEOUT);
    });

    // CSS für Hervorhebung der gefundenen Elemente hinzufügen
    const style = document.createElement('style');
    style.textContent = `
        .search-highlight {
            background-color: #e6f7e6 !important;
            border-left: 3px solid #4CAF50 !important;
        }
    `;
    document.head.appendChild(style);

    console.log('Durchsuchbare Dropdown-Menüs wurden initialisiert');
});
