// inventory.js - Skript für das Inventar-System

document.addEventListener('DOMContentLoaded', function() {
    // Konstanten
    const DEFAULT_SLOTS = 3;

    // DOM-Elemente referenzieren
    const inventoryContainer = document.getElementById('inventory-container');
    
    // Hilfsvariablen
    let itemSlots = [];
    
    // Inventar initialisieren
    initInventory();
    
    // ===== FUNKTIONEN =====
    
    // Initialisierung des Inventars
    function initInventory() {
        // Lade die Items aus dem Item-Service
        const items = itemService.getAllItems();
        
        // Erstelle die Slot-Elemente
        for (let i = 0; i < DEFAULT_SLOTS; i++) {
            createItemSlot(i, items);
        }
    }
    
    // Funktion zum Erstellen eines Item-Slots
    function createItemSlot(index, items) {
        // Slot Container erstellen
        const slotContainer = document.createElement('div');
        slotContainer.className = 'item-slot';
        
        // Select-Container (für das benutzerdefinierte Dropdown)
        const selectContainer = document.createElement('div');
        selectContainer.className = 'custom-select-container';
        
        // Erstelle das select-Element
        const selectElement = document.createElement('select');
        selectElement.className = 'item-select';
        selectElement.id = `item-select-${index}`;
        
        // Platzhalter-Option hinzufügen
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = '-- Item auswählen --';
        selectElement.appendChild(placeholderOption);
        
        // Füge alle Items als Optionen hinzu
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            option.dataset.beschreibung = item.beschreibung;
            option.dataset.anzahl = item.anzahl;
            selectElement.appendChild(option);
        });
        
        // Beschreibung und Anzahl Container
        const descriptionContainer = document.createElement('div');
        descriptionContainer.className = 'item-description-container';
        
        const descriptionLabel = document.createElement('label');
        descriptionLabel.textContent = 'Beschreibung:';
        descriptionLabel.htmlFor = `item-description-${index}`;
        
        const descriptionInput = document.createElement('textarea');
        descriptionInput.className = 'item-description';
        descriptionInput.id = `item-description-${index}`;
        descriptionInput.readOnly = true;
        descriptionInput.rows = 2;
        
        const amountContainer = document.createElement('div');
        amountContainer.className = 'item-amount-container';
        
        const amountLabel = document.createElement('label');
        amountLabel.textContent = 'Anzahl:';
        amountLabel.htmlFor = `item-amount-${index}`;
        
        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.className = 'item-amount';
        amountInput.id = `item-amount-${index}`;
        amountInput.readOnly = true;
        
        // Event-Listener für das Select-Element
        selectElement.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            
            if (this.value === '') {
                // Nichts ausgewählt
                descriptionInput.value = '';
                amountInput.value = '';
            } else {
                // Item ausgewählt, Beschreibung und Anzahl setzen
                descriptionInput.value = selectedOption.dataset.beschreibung;
                amountInput.value = selectedOption.dataset.anzahl;
            }
        });
        
        // DOM-Struktur zusammensetzen
        selectContainer.appendChild(selectElement);
        
        descriptionContainer.appendChild(descriptionLabel);
        descriptionContainer.appendChild(descriptionInput);
        
        amountContainer.appendChild(amountLabel);
        amountContainer.appendChild(amountInput);
        
        slotContainer.appendChild(selectContainer);
        slotContainer.appendChild(descriptionContainer);
        slotContainer.appendChild(amountContainer);
        
        // Slot zum Inventar-Container hinzufügen
        inventoryContainer.appendChild(slotContainer);
        
        // Slot in der Liste speichern
        itemSlots.push({
            container: slotContainer,
            select: selectElement,
            description: descriptionInput,
            amount: amountInput
        });
        
        // Setup mit benutzerdefinierten Select-Dropdown
        setupCustomSelect(selectElement, items);
    }
    
    // Funktion für benutzerdefinierte Select-Elemente mit Tooltips
    function setupCustomSelect(selectElement, items) {
        // Container für das benutzerdefinierte Dropdown erstellen
        const selectContainer = document.createElement('div');
        selectContainer.className = 'custom-select-container';
        selectContainer.style.position = 'relative';
        selectContainer.style.width = '100%';
        
        // Verstecke das originale Select-Element, behalte es aber für die Funktionalität
        selectElement.style.display = 'none';
        selectElement.parentNode.insertBefore(selectContainer, selectElement);
        selectContainer.appendChild(selectElement);
        
        // Erstelle den sichtbaren Select-Button
        const selectButton = document.createElement('div');
        selectButton.className = 'custom-select-button';
        selectButton.innerHTML = selectElement.options[0].text;
        selectContainer.appendChild(selectButton);
        
        // Erstelle die Dropdown-Liste
        const dropdownList = document.createElement('div');
        dropdownList.className = 'custom-select-dropdown';
        dropdownList.style.display = 'none';
        selectContainer.appendChild(dropdownList);
        
        // Erstelle Tooltip-Element
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-text';
        tooltip.style.display = 'none';
        document.body.appendChild(tooltip);
        
        // Füge die Optionen zur Dropdown-Liste hinzu
        const options = Array.from(selectElement.options).slice(1); // Überspringe den Platzhalter
        options.forEach((option, index) => {
            const item = items[index];
            const optionElement = document.createElement('div');
            optionElement.className = 'custom-select-option';
            optionElement.textContent = item.name;
            optionElement.dataset.value = item.id;
            optionElement.dataset.beschreibung = item.beschreibung;
            optionElement.dataset.anzahl = item.anzahl;
            
            // Hover-Effekt für Optionen
            optionElement.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f0f0f0';
                
                // Tooltip anzeigen
                tooltip.textContent = `${this.dataset.beschreibung} (Anzahl: ${this.dataset.anzahl})`;
                tooltip.style.display = 'block';
                
                // Position des Tooltips aktualisieren
                const updateTooltipPosition = function(e) {
                    tooltip.style.position = 'fixed';
                    tooltip.style.top = (e.clientY + 10) + 'px';
                    tooltip.style.left = (e.clientX + 15) + 'px';
                };
                
                updateTooltipPosition(window.event);
                document.addEventListener('mousemove', updateTooltipPosition);
                
                // Event-Listener für mousemove speichern, um ihn später zu entfernen
                this.updateTooltipPosition = updateTooltipPosition;
            });
            
            optionElement.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
                tooltip.style.display = 'none';
                
                // Event-Listener entfernen
                if (this.updateTooltipPosition) {
                    document.removeEventListener('mousemove', this.updateTooltipPosition);
                }
            });
            
            // Klick-Event für Optionen
            optionElement.addEventListener('click', function() {
                selectElement.value = this.dataset.value;
                selectButton.innerHTML = this.textContent;
                dropdownList.style.display = 'none';
                
                // Aktualisiere Beschreibung und Anzahl
                const index = parseInt(selectElement.id.split('-').pop());
                const descriptionInput = document.getElementById(`item-description-${index}`);
                const amountInput = document.getElementById(`item-amount-${index}`);
                
                descriptionInput.value = this.dataset.beschreibung;
                amountInput.value = this.dataset.anzahl;
                
                // Manuelles Auslösen des change-Events für das Original-Select
                const event = new Event('change', { bubbles: true });
                selectElement.dispatchEvent(event);
            });
            
            dropdownList.appendChild(optionElement);
        });
        
        // Leere Option hinzufügen
        const emptyOption = document.createElement('div');
        emptyOption.className = 'custom-select-option';
        emptyOption.textContent = '-- Item auswählen --';
        emptyOption.dataset.value = '';
        
        emptyOption.addEventListener('click', function() {
            selectElement.value = '';
            selectButton.innerHTML = this.textContent;
            dropdownList.style.display = 'none';
            
            // Aktualisiere Beschreibung und Anzahl (leeren)
            const index = parseInt(selectElement.id.split('-').pop());
            const descriptionInput = document.getElementById(`item-description-${index}`);
            const amountInput = document.getElementById(`item-amount-${index}`);
            
            descriptionInput.value = '';
            amountInput.value = '';
            
            // Manuelles Auslösen des change-Events für das Original-Select
            const event = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(event);
        });
        
        // Leere Option am Anfang einfügen
        dropdownList.insertBefore(emptyOption, dropdownList.firstChild);
        
        // Dropdown öffnen/schließen
        selectButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = dropdownList.style.display === 'block';
            // Alle anderen Dropdowns schließen
            document.querySelectorAll('.custom-select-dropdown').forEach(dropdown => {
                dropdown.style.display = 'none';
            });
            
            if (!isOpen) {
                dropdownList.style.display = 'block';
            }
        });
        
        // Schließen bei Klick außerhalb
        document.addEventListener('click', function() {
            dropdownList.style.display = 'none';
        });
    }
});
