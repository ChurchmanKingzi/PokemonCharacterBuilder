// typMeisterschaft.js - Implementierung der Typ-Meisterschaften Sektion

document.addEventListener('DOMContentLoaded', function() {
    // Liste aller Pokémon-Typen
    const pokemonTypes = [
        { id: 'normal', name: 'Normal', icon: '⚪' },
        { id: 'feuer', name: 'Feuer', icon: '🔥' },
        { id: 'wasser', name: 'Wasser', icon: '💧' },
        { id: 'pflanze', name: 'Pflanze', icon: '🌿' },
        { id: 'elektro', name: 'Elektro', icon: '⚡' },
        { id: 'eis', name: 'Eis', icon: '❄️' },
        { id: 'kampf', name: 'Kampf', icon: '👊' },
        { id: 'gift', name: 'Gift', icon: '☠️' },
        { id: 'boden', name: 'Boden', icon: '🌍' },
        { id: 'flug', name: 'Flug', icon: '🦅' },
        { id: 'psycho', name: 'Psycho', icon: '🧠' },
        { id: 'kaefer', name: 'Käfer', icon: '🐛' },
        { id: 'gestein', name: 'Gestein', icon: '🪨' },
        { id: 'geist', name: 'Geist', icon: '👻' },
        { id: 'drache', name: 'Drache', icon: '🐉' },
        { id: 'unlicht', name: 'Unlicht', icon: '🌑' },
        { id: 'stahl', name: 'Stahl', icon: '⚙️' },
        { id: 'fee', name: 'Fee', icon: '🧚' }
    ];

    // DOM-Element für den Container erstellen, der die Sektion enthält
    const container = document.querySelector('.container');
    
    // Erstelle die Typ-Meisterschaften Sektion
    createTypeMasterySection();
    
    // Funktion zum Erstellen der Typ-Meisterschaften Sektion
    function createTypeMasterySection() {
        // Hauptsektion erstellen
        const typeMasterySection = document.createElement('div');
        typeMasterySection.className = 'type-mastery-section';
        typeMasterySection.style.marginTop = '40px';
        typeMasterySection.style.borderTop = '1px solid #eee';
        typeMasterySection.style.paddingTop = '20px';
        
        // Header-Bereich mit Überschrift und Lieblingstyp-Auswahl
        const headerContainer = document.createElement('div');
        headerContainer.style.display = 'flex';
        headerContainer.style.justifyContent = 'space-between';
        headerContainer.style.alignItems = 'center';
        headerContainer.style.marginBottom = '20px';
        
        // Hauptüberschrift
        const heading = document.createElement('h2');
        heading.textContent = 'Typ-Meisterschaften';
        heading.style.margin = '0';
        
        // Lieblingstyp-Container
        const favoriteTypeContainer = document.createElement('div');
        favoriteTypeContainer.style.display = 'flex';
        favoriteTypeContainer.style.alignItems = 'center';
        favoriteTypeContainer.style.gap = '10px';
        
        // Lieblingstyp-Überschrift
        const favoriteTypeHeading = document.createElement('h3');
        favoriteTypeHeading.textContent = 'Lieblingstyp:';
        favoriteTypeHeading.style.margin = '0';
        favoriteTypeHeading.style.fontSize = '16px';
        
        // Lieblingstyp-Dropdown
        const favoriteTypeSelect = document.createElement('select');
        favoriteTypeSelect.id = 'favorite-type';
        favoriteTypeSelect.style.padding = '5px';
        favoriteTypeSelect.style.borderRadius = '4px';
        favoriteTypeSelect.style.border = '1px solid #ccc';
        
        // Optionen zum Dropdown hinzufügen
        pokemonTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.textContent = `${type.icon} ${type.name}`;
            favoriteTypeSelect.appendChild(option);
        });
        
        // Event-Listener für Änderungen am Lieblingstyp
        favoriteTypeSelect.addEventListener('change', updateTypeMasteryValues);
        
        // DOM-Struktur für den Header zusammensetzen
        favoriteTypeContainer.appendChild(favoriteTypeHeading);
        favoriteTypeContainer.appendChild(favoriteTypeSelect);
        
        headerContainer.appendChild(heading);
        headerContainer.appendChild(favoriteTypeContainer);
        
        typeMasterySection.appendChild(headerContainer);
        
        // Grid-Container für die Typ-Karten
        const typeGridContainer = document.createElement('div');
        typeGridContainer.className = 'type-grid';
        typeGridContainer.style.display = 'grid';
        typeGridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
        typeGridContainer.style.gap = '15px';
        
        // Typ-Karten erstellen
        pokemonTypes.forEach(type => {
            const typeCard = createTypeCard(type);
            typeGridContainer.appendChild(typeCard);
        });
        
        typeMasterySection.appendChild(typeGridContainer);
        
        // Finde die richtige Position zum Einfügen der Sektion
        // Zuerst nach der Attacken-Sektion suchen
        const attackenSection = document.querySelector('.attacken-section');
        
        if (attackenSection) {
            // Element nach der Attacken-Sektion einfügen
            if (attackenSection.nextSibling) {
                container.insertBefore(typeMasterySection, attackenSection.nextSibling);
            } else {
                container.appendChild(typeMasterySection);
            }
        } else {
            // Fallback: Am Ende des Containers einfügen
            container.appendChild(typeMasterySection);
        }
        
        // Initial die Werte aktualisieren
        updateTypeMasteryValues();
    }
    
    // Funktion zum Erstellen einer Typ-Karte
    function createTypeCard(type) {
        const card = document.createElement('div');
        card.className = `type-card ${type.id}-type`;
        card.dataset.typeId = type.id;
        card.style.padding = '10px';
        card.style.backgroundColor = '#f8f8f8';
        card.style.borderRadius = '8px';
        card.style.border = '1px solid #ddd';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'center';
        
        // Typ-Icon und Name
        const typeHeader = document.createElement('div');
        typeHeader.style.display = 'flex';
        typeHeader.style.alignItems = 'center';
        typeHeader.style.gap = '5px';
        typeHeader.style.marginBottom = '10px';
        
        const typeIcon = document.createElement('span');
        typeIcon.textContent = type.icon;
        typeIcon.style.fontSize = '20px';
        
        const typeName = document.createElement('span');
        typeName.textContent = type.name;
        typeName.style.fontWeight = 'bold';
        
        typeHeader.appendChild(typeIcon);
        typeHeader.appendChild(typeName);
        
        // Wert-Input (nicht editierbar)
        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.className = 'type-mastery-value';
        valueInput.id = `${type.id}-mastery`;
        valueInput.value = '5';
        valueInput.readOnly = true;
        valueInput.style.width = '40px';
        valueInput.style.textAlign = 'center';
        valueInput.style.padding = '5px';
        valueInput.style.border = '1px solid #ccc';
        valueInput.style.borderRadius = '4px';
        valueInput.style.backgroundColor = '#f0f0f0';
        
        // DOM-Struktur zusammensetzen
        card.appendChild(typeHeader);
        card.appendChild(valueInput);
        
        return card;
    }
    
    // Funktion zum Aktualisieren der Meisterschafts-Werte basierend auf dem Lieblingstyp
    function updateTypeMasteryValues() {
        const favoriteTypeId = document.getElementById('favorite-type').value;
        
        // Alle Typ-Inputs auf 5 zurücksetzen
        document.querySelectorAll('.type-mastery-value').forEach(input => {
            input.value = '5';
            input.style.fontWeight = 'normal';
            input.style.color = '#000';
            input.parentElement.style.backgroundColor = '#f8f8f8';
            input.parentElement.style.border = '1px solid #ddd';
        });
        
        // Lieblingstyp auf 10 setzen und hervorheben
        const favoriteInput = document.getElementById(`${favoriteTypeId}-mastery`);
        if (favoriteInput) {
            favoriteInput.value = '10';
            favoriteInput.style.fontWeight = 'bold';
            favoriteInput.style.color = '#0066cc';
            favoriteInput.parentElement.style.backgroundColor = '#e6f2ff';
            favoriteInput.parentElement.style.border = '2px solid #66a3ff';
        }
    }
});
