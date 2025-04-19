// app.js - Hauptskript für den Charakter-Editor

document.addEventListener('DOMContentLoaded', function() {
    // Konstanten für die Punkteberechnung
    const TOTAL_ATTRIBUTE_POINTS = 12;
    const TOTAL_SKILL_POINTS = 50;
    let CURRENT_ATTRIBUTE_MAX = TOTAL_ATTRIBUTE_POINTS; // Dynamischer Wert basierend auf Vorteilen
    let CURRENT_SKILL_MAX = TOTAL_SKILL_POINTS;         // Dynamischer Wert basierend auf Vorteilen
    
    const MIN_MAIN_ATTRIBUTE = 1;
    const MAX_MAIN_ATTRIBUTE = 5;
    const MIN_SKILL_VALUE = 0;
    const MAX_SKILL_VALUE = 5;
    
    // DOM-Elemente referenzieren
    const elements = {
        // Dropdown-Menüs
        classSelect: document.getElementById('class'),
        advantageSelect: document.getElementById('advantage'),
        disadvantageSelect: document.getElementById('disadvantage'),
        tooltipContainer: document.getElementById('tooltip-container'),
        
        // Kampfwerte-Elemente
        genaInput: document.getElementById('gena'),
        paInput: document.getElementById('pa'),
        kpInput: document.getElementById('kp'),
        initInput: document.getElementById('init'),
        bwInput: document.getElementById('bw'),
        luckTokensInput: document.getElementById('luck-tokens'),
        
        // Wunden-Tracker-Elemente
        woundCircles: document.querySelectorAll('.wound-circle, .wound-skull'),
        
        // Attribut-Elemente
        attributeInputs: document.querySelectorAll('.attribute-value'),
        mainAttributeInputs: document.querySelectorAll('.main-attribute-value'),
        availablePointsDisplay: document.getElementById('available-points'),
        availableSkillPointsDisplay: document.getElementById('available-skill-points'),
        
        // Reset-Button
        resetButton: document.getElementById('reset-attributes')
    };
    
    // Zustandsvariablen
    let state = {
        currentWoundLevel: 0
    };

    // Wunden-Tracker Initialisierung
    initWoundTracker();
    
    // Dropdown-Menüs initialisieren
    initDropdowns();
    
    // Attributeingaben initialisieren
    initAttributeInputs();
    
    // Initialisierung der Anzeigen
    updateAvailablePointsDisplay();
    updateAvailableSkillPointsDisplay();
    
    // Initialisiere Kampfwerte
    updateCombatStats();
    
    // Reset-Button Event-Listener
    initResetButton();

    
    addFantastischeEignungEventListener();
    
    // ===== FUNKTIONEN =====
    
    // Initialisierung des Wunden-Trackers
    function initWoundTracker() {
        elements.woundCircles.forEach((circle, index) => {
            circle.addEventListener('click', function() {
                setWoundLevel(index + 1);
            });
        });
    }
    
    // Funktion zum Setzen des Wundenlevels
    function setWoundLevel(level) {
        state.currentWoundLevel = level;
        
        elements.woundCircles.forEach((circle, index) => {
            if (index < level) {
                circle.classList.add('active');
            } else {
                circle.classList.remove('active');
            }
        });
    }
    

    // Funktion zum Initialisieren der Tooltips für Kampfwerte
    function initCombatStatsTooltips() {
        // Tooltip-Texte definieren
        const tooltipTexts = {
            'gena': "Genauigkeit. Würfle so viele W6, wenn du versuchst, ein Ziel zu treffen. Berechnung: ⌈(WI + WI + GL) / 3⌉",
            'pa': "Parade. Würfle so viele W6, wenn du versuchst, auszuweichen. Berechnung: ⌈(WI + CH + GL) / 3⌉ + Ausweichen (+ 5 bei Schnelle-Reflexe-Vorteil)",
            'kp': "Kraftpunkte. Zeigt deine aktuelle und maximale Gesundheit an. Berechnung: (KÖ + KÖ + GL) * 3 (+ 30 bei Vernarbt-Vorteil)",
            'init': "Initiative. Würfle so viele W6, um deine Kampfreihenfolge relativ zu anderen Menschen festzulegen. Wird auch für Verfolgungsjagden benutzt. Berechnung: ⌈(KÖ + CH + CH) / 3⌉",
            'bw': "Bewegung. Gibt an, wie viele Meter du pro Runde zurücklegen kannst. Berechnung: KÖ * 5 + Akrobatik * 3",
            'luck-tokens': "Können ausgegeben werden, um einen Würfelwurf zu wiederholen und dabei alle Mali durch Forcieren zurückzusetzen. Berechnung: GL (+ 5 bei Glückspilz-Vorteil)"
        };
        
        // Tooltip-Element erstellen
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-text';
        tooltip.style.display = 'none';
        tooltip.style.position = 'fixed';
        tooltip.style.zIndex = '1000';
        tooltip.style.maxWidth = '300px';
        document.body.appendChild(tooltip);
        
        // Für alle Kampfwerte Tooltips einrichten
        for (let statId in tooltipTexts) {
            const statElement = document.getElementById(statId);
            const statLabelElement = document.querySelector(`label[for="${statId}"]`);
            
            // Wir machen das Label und das Input beide hoverable
            [statElement, statLabelElement].forEach(element => {
                if (!element) return;
                
                // Cursor ändern, um die Interaktivität anzuzeigen
                element.style.cursor = 'help';
                
                // Event-Listener für Hover hinzufügen
                element.addEventListener('mouseenter', function(e) {
                    tooltip.textContent = tooltipTexts[statId];
                    tooltip.style.display = 'block';
                    
                    // Position des Tooltips aktualisieren
                    const updateTooltipPosition = function(e) {
                        tooltip.style.top = (e.clientY + 15) + 'px';
                        tooltip.style.left = (e.clientX + 15) + 'px';
                    };
                    
                    // Initiale Position setzen
                    updateTooltipPosition(e);
                    
                    // Event-Listener für Mausbewegung hinzufügen
                    document.addEventListener('mousemove', updateTooltipPosition);
                    
                    // Event-Listener für mousemove speichern, um ihn später zu entfernen
                    this.updateTooltipPosition = updateTooltipPosition;
                });
                
                // Event-Listener für Hover-Ende hinzufügen
                element.addEventListener('mouseleave', function() {
                    tooltip.style.display = 'none';
                    
                    // Event-Listener entfernen
                    if (this.updateTooltipPosition) {
                        document.removeEventListener('mousemove', this.updateTooltipPosition);
                    }
                });
            });
        }
    }

    // Funktion zum Initialisieren der Tooltips für Fertigkeiten
    function initFertigkeitTooltips() {
        // Tooltip-Element erstellen (oder das bestehende wiederverwenden)
        let tooltip = document.querySelector('.tooltip-text');
        
        // Falls kein Tooltip existiert, einen neuen erstellen
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip-text';
            tooltip.style.display = 'none';
            tooltip.style.position = 'fixed';
            tooltip.style.zIndex = '1000';
            tooltip.style.maxWidth = '300px';
            document.body.appendChild(tooltip);
        }
        
        // Alle Fertigkeit-Elemente auswählen
        const fertigkeitItems = document.querySelectorAll('.attribute-item');
        
        // Für jedes Fertigkeit-Element Tooltips einrichten
        fertigkeitItems.forEach(item => {
            // Extrahiere den Fertigkeitsnamen (Text vor dem ersten Input-Element)
            const itemText = item.textContent.trim();
            const fertigkeitName = itemText.split(/\s+\d+/)[0].trim();
            
            // Cursor ändern, um die Interaktivität anzuzeigen
            item.style.cursor = 'help';
            
            // Event-Listener für Hover hinzufügen
            item.addEventListener('mouseenter', function(e) {
                // Hole die Beschreibung aus dem fertigkeitService
                const beschreibung = fertigkeitService.getBeschreibung(fertigkeitName);
                
                // Tooltip anzeigen
                tooltip.textContent = beschreibung;
                tooltip.style.display = 'block';
                
                // Position des Tooltips aktualisieren
                const updateTooltipPosition = function(e) {
                    tooltip.style.top = (e.clientY + 15) + 'px';
                    tooltip.style.left = (e.clientX + 15) + 'px';
                };
                
                // Initiale Position setzen
                updateTooltipPosition(e);
                
                // Event-Listener für Mausbewegung hinzufügen
                document.addEventListener('mousemove', updateTooltipPosition);
                
                // Event-Listener für mousemove speichern, um ihn später zu entfernen
                this.updateTooltipPosition = updateTooltipPosition;
            });
            
            // Event-Listener für Hover-Ende hinzufügen
            item.addEventListener('mouseleave', function() {
                tooltip.style.display = 'none';
                
                // Event-Listener entfernen
                if (this.updateTooltipPosition) {
                    document.removeEventListener('mousemove', this.updateTooltipPosition);
                }
            });
        });
    }


    // Initialisierung der Dropdown-Menüs
    function initDropdowns() {
        // Daten aus den Services laden
        const klassen = klasseService.getAllKlassen();
        const vorteile = vorteilService.getAllVorteile();
        const nachteile = nachteilService.getAllNachteile();
        
        // Dropdown-Menüs befüllen
        loadDropdown(elements.classSelect, klassen);
        loadDropdown(elements.advantageSelect, vorteile);
        loadDropdown(elements.disadvantageSelect, nachteile);
        
        // Event-Listener für Tooltips und Auswahl hinzufügen
        setupSelectWithTooltips(elements.classSelect, klassen);
        elements.classSelect.addEventListener('change', function() {
            // Event für klasseEffekte.js auslösen
            const event = new Event('change');
            this.dispatchEvent(event);
        });
        setupSelectWithTooltips(elements.advantageSelect, vorteile);
        setupSelectWithTooltips(elements.disadvantageSelect, nachteile);

        initCombatStatsTooltips();
        initFertigkeitTooltips();
    }
    
    // Funktion zum Befüllen der Dropdown-Menüs
    function loadDropdown(selectElement, items) {
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            option.dataset.beschreibung = item.beschreibung;
            selectElement.appendChild(option);
        });
    }
    
    // Funktion für erweiterte Select-Elemente mit Tooltips
    function setupSelectWithTooltips(selectElement, items) {
        // Container für das benutzerdefinierte Dropdown erstellen
        const selectContainer = document.createElement('div');
        selectContainer.className = 'custom-select-container';
        selectContainer.style.position = 'relative';
        selectContainer.style.width = '100%';
        
        // Verstecke das originale Select-Element, behalte es aber für Form-Submission
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
            // Index könnte außerhalb des Bereichs sein, wenn wir gefilterte Items haben
            if (index >= items.length) return;
            
            const item = items[index];
            const optionElement = document.createElement('div');
            optionElement.className = 'custom-select-option';
            optionElement.textContent = item.name;
            optionElement.dataset.value = item.id;
            optionElement.dataset.beschreibung = item.beschreibung;
            optionElement.dataset.disabled = 'false'; // Standardmäßig nicht deaktiviert
            
            // Hover-Effekt für Optionen
            optionElement.addEventListener('mouseenter', function(e) {
                // Prüfen, ob die Option deaktiviert ist
                if (this.dataset.disabled === 'true') return;
                
                this.style.backgroundColor = '#f0f0f0';
                
                // Tooltip anzeigen
                tooltip.textContent = this.dataset.beschreibung;
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
                // Tooltip immer ausblenden, auch wenn Option deaktiviert ist
                this.style.backgroundColor = this.dataset.disabled === 'true' ? '#f5f5f5' : '';
                tooltip.style.display = 'none';
                
                // Event-Listener entfernen
                if (this.updateTooltipPosition) {
                    document.removeEventListener('mousemove', this.updateTooltipPosition);
                }
            });
            
            // Klick-Event für Optionen
            optionElement.addEventListener('click', function() {
                // Prüfen, ob die Option deaktiviert ist
                if (this.dataset.disabled === 'true') return;
                
                selectElement.value = this.dataset.value;
                selectButton.innerHTML = this.textContent;
                dropdownList.style.display = 'none';
                
                // Manuelles Auslösen des change-Events für das Original-Select
                const event = new Event('change', { bubbles: true });
                selectElement.dispatchEvent(event);
                
                // Permanente Beschreibung anzeigen
                const selectedItem = items.find(item => item.id === this.dataset.value);
                if (selectedItem) {
                    showTooltip(selectElement.id, selectedItem.name, selectedItem.beschreibung);
                }
                
                // Aktualisiere Kampfwerte nach Änderung von Klasse, Vorteil oder Nachteil
                updateCombatStats();
            });
            
            dropdownList.appendChild(optionElement);
        });
        
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
        
        // Change-Event für das Original-Select
        selectElement.addEventListener('change', function() {
            const selectedValue = this.value;
            if (!selectedValue) return;
            
            const selectedOption = Array.from(this.options).find(option => option.value === selectedValue);
            if (selectedOption) {
                selectButton.innerHTML = selectedOption.textContent;
            }
            
            const selectedItem = items.find(item => item.id === selectedValue);
            if (selectedItem) {
                showTooltip(this.id, selectedItem.name, selectedItem.beschreibung);
            }
        });
    }
    
    // Funktion zum Anzeigen einer permanenten Beschreibung bei Auswahl
    function showTooltip(elementId, name, beschreibung) {
        const existingTooltip = document.querySelector(`[data-for="${elementId}"]`);
        if (existingTooltip) {
            elements.tooltipContainer.removeChild(existingTooltip);
        }
        
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'form-row';
        tooltipElement.dataset.for = elementId;
        tooltipElement.innerHTML = `
            <label>${name}:</label>
            <p style="margin-top: 5px; color: #666;">${beschreibung}</p>
        `;
        
        elements.tooltipContainer.appendChild(tooltipElement);
    }
    
    // Initialisierung der Attributeingabefelder
    function initAttributeInputs() {
        // Normale Attributwerte (0-5) mit Fertigkeitspunktebegrenzung
        elements.attributeInputs.forEach(input => {
            let lastValidValue = input.value; // Speichere den letzten gültigen Wert
            
            // Input-Event für sofortige Validierung
            input.addEventListener('input', function() {
                if (this.value === '') return;
                
                // Temporärer Wert für die Berechnung
                const newValue = parseInt(this.value) || 0;
                
                // Prüfe zunächst, ob der Wert im erlaubten Bereich liegt
                if (isNaN(newValue) || newValue < MIN_SKILL_VALUE || newValue > MAX_SKILL_VALUE) {
                    // Wert außerhalb des Bereichs - setze auf letzten gültigen Wert zurück
                    this.value = lastValidValue;
                    return;
                }
                
                // Temporär den Wert setzen, um die verfügbaren Punkte korrekt zu berechnen
                const oldValue = parseInt(lastValidValue) || 0;
                this.value = oldValue; // Setze temporär zurück auf alten Wert
                
                // Berechne verfügbare Punkte basierend auf aktuellem Zustand
                const currentAvailablePoints = calculateAvailableSkillPoints();
                
                // Prüfe, ob die neue Änderung möglich ist
                if (currentAvailablePoints + oldValue - newValue < 0) {
                    // Nicht genügend Punkte verfügbar - setze auf letzten gültigen Wert zurück
                    this.value = lastValidValue;
                } else {
                    // Gültiger Wert - aktualisiere den letzten gültigen Wert
                    this.value = newValue;
                    lastValidValue = newValue.toString();
                    // Aktualisiere die Anzeige der verfügbaren Fertigkeitspunkte
                    updateAvailableSkillPointsDisplay();
                }
            });
            
            // Blur-Event für die Validierung beim Verlassen des Feldes
            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.value = '0';
                    lastValidValue = '0';
                    updateAvailableSkillPointsDisplay();
                }
            });
        });
        
        // Hauptattribute (1-5 mit Punktelimit)
        elements.mainAttributeInputs.forEach(input => {
            let lastValidValue = input.value; // Speichere den letzten gültigen Wert (startet bei 1)
            
            // Input-Event für sofortige Validierung
            input.addEventListener('input', function() {
                if (this.value === '') return;
                
                // Temporärer Wert für die Berechnung
                const newValue = parseInt(this.value) || 0;
                
                // Prüfe zunächst, ob der Wert im erlaubten Bereich liegt
                if (isNaN(newValue) || newValue < MIN_MAIN_ATTRIBUTE || newValue > MAX_MAIN_ATTRIBUTE) {
                    // Wert außerhalb des Bereichs - setze auf letzten gültigen Wert zurück
                    this.value = lastValidValue;
                    return;
                }
                
                // Temporär den Wert setzen, um die verfügbaren Punkte korrekt zu berechnen
                const oldValue = parseInt(lastValidValue) || 0;
                this.value = oldValue; // Setze temporär zurück auf alten Wert
                
                // Berechne verfügbare Punkte basierend auf aktuellem Zustand
                const currentAvailablePoints = calculateAvailablePoints();
                
                // Prüfe, ob die neue Änderung möglich ist
                if (currentAvailablePoints + oldValue - newValue < 0) {
                    // Nicht genügend Punkte verfügbar - setze auf letzten gültigen Wert zurück
                    this.value = lastValidValue;
                } else {
                    // Gültiger Wert - aktualisiere den letzten gültigen Wert
                    this.value = newValue;
                    lastValidValue = newValue.toString();
                    // Aktualisiere die Anzeige der verfügbaren Punkte
                    updateAvailablePointsDisplay();
                    
                    // Aktualisiere die Kampfwerte direkt nach Änderung eines Hauptattributs
                    updateCombatStats();
                }
            });
            
            // Blur-Event für die Validierung beim Verlassen des Feldes
            input.addEventListener('blur', function() {
                if (this.value === '' || parseInt(this.value) < MIN_MAIN_ATTRIBUTE) {
                    this.value = MIN_MAIN_ATTRIBUTE.toString();
                    lastValidValue = MIN_MAIN_ATTRIBUTE.toString();
                    updateAvailablePointsDisplay();
                    
                    // Aktualisiere die Kampfwerte bei Verlassen des Feldes
                    updateCombatStats();
                }
            });
        });
    }
    
    // Funktion zur Initialisierung des Reset-Buttons
    function initResetButton() {
        elements.resetButton.addEventListener('click', function() {
            // Bestätigungsdialog anzeigen
            if (confirm('Möchtest du wirklich alle Attribute und Fertigkeiten zurücksetzen?')) {
                // Hauptattribute auf 1 zurücksetzen
                elements.mainAttributeInputs.forEach(input => {
                    input.value = '1';
                });
                
                // Fertigkeiten auf 0 zurücksetzen
                elements.attributeInputs.forEach(input => {
                    input.value = '0';
                });
                
                // Displays aktualisieren
                updateAvailablePointsDisplay();
                updateAvailableSkillPointsDisplay();
                
                // Kampfwerte aktualisieren
                updateCombatStats();
            }
        });
    }
    
    // Hilfsfunktionen für Punkteberechnung
    
    // Funktion zur Berechnung der verfügbaren Attributpunkte
    function calculateAvailablePoints() {
        let usedPoints = 0;
        elements.mainAttributeInputs.forEach(input => {
            usedPoints += parseInt(input.value) || 0;
        });
        
        // Verwende den dynamischen maximalen Wert
        return CURRENT_ATTRIBUTE_MAX - usedPoints;
    }
    
    // Funktion zur Berechnung der verfügbaren Fertigkeitspunkte
    function calculateAvailableSkillPoints() {
        let usedPoints = 0;
        elements.attributeInputs.forEach(input => {
            usedPoints += parseInt(input.value) || 0;
        });
        
        // Verwende den dynamischen maximalen Wert
        return CURRENT_SKILL_MAX - usedPoints;
    }
    
    
    // Funktion zum Aktualisieren der Attributpunkte-Anzeige
    function updateAvailablePointsDisplay() {
        const availablePoints = calculateAvailablePoints();
        elements.availablePointsDisplay.textContent = availablePoints + " verfügbar";
        
        // Visuelle Hinweise zur Verfügbarkeit
        if (availablePoints < 0) {
            elements.availablePointsDisplay.style.backgroundColor = "#ffcccc";
            elements.availablePointsDisplay.style.color = "#cc0000";
        } else if (availablePoints === 0) {
            elements.availablePointsDisplay.style.backgroundColor = "#e6f7e6";
            elements.availablePointsDisplay.style.color = "#006600";
        } else {
            elements.availablePointsDisplay.style.backgroundColor = "#f0f0f0";
            elements.availablePointsDisplay.style.color = "#444";
        }
        
        // Kampfwerte aktualisieren, wenn sich Attribute ändern
        updateCombatStats();
    }
    
    // Funktion zum Aktualisieren der Fertigkeitspunkte-Anzeige
    function updateAvailableSkillPointsDisplay() {
        const availableSkillPoints = calculateAvailableSkillPoints();
        elements.availableSkillPointsDisplay.textContent = availableSkillPoints + " Fertigkeitspunkte verfügbar";
        
        // Visuelle Hinweise zur Verfügbarkeit
        if (availableSkillPoints < 0) {
            elements.availableSkillPointsDisplay.style.backgroundColor = "#ffcccc";
            elements.availableSkillPointsDisplay.style.color = "#cc0000";
        } else if (availableSkillPoints === 0) {
            elements.availableSkillPointsDisplay.style.backgroundColor = "#e6f7e6";
            elements.availableSkillPointsDisplay.style.color = "#006600";
        } else {
            elements.availableSkillPointsDisplay.style.backgroundColor = "#f0f0f0";
            elements.availableSkillPointsDisplay.style.color = "#444";
        }
        
        // Kampfwerte aktualisieren, wenn sich Fertigkeiten ändern
        updateCombatStats();
    }
    
    // Funktion zur Aktualisierung der Kampfwerte
    function updateCombatStats() {
        // Hauptattribute abrufen
        const körperAttribut = parseInt(document.querySelector('.attribute-column:nth-child(1) .main-attribute-value').value) || 1;
        const weisheitAttribut = parseInt(document.querySelector('.attribute-column:nth-child(2) .main-attribute-value').value) || 1;
        const charismaAttribut = parseInt(document.querySelector('.attribute-column:nth-child(3) .main-attribute-value').value) || 1;
        const glückAttribut = parseInt(document.querySelector('.attribute-column:nth-child(4) .main-attribute-value').value) || 1;
        
        // Fertigkeiten abrufen (mit verbesserter Methode)
        let ausweichenWert = 0;
        let akrobatikWert = 0;
        
        // Alle Attribut-Items durchlaufen und nach den gesuchten Fertigkeiten suchen
        document.querySelectorAll('.attribute-item').forEach(item => {
            const text = item.textContent.trim();
            if (text.includes('Ausweichen')) {
                ausweichenWert = parseInt(item.querySelector('.attribute-value').value) || 0;
            }
            if (text.includes('Akrobatik')) {
                akrobatikWert = parseInt(item.querySelector('.attribute-value').value) || 0;
            }
        });
        
        // Kampfwerte berechnen nach den neuen Formeln
        // Bei Division immer aufrunden (Math.ceil)
        const gena = Math.ceil((weisheitAttribut + weisheitAttribut + glückAttribut) / 3);
        const pa = Math.ceil((weisheitAttribut + charismaAttribut + glückAttribut) / 3) + ausweichenWert;
        const kpMax = (körperAttribut + körperAttribut + glückAttribut) * 3;
        const init = Math.ceil((körperAttribut + charismaAttribut + charismaAttribut) / 3);
        const bw = körperAttribut * 5 + (akrobatikWert * 3);
        
        // Werte setzen
        elements.genaInput.value = gena;
        elements.paInput.value = pa;
        elements.kpInput.value = kpMax + "/" + kpMax;
        elements.initInput.value = init;
        elements.bwInput.value = bw;
        elements.luckTokensInput.value = glückAttribut + "/" + glückAttribut;
        
        // Überprüfung der Vorteile hinzufügen
        checkGlueckspilzVorteil();
        checkVernarbtVorteil();
        checkReichVorteil();
        checkSchnelleReflexeVorteil();
    }

    // Funktion zum Überprüfen und Anwenden des Schnelle Reflexe-Vorteils
    function checkSchnelleReflexeVorteil() {
        const advantageSelect = document.getElementById('advantage');
        const paInput = document.getElementById('pa');
        
        // Prüfen, ob Schnelle Reflexe ausgewählt ist
        if (advantageSelect.value === 'schnelle-reflexe') {
            // Aktuelle PA-Werte abrufen
            let currentPA = parseInt(paInput.value) || 0;
            
            // PA um 5 erhöhen
            currentPA += 5;
            
            // Wert aktualisieren
            paInput.value = currentPA;
            
            // Visuell hervorheben
            paInput.style.color = '#006400'; // Dunkelgrün
            paInput.style.fontWeight = 'bold';
            
            // Tooltip-Text aktualisieren (falls vorhanden)
            const tooltipTexts = document.querySelector('.tooltip-text');
            if (tooltipTexts) {
                // Den bestehenden PA-Tooltip um den Bonus-Hinweis erweitern
                const paTooltipText = "Parade. Würfle so viele W6, wenn du versuchst, auszuweichen. Berechnung: ⌈(WI + CH + GL) / 3⌉ + Ausweichen + 5 (Vorteil: Schnelle Reflexe)";
                
                // Die updateTooltipText-Funktion simulieren/erstellen, falls nötig
                if (typeof updateTooltipText === 'function') {
                    updateTooltipText('pa', paTooltipText);
                }
            }
        } else {
            // Zurücksetzen des Stils, wenn der Vorteil nicht gewählt ist
            paInput.style.color = '';
            paInput.style.fontWeight = '';
        }
    }

    function checkFantastischeEignungVorteil() {
        const advantageSelect = document.getElementById('advantage');
        
        // Flag, um zu prüfen, ob der Vorteil gerade aktiviert/deaktiviert wird
        const wasActive = CURRENT_ATTRIBUTE_MAX > TOTAL_ATTRIBUTE_POINTS;
        const isActive = advantageSelect.value === 'fantastische-eignung';
        
        // Wenn keine Änderung, nichts tun
        if ((wasActive && isActive) || (!wasActive && !isActive)) {
            return;
        }
        
        if (isActive) {
            // Erhöhe die maximalen Punkte
            CURRENT_ATTRIBUTE_MAX = TOTAL_ATTRIBUTE_POINTS + 1;
            CURRENT_SKILL_MAX = TOTAL_SKILL_POINTS + 12;
            
            // Visuelle Hervorhebung der erhöhten Punktelimits
            elements.availablePointsDisplay.style.color = '#006400'; // Dunkelgrün
            elements.availablePointsDisplay.style.fontWeight = 'bold';
            elements.availableSkillPointsDisplay.style.color = '#006400'; // Dunkelgrün
            elements.availableSkillPointsDisplay.style.fontWeight = 'bold';
        } else {
            // Setze die maximalen Punkte zurück
            CURRENT_ATTRIBUTE_MAX = TOTAL_ATTRIBUTE_POINTS;
            CURRENT_SKILL_MAX = TOTAL_SKILL_POINTS;
            
            // Visuelle Hervorhebung zurücksetzen
            elements.availablePointsDisplay.style.color = '';
            elements.availablePointsDisplay.style.fontWeight = '';
            elements.availableSkillPointsDisplay.style.color = '';
            elements.availableSkillPointsDisplay.style.fontWeight = '';
            
            // Überprüfe, ob zu viele Punkte ausgegeben wurden
            handleAttributeOverspend();
            handleSkillOverspend();
        }
        
        // Aktualisiere die Anzeigen
        updateAvailablePointsDisplay();
        updateAvailableSkillPointsDisplay();
    }

    // Funktion zum Behandeln von überzähligen Attributpunkten
    function handleAttributeOverspend() {
        let usedPoints = 0;
        // Berechne die verwendeten Attributpunkte
        elements.mainAttributeInputs.forEach(input => {
            usedPoints += parseInt(input.value) || 0;
        });
        
        // Wenn mehr Punkte ausgegeben wurden, als jetzt verfügbar sind
        if (usedPoints > CURRENT_ATTRIBUTE_MAX) {
            const overspend = usedPoints - CURRENT_ATTRIBUTE_MAX;
            
            // Zeige eine Warnung an den Benutzer
            alert(`Der Vorteil "Fantastische Eignung" wurde deaktiviert. Es müssen ${overspend} Attributpunkte entfernt werden.`);
            
            // Entferne zufällig Punkte, bis die Grenze eingehalten wird
            let remainingToRemove = overspend;
            
            while (remainingToRemove > 0) {
                // Erstelle Array mit allen Attributen, die noch reduzierbar sind
                const reducibleAttributes = Array.from(elements.mainAttributeInputs).filter(input => {
                    return parseInt(input.value) > MIN_MAIN_ATTRIBUTE;
                });
                
                // Wenn keine reduzierbaren Attribute mehr vorhanden sind, breche ab
                if (reducibleAttributes.length === 0) {
                    break;
                }
                
                // Wähle ein zufälliges Attribut aus
                const randomIndex = Math.floor(Math.random() * reducibleAttributes.length);
                const selectedAttribute = reducibleAttributes[randomIndex];
                
                // Reduziere den Wert um 1
                selectedAttribute.value = (parseInt(selectedAttribute.value) - 1).toString();
                remainingToRemove--;
            }
        }
    }

    // Funktion zum Behandeln von überzähligen Fertigkeitspunkten
    function handleSkillOverspend() {
        let usedPoints = 0;
        // Berechne die verwendeten Fertigkeitspunkte
        elements.attributeInputs.forEach(input => {
            usedPoints += parseInt(input.value) || 0;
        });
        
        // Wenn mehr Punkte ausgegeben wurden, als jetzt verfügbar sind
        if (usedPoints > CURRENT_SKILL_MAX) {
            const overspend = usedPoints - CURRENT_SKILL_MAX;
            
            // Zeige eine Warnung an den Benutzer
            alert(`Der Vorteil "Fantastische Eignung" wurde deaktiviert. Es müssen ${overspend} Fertigkeitspunkte entfernt werden.`);
            
            // Entferne zufällig Punkte, bis die Grenze eingehalten wird
            let remainingToRemove = overspend;
            
            while (remainingToRemove > 0) {
                // Erstelle Array mit allen Fertigkeiten, die noch reduzierbar sind
                const reducibleSkills = Array.from(elements.attributeInputs).filter(input => {
                    return parseInt(input.value) > MIN_SKILL_VALUE;
                });
                
                // Wenn keine reduzierbaren Fertigkeiten mehr vorhanden sind, breche ab
                if (reducibleSkills.length === 0) {
                    break;
                }
                
                // Wähle eine zufällige Fertigkeit aus
                const randomIndex = Math.floor(Math.random() * reducibleSkills.length);
                const selectedSkill = reducibleSkills[randomIndex];
                
                // Reduziere den Wert um 1
                selectedSkill.value = (parseInt(selectedSkill.value) - 1).toString();
                remainingToRemove--;
            }
        }
    }

    
    function addFantastischeEignungEventListener() {
        const advantageSelect = document.getElementById('advantage');
        advantageSelect.addEventListener('change', checkFantastischeEignungVorteil);
    }

    // Funktion zum Überprüfen und Anwenden des Glückspilz-Vorteils
    function checkGlueckspilzVorteil() {
        const advantageSelect = document.getElementById('advantage');
        const luckTokensInput = document.getElementById('luck-tokens');
        
        // Aktuelle Glücks-Tokens-Werte abrufen
        let currentLuckTokens = luckTokensInput.value;
        let tokenParts = currentLuckTokens.split('/');
        let currentTokens = parseInt(tokenParts[0]) || 0;
        let maxTokens = parseInt(tokenParts[1]) || 0;
        
        // Basis-Glücks-Token-Anzahl (normalerweise gleich dem Glück-Attribut)
        const glückAttribut = parseInt(document.querySelector('.attribute-column:nth-child(4) .main-attribute-value').value) || 1;
        
        // Standardwerte zurücksetzen
        let newMaxTokens = glückAttribut;
        luckTokensInput.style.color = '';
        luckTokensInput.style.fontWeight = '';
        
        // Prüfen, ob Glückspilz ausgewählt ist
        if (advantageSelect.value === 'glueckspilz') {
            // Maximale Tokens um 5 erhöhen
            newMaxTokens = glückAttribut + 5;
            
            // Visuell hervorheben
            luckTokensInput.style.color = '#006400'; // Dunkelgrün
            luckTokensInput.style.fontWeight = 'bold';
        }
        
        // Aktuellen Wert anpassen, falls nötig
        if (currentTokens > newMaxTokens) {
            currentTokens = newMaxTokens;
        }
        
        // Wert aktualisieren
        luckTokensInput.value = newMaxTokens + '/' + newMaxTokens;
    }

    // Funktion zum Überprüfen und Anwenden des Vernarbt-Vorteils
    function checkVernarbtVorteil() {
        const advantageSelect = document.getElementById('advantage');
        const kpInput = document.getElementById('kp');
        
        // Aktuelle KP-Werte abrufen
        let currentKP = kpInput.value;
        let kpParts = currentKP.split('/');
        let currentValue = parseInt(kpParts[0]) || 0;
        let maxValue = parseInt(kpParts[1]) || 0;
        
        // Basis-KP berechnen (basierend auf der Formel aus updateCombatStats)
        const körperAttribut = parseInt(document.querySelector('.attribute-column:nth-child(1) .main-attribute-value').value) || 1;
        const glückAttribut = parseInt(document.querySelector('.attribute-column:nth-child(4) .main-attribute-value').value) || 1;
        const basisMaxKP = (körperAttribut + körperAttribut + glückAttribut) * 3;
        
        // Standardwerte zurücksetzen (ohne Vernarbt-Bonus)
        let newMaxKP = basisMaxKP;
        let newCurrentKP = currentValue;
        
        // Wenn das aktuelle Maximum anders als das Basis-Maximum ist, haben wir vorher einen Bonus hinzugefügt
        // oder abgezogen, daher passen wir auch den aktuellen Wert an
        if (maxValue !== newMaxKP) {
            // Berechne den Prozentsatz der aktuellen KP im Verhältnis zum Maximum
            const prozentsatz = currentValue / maxValue;
            newCurrentKP = Math.round(newMaxKP * prozentsatz);
        }
        
        // Visuelle Formatierung zurücksetzen
        kpInput.style.color = '';
        kpInput.style.fontWeight = '';
        
        // Prüfen, ob Vernarbt ausgewählt ist
        if (advantageSelect.value === 'vernarbt') {
            // KP um 30 erhöhen
            newMaxKP += 30;
            newCurrentKP += 30; // Wir erhöhen auch die aktuellen KP
            
            // Visuell hervorheben
            kpInput.style.color = '#006400'; // Dunkelgrün
            kpInput.style.fontWeight = 'bold';
        }
        
        // Stellen sicher, dass die aktuellen KP nicht größer als das Maximum sind
        if (newCurrentKP > newMaxKP) {
            newCurrentKP = newMaxKP;
        }
        
        // Wert aktualisieren
        kpInput.value = newCurrentKP + '/' + newMaxKP;
    }

    // Funktion zum Überprüfen und Anwenden des Reich-Vorteils
    function checkReichVorteil() {
        const advantageSelect = document.getElementById('advantage');
        const inventoryContainer = document.getElementById('inventory-container');
        
        // Entferne zusätzliche Item-Slots, falls vorhanden
        const additionalSlots = document.querySelectorAll('.reich-item-slot');
        additionalSlots.forEach(slot => {
            if (slot && slot.parentNode) {
                slot.parentNode.removeChild(slot);
            }
        });
        
        // Prüfen, ob Reich ausgewählt ist
        if (advantageSelect.value === 'reich') {
            // Lade die Items aus dem Item-Service
            const items = itemService.getAllItems();
            
            // Erstelle 3 zusätzliche Item-Slots
            for (let i = 0; i < 3; i++) {
                createReichItemSlot(i, items, inventoryContainer);
            }
        }
    }

    // Hilfsfunktion für benutzerdefinierte Select-Elemente mit Tooltips (für Reich-Vorteil)
    function setupReichCustomSelect(selectElement, items) {
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
                const id = selectElement.id;
                const index = parseInt(id.split('-').pop());
                
                const descriptionInput = document.getElementById(`reich-item-description-${index}`);
                const amountInput = document.getElementById(`reich-item-amount-${index}`);
                
                if (descriptionInput && amountInput) {
                    descriptionInput.value = this.dataset.beschreibung;
                    amountInput.value = this.dataset.anzahl;
                }
                
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
            const id = selectElement.id;
            const index = parseInt(id.split('-').pop());
            
            const descriptionInput = document.getElementById(`reich-item-description-${index}`);
            const amountInput = document.getElementById(`reich-item-amount-${index}`);
            
            if (descriptionInput && amountInput) {
                descriptionInput.value = '';
                amountInput.value = '';
            }
            
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

    // Funktion zum Erstellen eines zusätzlichen Item-Slots für den Reich-Vorteil
    function createReichItemSlot(index, items, inventoryContainer) {
        const slotContainer = document.createElement('div');
        slotContainer.className = 'item-slot reich-item-slot';
        slotContainer.style.backgroundColor = '#f5f5ff'; // Leicht anderer Hintergrund
        slotContainer.style.border = '2px dashed #9370DB'; // Lila als Rahmenfarbe
        slotContainer.style.position = 'relative';
        
        // Select-Container (für das benutzerdefinierte Dropdown)
        const selectContainer = document.createElement('div');
        selectContainer.className = 'custom-select-container';
        
        // Erstelle das select-Element
        const selectElement = document.createElement('select');
        selectElement.className = 'item-select';
        selectElement.id = `reich-item-select-${index}`;
        
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
        descriptionLabel.htmlFor = `reich-item-description-${index}`;
        
        const descriptionInput = document.createElement('textarea');
        descriptionInput.className = 'item-description';
        descriptionInput.id = `reich-item-description-${index}`;
        descriptionInput.readOnly = true;
        descriptionInput.rows = 2;
        
        const amountContainer = document.createElement('div');
        amountContainer.className = 'item-amount-container';
        
        const amountLabel = document.createElement('label');
        amountLabel.textContent = 'Anzahl:';
        amountLabel.htmlFor = `reich-item-amount-${index}`;
        
        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.className = 'item-amount';
        amountInput.id = `reich-item-amount-${index}`;
        amountInput.readOnly = true;
        
        // Hinweis-Label erstellen
        const infoLabel = document.createElement('div');
        infoLabel.style.position = 'absolute';
        infoLabel.style.top = '5px';
        infoLabel.style.right = '10px';
        infoLabel.style.fontSize = '12px';
        infoLabel.style.color = '#666';
        infoLabel.style.fontStyle = 'italic';
        infoLabel.textContent = '(Zusätzlicher Slot durch Vorteil: Reich)';
        
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
        slotContainer.appendChild(infoLabel);
        
        // Slot zum Inventar-Container hinzufügen
        inventoryContainer.appendChild(slotContainer);
        
        // Setup mit benutzerdefinierten Select-Dropdown
        // Wir prüfen, ob wir im Kontext von inventory.js oder klasseEffekte.js sind
        if (typeof setupCustomSelect === 'function') {
            // Wenn die Funktion bereits definiert ist, verwenden wir sie
            setupCustomSelect(selectElement, items);
        } else {
            // Ansonsten implementieren wir die Funktion inline
            setupReichCustomSelect(selectElement, items);
        }
    }
    
    // Hilfsfunktion, um Elemente mit bestimmtem Text zu finden (ähnlich wie jQuery :contains)
    document.querySelectorAll = (function(querySelectorAll) {
        return function(selector) {
            if (selector.includes(':contains')) {
                const matches = selector.match(/:contains\((['"])(.*?)\1\)/);
                if (matches) {
                    const plainSelector = selector.replace(/:contains\((['"])(.*?)\1\)/, '');
                    const searchText = matches[2];
                    const results = [];
                    
                    const elements = querySelectorAll.call(this, plainSelector);
                    for (let i = 0; i < elements.length; i++) {
                        if (elements[i].textContent.includes(searchText)) {
                            results.push(elements[i]);
                        }
                    }
                    
                    return results;
                }
            }
            
            return querySelectorAll.call(this, selector);
        };
    })(document.querySelectorAll);
    
    checkReichVorteil();

    // Referenz zum Vorteile-Select-Element hinzufügen
    const advantageSelect = document.getElementById('advantage');
    
    // Event-Listener für Änderungen am Vorteile-Dropdown hinzufügen
    advantageSelect.addEventListener('change', checkDoppelteKlasse);
    
    // Initiale Prüfung
    setTimeout(function() {
        checkDoppelteKlasse();
    }, 500);
    // Initiale Prüfung
    setTimeout(function() {
        checkFantastischeEignungVorteil();
    }, 500);
    
    // Funktion zum Überprüfen und Anwenden des Doppelte-Klasse-Vorteils
    function checkDoppelteKlasse() {
        const advantageSelect = document.getElementById('advantage');
        const formGridLower = document.querySelector('.form-grid-lower');
        
        // Prüfen, ob bereits ein zweites Klassen-Dropdown existiert
        let secondClassSelect = document.getElementById('second-class');
        let secondClassContainer = document.getElementById('second-class-container');
        
        // Prüfen, ob Doppelte Klasse ausgewählt ist
        if (advantageSelect.value === 'doppelte-klasse') {
            // Wenn noch kein zweites Dropdown existiert, erstellen
            if (!secondClassSelect) {
                // Container für das zweite Dropdown erstellen - als eigene Zeile unter dem form-grid-lower
                secondClassContainer = document.createElement('div');
                secondClassContainer.id = 'second-class-container';
                secondClassContainer.className = 'form-grid';
                secondClassContainer.style.width = '17%'; // Konsistente Breite mit anderen Elementen
                secondClassContainer.style.marginTop = '10px';
                
                // Container für das zweite Dropdown erstellen (einzelne Zelle)
                const classSelectCell = document.createElement('div');
                classSelectCell.style.gridColumn = '1 / span 3'; // Spannen über alle drei Spalten
                
                // Label erstellen
                const label = document.createElement('label');
                label.htmlFor = 'second-class';
                label.textContent = 'Zweite Klasse:';
                
                // Dropdown erstellen
                secondClassSelect = document.createElement('select');
                secondClassSelect.id = 'second-class';
                
                // Platzhalter-Option hinzufügen
                const placeholderOption = document.createElement('option');
                placeholderOption.value = '';
                placeholderOption.textContent = '-- Zweite Klasse auswählen --';
                secondClassSelect.appendChild(placeholderOption);
                
                // Alle Klassen aus dem klasseService holen und hinzufügen
                const klassen = klasseService.getAllKlassen();
                
                // Die aktuelle erste Klasse ermitteln, um sie aus dem zweiten Dropdown auszuschließen
                const firstClassValue = elements.classSelect.value;
                
                klassen.forEach(klasse => {
                    // Überspringen, wenn diese Klasse bereits als erste Klasse ausgewählt ist
                    if (klasse.id === firstClassValue) return;
                    
                    const option = document.createElement('option');
                    option.value = klasse.id;
                    option.textContent = klasse.name;
                    option.dataset.beschreibung = klasse.beschreibung;
                    secondClassSelect.appendChild(option);
                });
                
                // DOM-Struktur zusammensetzen
                classSelectCell.appendChild(label);
                classSelectCell.appendChild(secondClassSelect);
                secondClassContainer.appendChild(classSelectCell);
                
                // Nach dem form-grid-lower einfügen
                formGridLower.parentNode.insertBefore(secondClassContainer, formGridLower.nextSibling);
                
                // Visuelles Highlight
                secondClassContainer.style.animation = 'highlight 2s ease-out';
                secondClassContainer.style.backgroundColor = '#f5f5ff';
                secondClassContainer.style.border = '2px dashed #4169E1';
                secondClassContainer.style.borderRadius = '5px';
                secondClassContainer.style.padding = '8px';
                
                // Dropdown mit Tooltips einrichten
                setupSelectWithTooltips(secondClassSelect, klassen.filter(klasse => klasse.id !== firstClassValue));
                
                // WICHTIG: Das ist der kritische Part - wir entfernen zuerst etwaige bereits existierende Listener
                // Sicherstellen, dass wir den Event-Listener nur einmal hinzufügen
                // Entfernen vorheriger Listener (falls vorhanden) über eine benannte Funktion
                if (elements.classSelect._updateSecondClassHandler) {
                    elements.classSelect.removeEventListener('change', elements.classSelect._updateSecondClassHandler);
                }
                
                // Neue Funktion zum Update definieren und speichern
                elements.classSelect._updateSecondClassHandler = function() {
                    updateSecondClassOptions();
                    // WICHTIG: Diesen Teil entfernen oder auskommentieren um die Rekursion zu verhindern
                    // const event = new Event('change');
                    // this.dispatchEvent(event);
                };
                
                // Event-Listener für Änderungen der ersten Klasse hinzufügen
                elements.classSelect.addEventListener('change', elements.classSelect._updateSecondClassHandler);
                
                // Event-Listener für Änderungen am zweiten Dropdown hinzufügen
                secondClassSelect.addEventListener('change', function() {
                    // Erste Klasse UI aktualisieren
                    updateFirstClassOptions();
                    
                    // Wenn eine zweite Klasse gewählt wurde, entsprechende Effekte aktivieren
                    const selectedClass = this.value;
                    
                    // Vorherige Effekte deaktivieren (falls vorhanden)
                    deactivateSecondClassEffects();
                    
                    if (selectedClass) {
                        // Logik für die zweite Klasse
                        activateSecondClassEffects(selectedClass);
                    }
                });
                
                // Initiale UI-Aktualisierung
                updateClassDropdownUI();
            } else {
                // Falls das zweite Dropdown bereits existiert, aber die erste Klasse geändert wurde,
                // aktualisieren wir die verfügbaren Optionen
                updateSecondClassOptions();
            }
        } else {
            // Wenn Doppelte Klasse nicht gewählt ist, zweites Dropdown und Tooltip entfernen
            if (secondClassContainer) {
                // Bevor wir entfernen, deaktivieren wir eventuelle Klasseneffekte
                deactivateSecondClassEffects();
                
                // Auch die Beschreibung der zweiten Klasse entfernen
                const secondClassTooltip = document.querySelector('[data-for="second-class"]');
                if (secondClassTooltip && secondClassTooltip.parentNode) {
                    secondClassTooltip.parentNode.removeChild(secondClassTooltip);
                }
                
                // Event-Listener für die erste Klasse entfernen
                if (elements.classSelect._updateSecondClassHandler) {
                    elements.classSelect.removeEventListener('change', elements.classSelect._updateSecondClassHandler);
                    elements.classSelect._updateSecondClassHandler = null;
                }
                
                // Container entfernen
                secondClassContainer.remove();
            }
        }
    }
    
    // Funktion zum Aktualisieren der Optionen im zweiten Klassen-Dropdown
    function updateSecondClassOptions() {
        const secondClassSelect = document.getElementById('second-class');
        if (!secondClassSelect) return;
        
        // Die aktuelle erste Klasse ermitteln
        const firstClassValue = elements.classSelect.value;
        
        // Die aktuelle zweite Klasse speichern (sofern sie nicht die gleiche wie die erste Klasse ist)
        const currentSecondClass = secondClassSelect.value;
        const shouldKeepSelection = currentSecondClass && currentSecondClass !== firstClassValue;
        
        // Alle Optionen außer dem Platzhalter entfernen
        while (secondClassSelect.options.length > 1) {
            secondClassSelect.remove(1);
        }
        
        // Alle Klassen neu laden, außer der ersten Klasse
        const klassen = klasseService.getAllKlassen();
        klassen.forEach(klasse => {
            // Überspringen, wenn diese Klasse bereits als erste Klasse ausgewählt ist
            if (klasse.id === firstClassValue) return;
            
            const option = document.createElement('option');
            option.value = klasse.id;
            option.textContent = klasse.name;
            option.dataset.beschreibung = klasse.beschreibung;
            secondClassSelect.appendChild(option);
        });
        
        // Frühere Auswahl wiederherstellen, wenn möglich
        if (shouldKeepSelection) {
            secondClassSelect.value = currentSecondClass;
        } else {
            // Sonst Platzhalter auswählen und Effekte deaktivieren
            secondClassSelect.value = '';
            deactivateSecondClassEffects();
            
            // Tooltip entfernen, falls vorhanden
            const secondClassTooltip = document.querySelector('[data-for="second-class"]');
            if (secondClassTooltip && secondClassTooltip.parentNode) {
                secondClassTooltip.parentNode.removeChild(secondClassTooltip);
            }
        }
        
        // Change-Event auslösen, um UI zu aktualisieren
        const event = new Event('change', { bubbles: true });
        secondClassSelect.dispatchEvent(event);
        
        // UI des ersten Klassen-Dropdowns aktualisieren, um die ausgewählte zweite Klasse auszugrauen
        updateClassDropdownUI();
    }

    function updateFirstClassOptions() {
        // Aktualisiere die UI ohne die Optionen neu zu laden
        updateClassDropdownUI();
    }

    function updateClassDropdownUI() {
        // Zugriff auf beide Klassen-Auswahlen
        const firstClassSelect = elements.classSelect;
        const secondClassSelect = document.getElementById('second-class');
        if (!secondClassSelect) return;
        
        // Die aktuellen Auswahlen ermitteln
        const firstClassValue = firstClassSelect.value;
        const secondClassValue = secondClassSelect.value;
        
        // Graugestaltung der Optionen in beiden Dropdown-UIs
        
        // 1. Für das erste Dropdown (alle Custom-Select-Optionen durchgehen)
        const firstCustomSelect = firstClassSelect.parentNode;
        const firstCustomOptions = firstCustomSelect.querySelectorAll('.custom-select-option');
        
        firstCustomOptions.forEach(option => {
            const classValue = option.dataset.value;
            
            // Option ausgrauen, wenn sie im zweiten Dropdown ausgewählt ist
            if (classValue === secondClassValue && secondClassValue) {
                option.style.color = '#999';
                option.style.backgroundColor = '#f5f5f5';
                option.style.cursor = 'not-allowed';
                option.dataset.disabled = 'true';
            } else {
                // Sonst normales Styling wiederherstellen
                option.style.color = '';
                option.style.backgroundColor = '';
                option.style.cursor = 'pointer';
                option.dataset.disabled = 'false';
            }
        });
        
        // 2. Für das zweite Dropdown (alle Custom-Select-Optionen durchgehen)
        const secondCustomSelect = secondClassSelect.parentNode;
        const secondCustomOptions = secondCustomSelect.querySelectorAll('.custom-select-option');
        
        secondCustomOptions.forEach(option => {
            const classValue = option.dataset.value;
            
            // Option ausgrauen, wenn sie im ersten Dropdown ausgewählt ist
            if (classValue === firstClassValue && firstClassValue) {
                option.style.color = '#999';
                option.style.backgroundColor = '#f5f5f5';
                option.style.cursor = 'not-allowed';
                option.dataset.disabled = 'true';
            } else {
                // Sonst normales Styling wiederherstellen
                option.style.color = '';
                option.style.backgroundColor = '';
                option.style.cursor = 'pointer';
                option.dataset.disabled = 'false';
            }
        });
    }
    
    // Funktion zum Aktivieren der Effekte der zweiten Klasse
    function activateSecondClassEffects(classId) {
        // Hier implementieren wir die speziellen Effekte der zweiten Klasse
        // Ähnlich wie in klasseEffekte.js, aber wir markieren die Elemente als "second-class-effect"
        
        switch(classId) {
            case 'angler':
                addSecondClassItem('angler');
                applySecondClassFertigkeitsBoni('angler');
                break;
            case 'biker':
                addSecondClassItem('biker');
                break;
            case 'feuerspucker':
                addSecondClassAttacken('feuerspucker');
                break;
            case 'schwarzgurt':
                addSecondClassAttacken('schwarzgurt');
                break;
            case 'forscher':
                applySecondClassFertigkeitsBoni('forscher');
                break;
            case 'schwimmer':
                applySecondClassFertigkeitsBoni('schwimmer');
                break;
            case 'schoenheit':
                applySecondClassFertigkeitsBoni('schoenheit');
                break;
            case 'gentleman-lady':
                addSecondClassAdditionalItems(3);
                break;
            case 'hexe':
                addSecondClassItem('hexe');
                break;
            case 'kuenstler':
                addSecondClassItem('kuenstler');
                break;
            case 'ninjajunge':
                addSecondClassItem('ninjajunge');
                break;
        }
    }
    
    // Funktion zum Deaktivieren der Effekte der zweiten Klasse
    function deactivateSecondClassEffects() {
        // Alle Elemente entfernen, die mit der zweiten Klasse zusammenhängen
        document.querySelectorAll('.second-class-effect').forEach(element => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        
        // Alle Fertigkeitsboni entfernen
        document.querySelectorAll('.second-class-bonus').forEach(element => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }
    
    // Spezielle Items für Klassen (aus klasseEffekte.js)
    const SECOND_CLASS_SPECIAL_ITEMS = {
        angler: {
            name: "Angel (2. Klasse)",
            beschreibung: "Damit kann man angeln!",
            anzahl: 1
        },
        biker: {
            name: "Klapp-Fahrrad (2. Klasse)",
            beschreibung: "Ein sehr leichtes, kompaktes Fahrrad. Sehr stabil. Schafft maximal 50km/h.",
            anzahl: 1
        },
        hexe: {
            name: "Kristallkugel (2. Klasse)",
            beschreibung: "Wenn du dir deine Umgebung durch die Kristallkugel hindurch anschaust, kannst du sie in der Vergangenheit sehen. Beispiel: Du kommst an eine eingestürzte Brücke. Durch den Blick in die Kristallkugel kannst du den Moment sehen, in dem sie eingestürzt ist, findest also das Warum heraus.",
            anzahl: 1
        },
        kuenstler: {
            name: "Leinwand und Farben (2. Klasse)",
            beschreibung: "Kann benutzt werden, um eine Attacke zu bannen.",
            anzahl: 1
        },
        ninjajunge: {
            name: "5 Rauchbomben (2. Klasse)",
            beschreibung: "Rauchbomben, die auf den ersten Blick aussehen wie Pokebälle. Wenn sie (nach einem Wurf) auf dem Boden aufschlagen, platzen sie auf und entlassen dicken, lilanen Qualm.",
            anzahl: 5
        }
    };
    
    // Fertigkeitsboni für Klassen (aus klasseEffekte.js)
    const SECOND_CLASS_FERTIGKEITS_BONI = {
        angler: [
            { fertigkeit: "Angeln", bonus: 1 }
        ],
        forscher: [
            { fertigkeit: "Gefahreninstinkt", bonus: 1 },
            { fertigkeit: "Naturwissenschaften", bonus: 1 },
            { fertigkeit: "Orientierung", bonus: 1 },
            { fertigkeit: "Wildnisleben/Survival", bonus: 1 }
        ],
        schwimmer: [
            { fertigkeit: "Schwimmen", bonus: 2 }
        ],
        schoenheit: [
            { fertigkeit: "Betören", bonus: 1 }
        ]
    };
    
    // Attacken-Texte für Klassen (aus klasseEffekte.js)
    const SECOND_CLASS_ATTACKEN_TEXTE = {
        feuerspucker: "<strong style='color: #FF4500;'>Flammenwurf (2. Klasse)</strong>. <span style='color: #FF4500;'>Typ Feuer</span>. Schaden: 9W6.<br>Bei 3 oder mehr Erfolgen wird das Ziel verbrannt. Diese Attacke kann nur einmal alle zwei Runden eingesetzt werden.",
        schwarzgurt: "<strong style='color: #A0522D;'>Karateschlag (2. Klasse)</strong>. <span style='color: #A0522D;'>Typ Kampf</span>. Schaden: 5W6.<br>Erzielt bei 2 oder mehr Erfolgen einen kritischen Treffer.<br><br><strong style='color: #A0522D;'>Scanner (2. Klasse)</strong>. <span style='color: #A0522D;'>Typ Kampf</span>, kein Schaden.<br>Du weichst der nächsten physischen Attacke, die dich innerhalb der nächsten 2 Runden treffen würde und die du sehen kannst, automatisch aus."
    };
    
    // Implementierung der Funktionen für die zweite Klasse
    function addSecondClassItem(classId) {
        if (!SECOND_CLASS_SPECIAL_ITEMS[classId]) return;
        
        const item = SECOND_CLASS_SPECIAL_ITEMS[classId];
        const inventoryContainer = document.getElementById('inventory-container');
        
        // Slot Container erstellen
        const itemSlot = document.createElement('div');
        itemSlot.className = 'item-slot second-class-effect';
        itemSlot.style.backgroundColor = '#e6f7ff'; // Leicht blauer Hintergrund zur Kennzeichnung
        itemSlot.style.border = '2px dashed #1E90FF'; // Königsblau als Rahmenfarbe
        itemSlot.style.position = 'relative';
        
        // Item-Name Container
        const nameContainer = document.createElement('div');
        nameContainer.className = 'item-name-container';
        
        const nameLabel = document.createElement('div');
        nameLabel.textContent = 'Item (Zweite Klasse):';
        nameLabel.style.fontWeight = 'bold';
        nameLabel.style.color = '#1E90FF';
        
        const nameValue = document.createElement('div');
        nameValue.textContent = item.name;
        nameValue.style.fontSize = '16px';
        nameValue.style.padding = '8px';
        nameValue.style.backgroundColor = '#e6f7ff';
        nameValue.style.borderRadius = '4px';
        nameValue.style.marginTop = '5px';
        
        // Beschreibung Container
        const descriptionContainer = document.createElement('div');
        descriptionContainer.className = 'item-description-container';
        
        const descriptionLabel = document.createElement('label');
        descriptionLabel.textContent = 'Beschreibung:';
        
        const descriptionInput = document.createElement('textarea');
        descriptionInput.className = 'item-description';
        descriptionInput.readOnly = true;
        descriptionInput.value = item.beschreibung;
        descriptionInput.rows = 2;
        
        // Anzahl Container
        const amountContainer = document.createElement('div');
        amountContainer.className = 'item-amount-container';
        
        const amountLabel = document.createElement('label');
        amountLabel.textContent = 'Anzahl:';
        
        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.className = 'item-amount';
        amountInput.readOnly = true;
        amountInput.value = item.anzahl;
        
        // Hinweis-Label erstellen
        const infoLabel = document.createElement('div');
        infoLabel.style.position = 'absolute';
        infoLabel.style.top = '5px';
        infoLabel.style.right = '10px';
        infoLabel.style.fontSize = '12px';
        infoLabel.style.color = '#666';
        infoLabel.style.fontStyle = 'italic';
        infoLabel.textContent = '(Zweite Klasse)';
        
        // DOM-Struktur zusammensetzen
        nameContainer.appendChild(nameLabel);
        nameContainer.appendChild(nameValue);
        
        descriptionContainer.appendChild(descriptionLabel);
        descriptionContainer.appendChild(descriptionInput);
        
        amountContainer.appendChild(amountLabel);
        amountContainer.appendChild(amountInput);
        
        itemSlot.appendChild(nameContainer);
        itemSlot.appendChild(descriptionContainer);
        itemSlot.appendChild(amountContainer);
        itemSlot.appendChild(infoLabel);
        
        // Prüfen, ob es ein Item von der ersten Klasse gibt
        const firstClassItem = document.querySelector('.special-item-slot');
        
        // NEUE LOGIK: Slot an der korrekten Position einfügen:
        // - Nach dem ersten Klassen-Item, falls vorhanden
        // - Oder am Anfang des Inventars, falls kein erstes Klassen-Item existiert
        if (firstClassItem) {
            // Nach dem ersten Klassen-Item einfügen
            if (firstClassItem.nextSibling) {
                inventoryContainer.insertBefore(itemSlot, firstClassItem.nextSibling);
            } else {
                inventoryContainer.appendChild(itemSlot);
            }
        } else {
            // Am Anfang des Inventars einfügen
            if (inventoryContainer.firstChild) {
                inventoryContainer.insertBefore(itemSlot, inventoryContainer.firstChild);
            } else {
                inventoryContainer.appendChild(itemSlot);
            }
        }
    }
    
    function applySecondClassFertigkeitsBoni(classId) {
        if (!SECOND_CLASS_FERTIGKEITS_BONI[classId]) return;
        
        // Für jeden definierten Bonus
        SECOND_CLASS_FERTIGKEITS_BONI[classId].forEach(boni => {
            // Alle Attribute-Items durchsuchen
            const attributeItems = document.querySelectorAll('.attribute-item');
            
            // Manuell filtern, welche davon den Fertigkeitsnamen enthalten
            Array.from(attributeItems).forEach(element => {
                // Überprüfen, ob das Element den Text der gesuchten Fertigkeit enthält
                const elementText = element.textContent.trim();
                if (elementText.includes(boni.fertigkeit)) {
                    // Erstelle Bonus-Element
                    const bonusElement = document.createElement('span');
                    bonusElement.className = 'second-class-bonus';
                    bonusElement.textContent = ` +${boni.bonus} E`;
                    bonusElement.style.color = '#1E90FF'; // Blau für zweite Klasse
                    bonusElement.style.fontWeight = 'bold';
                    
                    // Füge Bonus-Element nach dem Input-Element ein
                    const inputElement = element.querySelector('input');
                    if (inputElement) {
                        // Füge nach dem Input-Element ein
                        if (inputElement.nextSibling) {
                            element.insertBefore(bonusElement, inputElement.nextSibling);
                        } else {
                            element.appendChild(bonusElement);
                        }
                    }
                }
            });
        });
    }
    
    function addSecondClassAttacken(classId) {
        if (!SECOND_CLASS_ATTACKEN_TEXTE[classId]) return;
        
        const container = document.querySelector('.container');
        
        // Neuen Abschnitt für Attacken erstellen
        const attackenSection = document.createElement('div');
        attackenSection.className = 'attacken-section second-class-effect';
        attackenSection.style.marginTop = '30px';
        attackenSection.style.borderTop = '1px solid #eee';
        attackenSection.style.paddingTop = '20px';
        
        // Überschrift erstellen
        const heading = document.createElement('h2');
        heading.textContent = 'Trainer-Attacken (Zweite Klasse)';
        heading.style.textAlign = 'center';
        heading.style.marginBottom = '20px';
        heading.style.color = '#1E90FF'; // Blau für zweite Klasse
        
        // Container für die Attacken erstellen
        const attackenContainer = document.createElement('div');
        attackenContainer.style.backgroundColor = '#e6f7ff'; // Blauer Hintergrund für zweite Klasse
        attackenContainer.style.border = '2px solid #1E90FF';
        attackenContainer.style.borderRadius = '8px';
        attackenContainer.style.padding = '15px';
        attackenContainer.style.maxWidth = '900px';
        attackenContainer.style.margin = '0 auto';
        attackenContainer.style.position = 'relative';
        
        // Div für HTML-Unterstützung
        const attackenDiv = document.createElement('div');
        attackenDiv.className = 'attacken-text';
        attackenDiv.innerHTML = SECOND_CLASS_ATTACKEN_TEXTE[classId];
        attackenDiv.style.width = '100%';
        attackenDiv.style.minHeight = '150px';
        attackenDiv.style.padding = '10px';
        attackenDiv.style.fontSize = '14px';
        attackenDiv.style.border = '1px solid #ccc';
        attackenDiv.style.borderRadius = '4px';
        attackenDiv.style.backgroundColor = '#fff';
        attackenDiv.style.overflowY = 'auto';
        attackenDiv.style.lineHeight = '1.5';
        
        // Hinweis-Label erstellen
        const infoLabel = document.createElement('div');
        infoLabel.style.position = 'absolute';
        infoLabel.style.top = '10px';
        infoLabel.style.right = '15px';
        infoLabel.style.fontSize = '12px';
        infoLabel.style.color = '#666';
        infoLabel.style.fontStyle = 'italic';
        infoLabel.textContent = '(Zweite Klasse)';
        
        // DOM-Struktur zusammensetzen
        attackenContainer.appendChild(attackenDiv);
        attackenContainer.appendChild(infoLabel);
        
        attackenSection.appendChild(heading);
        attackenSection.appendChild(attackenContainer);
        
        try {
            // Bestimme die Position für die Attacken-Sektion
            // Suche zuerst nach einer bestehenden Attacken-Sektion
            const existingAttackenSection = document.querySelector('.attacken-section');
            
            if (existingAttackenSection) {
                // Füge nach der bestehenden Attacken-Sektion ein
                if (existingAttackenSection.nextSibling) {
                    container.insertBefore(attackenSection, existingAttackenSection.nextSibling);
                } else {
                    container.appendChild(attackenSection);
                }
            } else {
                // Platzierung wie in der ursprünglichen Funktion
                const footer = document.querySelector('.footer');
                if (footer) {
                    container.insertBefore(attackenSection, footer);
                } else {
                    // Fallback: Ans Ende des Containers hinzufügen
                    container.appendChild(attackenSection);
                }
            }
        } catch (error) {
            console.error('Fehler beim Einfügen der Attacken-Sektion (Zweite Klasse):', error);
            
            // Fallback: Direkt an den Container anhängen
            container.appendChild(attackenSection);
        }
    }

    // Funktion zum Hinzufügen zusätzlicher Item-Slots für die zweite Klasse (Gentleman/Lady)
    function addSecondClassAdditionalItems(count) {
        // Lade die Items aus dem Item-Service
        const items = itemService.getAllItems();
        const inventoryContainer = document.getElementById('inventory-container');
        
        // Erstelle die angegebene Anzahl an zusätzlichen Item-Slots
        for (let i = 0; i < count; i++) {
            const slotContainer = document.createElement('div');
            slotContainer.className = 'item-slot second-class-effect';
            slotContainer.style.backgroundColor = '#e6f7ff'; // Blauer Hintergrund für zweite Klasse
            slotContainer.style.border = '2px dashed #1E90FF'; // Blauer Rahmen für zweite Klasse
            slotContainer.style.position = 'relative';
            
            // Select-Container (für das benutzerdefinierte Dropdown)
            const selectContainer = document.createElement('div');
            selectContainer.className = 'custom-select-container';
            
            // Erstelle das select-Element
            const selectElement = document.createElement('select');
            selectElement.className = 'item-select';
            selectElement.id = `second-class-item-select-${i}`;
            
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
            descriptionLabel.htmlFor = `second-class-item-description-${i}`;
            
            const descriptionInput = document.createElement('textarea');
            descriptionInput.className = 'item-description';
            descriptionInput.id = `second-class-item-description-${i}`;
            descriptionInput.readOnly = true;
            descriptionInput.rows = 2;
            
            const amountContainer = document.createElement('div');
            amountContainer.className = 'item-amount-container';
            
            const amountLabel = document.createElement('label');
            amountLabel.textContent = 'Anzahl:';
            amountLabel.htmlFor = `second-class-item-amount-${i}`;
            
            const amountInput = document.createElement('input');
            amountInput.type = 'number';
            amountInput.className = 'item-amount';
            amountInput.id = `second-class-item-amount-${i}`;
            amountInput.readOnly = true;
            
            // Hinweis-Label erstellen
            const infoLabel = document.createElement('div');
            infoLabel.style.position = 'absolute';
            infoLabel.style.top = '5px';
            infoLabel.style.right = '10px';
            infoLabel.style.fontSize = '12px';
            infoLabel.style.color = '#666';
            infoLabel.style.fontStyle = 'italic';
            infoLabel.textContent = '(Zusätzlicher Slot durch zweite Klasse)';
            
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
            slotContainer.appendChild(infoLabel);
            
            // Slot zum Inventar-Container hinzufügen
            inventoryContainer.appendChild(slotContainer);
            
            // Setup mit benutzerdefinierten Select-Dropdown
            if (typeof setupReichCustomSelect === 'function') {
                setupReichCustomSelect(selectElement, items);
            } else if (typeof setupCustomSelect === 'function') {
                setupCustomSelect(selectElement, items);
            }
        }
    }
});

document.getElementById('advantage').addEventListener('change', function() {
    checkGlueckspilzVorteil();
    checkVernarbtVorteil();
    checkReichVorteil();
    checkFantastischeEignungVorteil();
});