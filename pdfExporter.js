// pdfExporter.js - Modul zum Exportieren des Charakters als PDF

document.addEventListener('DOMContentLoaded', function() {
    // HTML-Element für den Export-Button erstellen
    const exportButton = document.createElement('button');
    exportButton.className = 'download-btn';
    exportButton.id = 'export-pdf-btn';
    exportButton.textContent = 'Charakter als PDF exportieren';
    
    // Container für den Button erstellen (für besseres Styling)
    const exportContainer = document.createElement('div');
    exportContainer.className = 'pdf-export-container';
    exportContainer.appendChild(exportButton);
    
    // Button zum Container hinzufügen (vor dem Footer)
    const container = document.querySelector('.container');
    const footer = document.querySelector('.footer');
    
    if (container) {
        if (footer) {
            container.insertBefore(exportContainer, footer);
        } else {
            container.appendChild(exportContainer);
        }
    }
    
    // Styles für den Button hinzufügen
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .pdf-export-container {
            width: 100%;
            display: flex;
            justify-content: center;
            margin: 30px 0;
        }
        
        #export-pdf-btn {
            background-color: #4CAF50;
            color: white;
            font-size: 16px;
            font-weight: bold;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.3s;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        #export-pdf-btn:hover {
            background-color: #45a049;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        #export-pdf-btn:active {
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        #pdf-progress-container {
            z-index: 9999;
        }
    `;
    document.head.appendChild(styleElement);
    
    // Event-Listener für den Export-Button
    exportButton.addEventListener('click', function() {
        // Bibliotheken laden und dann PDF erzeugen
        ensureRequiredScriptsLoaded().then(() => {
            exportCharacterToPDF();
        });
    });
    
    // Hauptfunktion zum Exportieren des Charakters
    function exportCharacterToPDF() {
        // Button ausblenden während der Generierung
        document.getElementById('export-pdf-btn').style.display = 'none';
        
        // Fortschrittsanzeige erstellen
        const progressContainer = document.createElement('div');
        progressContainer.id = 'pdf-progress-container';
        progressContainer.style.position = 'fixed';
        progressContainer.style.top = '50%';
        progressContainer.style.left = '50%';
        progressContainer.style.transform = 'translate(-50%, -50%)';
        progressContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        progressContainer.style.padding = '20px';
        progressContainer.style.borderRadius = '10px';
        progressContainer.style.zIndex = '9999';
        progressContainer.style.color = 'white';
        progressContainer.style.textAlign = 'center';
        progressContainer.innerHTML = '<p>PDF wird generiert...</p><div class="progress-bar" style="width: 100%; height: 20px; background-color: #444; border-radius: 10px; overflow: hidden;"><div class="progress" style="width: 0%; height: 100%; background-color: #4CAF50; transition: width 0.3s;"></div></div>';
        document.body.appendChild(progressContainer);

        // Funktion zum Aktualisieren der Fortschrittsanzeige
        function updateProgress(percent) {
            const progressBar = document.querySelector('#pdf-progress-container .progress');
            if (progressBar) {
                progressBar.style.width = `${percent}%`;
            }
        }
        
        // PDF-Konfiguration
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // PDF-Maße
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10; // Seitenränder in mm
        const contentWidth = pageWidth - (margin * 2);
        
        // Farbkonfigurationen und Stile
        const colors = {
            primary: [76, 175, 80], // Grün
            secondary: [33, 33, 33], // Dunkelgrau
            lightGray: [200, 200, 200], // Hellgrau für Linien
            white: [255, 255, 255] // Weiß
        };
        
        // Zustandsvariablen
        let currentY = margin;
        let currentPage = 1;
        
        // Daten sammeln
        const characterData = collectCharacterData();
        
        // Überprüfen, ob die Daten erfolgreich gesammelt wurden
        if (!characterData) {
            alert("Fehler beim Sammeln der Charakterdaten.");
            document.getElementById('export-pdf-btn').style.display = 'block';
            document.body.removeChild(progressContainer);
            return;
        }
        
        // Fortschritt aktualisieren
        updateProgress(10);
        
        // 1. Seite: Charakterübersicht
        createFirstPage(doc, characterData);
        
        // Fortschritt aktualisieren
        updateProgress(30);
        
        // 2. Seite: Attribute und Fertigkeiten
        doc.addPage();
        currentY = margin;
        currentPage = 2;
        createSecondPage(doc, characterData);
        
        // Fortschritt aktualisieren
        updateProgress(60);
        
        // 3. Seite: Inventar, Attacken und Sonstiges
        doc.addPage();
        currentY = margin;
        currentPage = 3;
        createThirdPage(doc, characterData);
        
        // Fortschritt aktualisieren
        updateProgress(80);
        
        // Seitenzahlen hinzufügen
        for (let i = 1; i <= doc.getNumberOfPages(); i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Seite ${i} von ${doc.getNumberOfPages()}`, pageWidth - 25, pageHeight - 10);
        }
        
        // Fortschritt aktualisieren
        updateProgress(90);
        
        // PDF speichern und herunterladen
        const characterName = characterData.name || 'Charakter';
        const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const filename = `Pokemon-Triaden_${characterName}_${timestamp}.pdf`;
        
        // Fortschrittsanzeige entfernen und Button wieder anzeigen
        setTimeout(function() {
            doc.save(filename);
            document.body.removeChild(progressContainer);
            document.getElementById('export-pdf-btn').style.display = 'block';
        }, 500);
        
        // Fortschritt aktualisieren
        updateProgress(100);
        
        // Funktion zur Erstellung der ersten Seite (Übersicht)
        function createFirstPage(doc, data) {
            // Titel
            doc.setFontSize(24);
            doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
            doc.setFont(undefined, 'bold');
            centerText(doc, "Pokémon Triaden - Charakterbogen", margin, currentY, contentWidth);
            currentY += 12;
            
            // Trennlinie
            drawLine(doc, margin, currentY, pageWidth - margin, currentY, colors.lightGray);
            currentY += 8;
            
            // Hauptinformationen
            doc.setFontSize(16);
            doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
            doc.text(`Name: ${data.name || 'N/A'}`, margin, currentY);
            currentY += 8;
            
            doc.setFontSize(14);
            doc.text(`Spieler: ${data.player || 'N/A'}`, margin, currentY);
            currentY += 7;
            
            doc.text(`Alter: ${data.age || 'N/A'}`, margin, currentY);
            currentY += 10;
            
            // Klasse, Vorteil, Nachteil
            createInfoBox(doc, [
                { label: "Klasse", value: data.klasse || 'N/A' },
                { label: "Vorteil", value: data.vorteil || 'N/A' },
                { label: "Nachteil", value: data.nachteil || 'N/A' }
            ], margin, currentY, contentWidth);
            currentY += 34; // Höhe der Box
            
            // Charakterbild
            if (data.image) {
                try {
                    // Charakterbild einfügen
                    const imgWidth = 60;
                    const imgHeight = 80;
                    const imgX = pageWidth - margin - imgWidth;
                    const imgY = 40; // Position auf der ersten Seite
                    
                    doc.addImage(data.image, 'JPEG', imgX, imgY, imgWidth, imgHeight);
                    
                    // Rahmen um das Bild
                    doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
                    doc.setLineWidth(0.5);
                    doc.rect(imgX, imgY, imgWidth, imgHeight);
                } catch (e) {
                    console.error("Fehler beim Hinzufügen des Bildes:", e);
                }
            }
            
            // Kampfwerte
            currentY += 5;
            doc.setFontSize(16);
            doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
            doc.setFont(undefined, 'bold');
            doc.text("Kampfwerte", margin, currentY);
            currentY += 8;
            
            doc.setFont(undefined, 'normal');
            doc.setFontSize(12);
            doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
            
            // Kampfwerte-Daten
            const combatValues = [
                { label: "GENA", value: data.combatStats.gena || '1' },
                { label: "PA", value: data.combatStats.pa || '1' },
                { label: "KP", value: data.combatStats.kp || '1/1' },
                { label: "INIT", value: data.combatStats.init || '1' },
                { label: "BW", value: data.combatStats.bw || '1' },
                { label: "Glücks-Tokens", value: data.combatStats.luckTokens || '1/1' }
            ];
            
            // Manuelle Tabellenerstellung für Kampfwerte
            const combatColWidth = contentWidth / 3;
            const combatRowHeight = 12;
            
            for (let i = 0; i < combatValues.length; i += 3) {
                const rowY = currentY + Math.floor(i / 3) * combatRowHeight;
                
                for (let j = 0; j < 3 && i + j < combatValues.length; j++) {
                    const cellX = margin + j * combatColWidth;
                    const item = combatValues[i + j];
                    
                    // Zelle zeichnen
                    doc.setFillColor(245, 245, 245);
                    doc.rect(cellX, rowY, combatColWidth - 2, combatRowHeight, 'F');
                    
                    doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
                    doc.rect(cellX, rowY, combatColWidth - 2, combatRowHeight);
                    
                    // Label und Wert zeichnen
                    doc.setTextColor(0, 0, 0);
                    doc.setFont(undefined, 'bold');
                    doc.text(item.label, cellX + 2, rowY + 5);
                    
                    doc.setFont(undefined, 'normal');
                    doc.text(item.value, cellX + 2, rowY + combatRowHeight - 2);
                }
            }
            
            currentY += 25; // Höhe der Tabelle
            
            // Wunden-Tracker
            currentY += 10;
            doc.setFontSize(16);
            doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
            doc.text("Wunden", margin, currentY);
            currentY += 8;
            
            // Wunden-Kreise
            const woundCircleRadius = 5;
            const circleSpacing = 12;
            let circleX = margin + woundCircleRadius;
            
            doc.setDrawColor(139, 0, 0); // Dunkelrot
            doc.setFillColor(255, 255, 255);
            
            for (let i = 1; i <= 10; i++) {
                // Bei Index 10 einen Schädel statt einer Zahl
                if (i === 10) {
                    doc.setFillColor(139, 0, 0);
                } else {
                    // Kreis füllen, wenn die Wunde aktiv ist
                    if (i <= data.wounds) {
                        doc.setFillColor(139, 0, 0);
                    } else {
                        doc.setFillColor(255, 255, 255);
                    }
                }
                
                // Kreis zeichnen
                doc.circle(circleX, currentY, woundCircleRadius, 'FD');
                
                // Nummer im Kreis
                doc.setTextColor(i <= data.wounds || i === 10 ? 255 : 0, 0, 0);
                doc.setFontSize(8);
                
                // Schädel für den 10. Kreis
                if (i === 10) {
                    doc.text("☠", circleX - 2, currentY + 2);
                } else {
                    // Zentriere die Zahl im Kreis
                    const textWidth = doc.getStringUnitWidth(`${i}`) * 8 / doc.internal.scaleFactor;
                    doc.text(`${i}`, circleX - (textWidth / 2), currentY + 2);
                }
                
                // X-Position für den nächsten Kreis
                circleX += circleSpacing;
            }
            
            currentY += 20; // Platz nach den Wunden-Kreisen
            
            // Beschreibungen zur Klasse, Vorteil und Nachteil
            if (data.klasseBeschreibung || data.vorteilBeschreibung || data.nachteilBeschreibung) {
                doc.setFontSize(16);
                doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                doc.text("Beschreibungen", margin, currentY);
                currentY += 8;
                
                doc.setFontSize(12);
                doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
                
                if (data.klasseBeschreibung) {
                    doc.setFont(undefined, 'bold');
                    doc.text("Klasse:", margin, currentY);
                    currentY += 6;
                    doc.setFont(undefined, 'normal');
                    const klasseLines = doc.splitTextToSize(data.klasseBeschreibung, contentWidth);
                    doc.text(klasseLines, margin, currentY);
                    currentY += klasseLines.length * 6 + 5;
                }
                
                if (data.vorteilBeschreibung) {
                    doc.setFont(undefined, 'bold');
                    doc.text("Vorteil:", margin, currentY);
                    currentY += 6;
                    doc.setFont(undefined, 'normal');
                    const vorteilLines = doc.splitTextToSize(data.vorteilBeschreibung, contentWidth);
                    doc.text(vorteilLines, margin, currentY);
                    currentY += vorteilLines.length * 6 + 5;
                }
                
                if (data.nachteilBeschreibung) {
                    doc.setFont(undefined, 'bold');
                    doc.text("Nachteil:", margin, currentY);
                    currentY += 6;
                    doc.setFont(undefined, 'normal');
                    const nachteilLines = doc.splitTextToSize(data.nachteilBeschreibung, contentWidth);
                    doc.text(nachteilLines, margin, currentY);
                    currentY += nachteilLines.length * 6 + 5;
                }
            }
            
            // Prüfungsnoten, falls vorhanden
            if (data.grades && data.grades.length > 0) {
                // Überprüfen, ob genug Platz auf der Seite ist
                if (currentY + 60 > pageHeight - margin) { // 60 ist eine Schätzung für die Tabellenhöhe
                    doc.addPage();
                    currentY = margin;
                }
                
                doc.setFontSize(16);
                doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                doc.text("Prüfungsnoten", margin, currentY);
                currentY += 8;
                
                // Tabelle für Prüfungsnoten
                createGradesTable(doc, data.grades, margin, currentY, contentWidth);
                currentY += 6 * data.grades.length + 10; // Höhe pro Zeile + Header
            }
            
            // Typ-Meisterschaften, falls vorhanden
            if (data.typeMasteries && data.typeMasteries.length > 0) {
                // Überprüfen, ob genug Platz auf der Seite ist
                if (currentY + 60 > pageHeight - margin) { // 60 ist eine Schätzung für die Tabellenhöhe
                    doc.addPage();
                    currentY = margin;
                }
                
                doc.setFontSize(16);
                doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                doc.text("Typ-Meisterschaften", margin, currentY);
                currentY += 8;
                
                doc.setFontSize(12);
                doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
                
                // Lieblingstyp hervorheben
                if (data.favoriteType) {
                    doc.setFont(undefined, 'bold');
                    doc.text(`Lieblingstyp: ${data.favoriteType}`, margin, currentY);
                    doc.setFont(undefined, 'normal');
                    currentY += 8;
                }
                
                // Tabelle für Typ-Meisterschaften
                createTypeMasteriesTable(doc, data.typeMasteries, margin, currentY, contentWidth);
                currentY += 12 * Math.ceil(data.typeMasteries.length / 3) + 10; // Höhe pro Zeile mit 3 Typen pro Zeile
            }
        }
        
        // Funktion zur Erstellung der zweiten Seite (Attribute und Fertigkeiten)
        function createSecondPage(doc, data) {
            // Titel
            doc.setFontSize(20);
            doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
            doc.setFont(undefined, 'bold');
            doc.text("Attribute und Fertigkeiten", margin, currentY);
            currentY += 10;
            
            // Trennlinie
            drawLine(doc, margin, currentY, pageWidth - margin, currentY, colors.lightGray);
            currentY += 8;
            
            // Hauptattribute und Fertigkeiten - VERBESSERTE PLATZIERUNG
            // Hier ändern wir die Logik, um die Spalten besser zu platzieren
            const attributeColumns = ['KÖ', 'WI', 'CH', 'GL'];
            const numColumns = 2; // Wir behalten 2 Spalten bei
            const columnWidth = contentWidth / numColumns;
            
            // Startposition für jede Spalte
            const columnX = [
                margin,                  // Spalte 1 (KÖ)
                margin + columnWidth,    // Spalte 2 (WI)
                margin,                  // Spalte 3 (CH)
                margin + columnWidth,    // Spalte 4 (GL)
            ];
            
            // Startposition für jede Zeile
            const rowY = [
                currentY,                // Zeile 1 (KÖ und WI)
                currentY                 // Wird später dynamisch berechnet für Zeile 2 (CH und GL)
            ];
            
            // Wir verarbeiten erst KÖ und WI in der ersten Zeile
            let maxHeightFirstRow = 0;
            for (let i = 0; i < 2; i++) {
                // Attributname und Wert
                const attrKey = attributeColumns[i].toLowerCase();
                const attrValue = data.attributes[attrKey] || 1;
                
                doc.setFontSize(14);
                doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                doc.setFont(undefined, 'bold');
                doc.text(`${attributeColumns[i]}: ${attrValue}`, columnX[i], rowY[0]);
                
                // Fertigkeiten für dieses Attribut
                const skills = data.skills.filter(skill => skill.attribute === attributeColumns[i]);
                
                doc.setFontSize(11);
                doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
                doc.setFont(undefined, 'normal');
                
                let localY = rowY[0] + 8; // 8mm Abstand nach dem Attributnamen
                
                for (const skill of skills) {
                    // Überprüfen, ob genug Platz auf der Seite ist
                    if (localY + 6 > pageHeight - margin) {
                        doc.addPage();
                        localY = margin;
                    }
                    
                    // Fertigkeit und Wert
                    doc.text(`${skill.name}: ${skill.value}`, columnX[i], localY);
                    
                    // Klassenbonus, falls vorhanden
                    if (skill.bonus) {
                        doc.setTextColor(0, 100, 0); // Dunkelgrün für Bonus
                        doc.text(`+${skill.bonus} E`, columnX[i] + doc.getStringUnitWidth(`${skill.name}: ${skill.value} `) * doc.getFontSize() / doc.internal.scaleFactor, localY);
                        doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
                    }
                    
                    localY += 6;
                }
                
                // Finde die maximale Höhe der ersten Zeile
                maxHeightFirstRow = Math.max(maxHeightFirstRow, localY - rowY[0]);
            }
            
            // Berechne die Startposition für die zweite Zeile (CH und GL)
            // Füge einen Abstand von 10mm hinzu
            rowY[1] = rowY[0] + maxHeightFirstRow + 10;
            
            // Jetzt verarbeiten wir CH und GL in der zweiten Zeile
            for (let i = 2; i < 4; i++) {
                // Attributname und Wert
                const attrKey = attributeColumns[i].toLowerCase();
                const attrValue = data.attributes[attrKey] || 1;
                
                doc.setFontSize(14);
                doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                doc.setFont(undefined, 'bold');
                doc.text(`${attributeColumns[i]}: ${attrValue}`, columnX[i-2], rowY[1]);
                
                // Fertigkeiten für dieses Attribut
                const skills = data.skills.filter(skill => skill.attribute === attributeColumns[i]);
                
                doc.setFontSize(11);
                doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
                doc.setFont(undefined, 'normal');
                
                let localY = rowY[1] + 8; // 8mm Abstand nach dem Attributnamen
                
                for (const skill of skills) {
                    // Überprüfen, ob genug Platz auf der Seite ist
                    if (localY + 6 > pageHeight - margin) {
                        doc.addPage();
                        localY = margin;
                    }
                    
                    // Fertigkeit und Wert
                    doc.text(`${skill.name}: ${skill.value}`, columnX[i-2], localY);
                    
                    // Klassenbonus, falls vorhanden
                    if (skill.bonus) {
                        doc.setTextColor(0, 100, 0); // Dunkelgrün für Bonus
                        doc.text(`+${skill.bonus} E`, columnX[i-2] + doc.getStringUnitWidth(`${skill.name}: ${skill.value} `) * doc.getFontSize() / doc.internal.scaleFactor, localY);
                        doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
                    }
                    
                    localY += 6;
                }
                
                // Aktualisiere die aktuelle Y-Position für die nächste Sektion
                currentY = Math.max(currentY, localY + 10);
            }
        }
        
        // Funktion zur Erstellung der dritten Seite (Inventar, Attacken, etc.)
        function createThirdPage(doc, data) {
            // Titel
            doc.setFontSize(20);
            doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
            doc.setFont(undefined, 'bold');
            doc.text("Inventar und Attacken", margin, currentY);
            currentY += 10;
            
            // Trennlinie
            drawLine(doc, margin, currentY, pageWidth - margin, currentY, colors.lightGray);
            currentY += 8;
            
            // Inventar
            if (data.inventory && data.inventory.length > 0) {
                doc.setFontSize(16);
                doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                doc.text("Inventar", margin, currentY);
                currentY += 8;
                
                // Inventar-Tabelle
                doc.setFontSize(10);
                doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
                
                // Tabellenkopf
                doc.setFont(undefined, 'bold');
                doc.text("Name", margin, currentY);
                doc.text("Anzahl", margin + contentWidth - 20, currentY);
                currentY += 6;
                doc.setFont(undefined, 'normal');
                
                // Tabellenzeilen
                for (const item of data.inventory) {
                    // Überprüfen, ob genug Platz auf der Seite ist
                    if (currentY + 40 > pageHeight - margin) { // 40 für die Beschreibung + Abstand
                        doc.addPage();
                        currentY = margin;
                    }
                    
                    doc.text(item.name || 'N/A', margin, currentY);
                    doc.text(`${item.amount || 'N/A'}`, margin + contentWidth - 20, currentY);
                    currentY += 5;
                    
                    // Beschreibung mit Einrückung
                    if (item.description) {
                        const descLines = doc.splitTextToSize(item.description, contentWidth - 10);
                        doc.setFontSize(8);
                        doc.text(descLines, margin + 5, currentY);
                        currentY += descLines.length * 4 + 5; // 4mm Zeilenhöhe für kleinere Schrift
                        doc.setFontSize(10);
                    } else {
                        currentY += 3; // Nur ein kleiner Abstand, wenn keine Beschreibung
                    }
                }
                
                currentY += 5;
            }
            
            // Attacken
            if (data.attacks && data.attacks.length > 0) {
                // Überprüfen, ob genug Platz auf der Seite ist
                if (currentY + 50 > pageHeight - margin) { // 50 für Überschrift + mindestens eine Attacke
                    doc.addPage();
                    currentY = margin;
                }
                
                doc.setFontSize(16);
                doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                doc.text("Trainer-Attacken", margin, currentY);
                currentY += 8;
                
                doc.setFontSize(10);
                doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
                
                for (const attack of data.attacks) {
                    // Überprüfen, ob genug Platz auf der Seite ist
                    if (currentY + 20 > pageHeight - margin) {
                        doc.addPage();
                        currentY = margin;
                    }
                    
                    // Name und Typ
                    doc.setFont(undefined, 'bold');
                    doc.text(attack.name || 'N/A', margin, currentY);
                    
                    if (attack.type) {
                        doc.text(`Typ: ${attack.type}`, margin + 50, currentY);
                    }
                    
                    if (attack.damage) {
                        doc.text(`Schaden: ${attack.damage}`, margin + 100, currentY);
                    }
                    
                    currentY += 5;
                    doc.setFont(undefined, 'normal');
                    
                    // Beschreibung
                    if (attack.description) {
                        const descLines = doc.splitTextToSize(attack.description, contentWidth);
                        doc.text(descLines, margin, currentY);
                        currentY += descLines.length * 5 + 5;
                    } else {
                        currentY += 5;
                    }
                }
            }
            
            // Notizen-Bereich
            if (currentY + 50 < pageHeight - margin) {
                currentY += 10;
                doc.setFontSize(16);
                doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                doc.text("Notizen", margin, currentY);
                currentY += 8;
                
                // Linien für Notizen
                const lineSpacing = 8;
                const availableSpace = pageHeight - margin - currentY;
                const numberOfLines = Math.floor(availableSpace / lineSpacing);
                
                doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
                doc.setLineWidth(0.2);
                
                for (let i = 0; i < numberOfLines; i++) {
                    doc.line(margin, currentY, pageWidth - margin, currentY);
                    currentY += lineSpacing;
                }
            }
        }
        
        // Hilfsfunktionen
        
        // Text zentrieren
        function centerText(doc, text, x, y, width) {
            const textWidth = doc.getStringUnitWidth(text) * doc.getFontSize() / doc.internal.scaleFactor;
            const textX = x + (width - textWidth) / 2;
            doc.text(text, textX, y);
        }
        
        // Linie zeichnen
        function drawLine(doc, x1, y1, x2, y2, color) {
            doc.setDrawColor(color[0], color[1], color[2]);
            doc.setLineWidth(0.5);
            doc.line(x1, y1, x2, y2);
        }
        
        // InfoBox mit Label-Wert-Paaren erstellen
        function createInfoBox(doc, items, x, y, width) {
            const boxHeight = items.length * 10 + 4;
            
            // Box zeichnen
            doc.setFillColor(250, 250, 250);
            doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
            doc.roundedRect(x, y, width, boxHeight, 2, 2, 'FD');
            
            // Items zeichnen
            doc.setFontSize(12);
            doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
            
            let itemY = y + 8;
            for (const item of items) {
                doc.setFont(undefined, 'bold');
                doc.text(`${item.label}:`, x + 5, itemY);
                doc.setFont(undefined, 'normal');
                doc.text(item.value, x + 40, itemY);
                itemY += 10;
            }
        }
        
        // Notentabelle erstellen
        function createGradesTable(doc, grades, x, y, width) {
            const rowHeight = 6;
            
            // Tabellenkopf
            doc.setFillColor(245, 245, 245);
            doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
            doc.rect(x, y, width * 0.7, rowHeight, 'F');
            doc.rect(x + width * 0.7, y, width * 0.3, rowHeight, 'F');
            
            doc.setFont(undefined, 'bold');
            doc.setFontSize(10);
            doc.text("Fach", x + 2, y + rowHeight - 1.5);
            doc.text("Note", x + width * 0.7 + 2, y + rowHeight - 1.5);
            
            // Tabellenzeilen
            doc.setFont(undefined, 'normal');
            for (let i = 0; i < grades.length; i++) {
                const rowY = y + (i + 1) * rowHeight;
                const grade = grades[i];
                
                // Hintergrundfarbe basierend auf der Note
                let bgColor;
                switch (parseInt(grade.value)) {
                    case 1: bgColor = [232, 245, 233]; break; // Grün für 1
                    case 2: bgColor = [240, 249, 232]; break; // Grün-Gelb für 2
                    case 3: bgColor = [255, 253, 231]; break; // Gelb für 3
                    case 4: bgColor = [255, 243, 224]; break; // Orange für 4
                    case 5: bgColor = [255, 235, 238]; break; // Rot für 5
                    default: bgColor = [255, 255, 255]; break; // Weiß für alles andere
                }
                
                // Zellen zeichnen
                doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
                doc.rect(x, rowY, width * 0.7, rowHeight, 'F');
                doc.rect(x + width * 0.7, rowY, width * 0.3, rowHeight, 'F');
                
                doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
                doc.rect(x, rowY, width * 0.7, rowHeight);
                doc.rect(x + width * 0.7, rowY, width * 0.3, rowHeight);
                
                // Text zeichnen
                doc.text(grade.name, x + 2, rowY + rowHeight - 1.5);
                doc.text(grade.value, x + width * 0.7 + 2, rowY + rowHeight - 1.5);
            }
        }
        
        // Typ-Meisterschaften-Tabelle mit farbiger Darstellung erstellen
function createTypeMasteriesTable(doc, typeMasteries, x, y, width) {
    const colWidth = width / 3;
    const rowHeight = 12;
    const types = [];
    
    // Emoji-zu-Text-Mapping für Pokémon-Typen
    const emojiToText = {
        '🔥': '[Feuer]',
        '💧': '[Wasser]',
        '🌿': '[Pflanze]',
        '⚡': '[Elektro]',
        '❄️': '[Eis]',
        '👊': '[Kampf]',
        '☠️': '[Gift]',
        '🪨': '[Gestein]',
        '🐉': '[Drachen]',
        '🐛': '[Käfer]',
        '🧠': '[Psycho]',
        '👻': '[Geist]',
        '🦅': '[Flug]',
        '🌍': '[Boden]',
        '⚙️': '[Stahl]',
        '🧚': '[Fee]',
        '🌑': '[Unlicht]',
        '⚪': '[Normal]'
        // Weitere Pokémon-Typen nach Bedarf hinzufügen
    };
    
    // Pokémon-Typ-Farben-Mapping
    const typeColors = {
        'Feuer': [255, 156, 84],    // Orange-Rot
        'Wasser': [77, 144, 213],   // Blau
        'Pflanze': [122, 199, 76],  // Grün
        'Elektro': [249, 207, 48],  // Gelb
        'Eis': [152, 216, 216],     // Hellblau
        'Kampf': [194, 46, 40],     // Rot
        'Gift': [163, 62, 161],     // Lila
        'Boden': [193, 157, 63],    // Braun
        'Flug': [168, 144, 240],    // Lavendel
        'Psycho': [249, 85, 135],   // Pink
        'Käfer': [166, 185, 26],    // Olivgrün
        'Gestein': [182, 161, 54],  // Dunkelgelb
        'Geist': [115, 87, 151],    // Dunkellila
        'Drachen': [111, 53, 252],  // Dunkelblau
        'Unlicht': [112, 87, 70],   // Dunkelbraun
        'Stahl': [183, 183, 206],   // Silber
        'Fee': [214, 133, 173],     // Rosa
        'Normal': [168, 167, 122]   // Grau
    };
    
    // Typ-Objekte erstellen
    for (let i = 0; i < typeMasteries.length; i++) {
        const mastery = typeMasteries[i];
        const emoji = mastery.icon || '';
        const textIcon = emojiToText[emoji] || emoji;
        
        types.push({
            name: mastery.name,
            icon: textIcon, // Verwende die Textalternative
            value: mastery.value || '5',
            isFavorite: mastery.isFavorite || false,
            color: typeColors[mastery.name] || [0, 0, 0] // Typfarbe oder Schwarz als Fallback
        });
    }
    
    // Typen in Zeilen zu je 3 anordnen
    for (let i = 0; i < types.length; i += 3) {
        const rowY = y + Math.floor(i / 3) * rowHeight;
        
        // Für jede Zelle in der Zeile
        for (let j = 0; j < 3 && i + j < types.length; j++) {
            const cellX = x + j * colWidth;
            const type = types[i + j];
            
            // Hintergrundfarbe basierend auf Lieblingstyp
            if (type.isFavorite) {
                doc.setFillColor(230, 242, 255); // Hellblau für Lieblingstyp-Hintergrund
            } else {
                doc.setFillColor(250, 250, 250); // Standard-Hintergrund
            }
            
            // Zelle zeichnen
            doc.rect(cellX, rowY, colWidth - 2, rowHeight, 'F');
            doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
            doc.rect(cellX, rowY, colWidth - 2, rowHeight);
            
            // Farbigen Indikator für Typ zeichnen (kleines farbiges Rechteck)
            const indicatorWidth = 4;
            const indicatorHeight = 4;
            const indicatorX = cellX + 2;
            const indicatorY = rowY + 3;
            
            doc.setFillColor(type.color[0], type.color[1], type.color[2]);
            doc.rect(indicatorX, indicatorY, indicatorWidth, indicatorHeight, 'F');
            
            // Typ-Name zeichnen mit etwas Abstand für den Indikator
            doc.setTextColor(type.color[0], type.color[1], type.color[2]); // Typfarbe für Text
            doc.setFontSize(10);
            doc.setFont(undefined, type.isFavorite ? 'bold' : 'normal');
            doc.text(`${type.name}`, cellX + 8, rowY + 5); // Versetzt für den farbigen Indikator
            
            // Meisterschaftswert in schwarzer Farbe
            doc.setTextColor(0, 0, 0); // Schwarz für Meisterschaftswert
            
            // Wert hervorheben, wenn Lieblingstyp mit Sternchen markieren
            if (type.isFavorite) {
                doc.text(`Meisterschaft: ${type.value} ★`, cellX + 2, rowY + rowHeight - 2);
            } else {
                doc.text(`Meisterschaft: ${type.value}`, cellX + 2, rowY + rowHeight - 2);
            }
        }
    }
}
        
        // Funktion zum Sammeln aller Charakterdaten
        function collectCharacterData() {
            try {
                // Grunddaten
                const characterData = {
                    name: document.getElementById('name').value || '',
                    player: document.getElementById('player').value || '',
                    age: document.getElementById('age').value || '',
                    
                    // Klasse, Vorteil, Nachteil
                    klasse: getSelectedOptionText('class'),
                    vorteil: getSelectedOptionText('advantage'),
                    nachteil: getSelectedOptionText('disadvantage'),
                    
                    // Beschreibungen
                    klasseBeschreibung: getDescriptionFromTooltip('class'),
                    vorteilBeschreibung: getDescriptionFromTooltip('advantage'),
                    nachteilBeschreibung: getDescriptionFromTooltip('disadvantage'),
                    
                    // Kampfwerte
                    combatStats: {
                        gena: document.getElementById('gena').value || '1',
                        pa: document.getElementById('pa').value || '1',
                        kp: document.getElementById('kp').value || '1/1',
                        init: document.getElementById('init').value || '1',
                        bw: document.getElementById('bw').value || '1',
                        luckTokens: document.getElementById('luck-tokens').value || '1/1'
                    },
                    
                    // Wunden
                    wounds: countActiveWounds(),
                                        
                    // Bild
                    image: getCharacterImage(),
                    
                    // Attribute und Fertigkeiten
                    attributes: {
                        kö: document.querySelector('.attribute-column:nth-child(1) .main-attribute-value').value || '1',
                        wi: document.querySelector('.attribute-column:nth-child(2) .main-attribute-value').value || '1',
                        ch: document.querySelector('.attribute-column:nth-child(3) .main-attribute-value').value || '1',
                        gl: document.querySelector('.attribute-column:nth-child(4) .main-attribute-value').value || '1'
                    },
                    
                    // Fertigkeiten
                    skills: collectSkills(),
                    
                    // Inventar
                    inventory: collectInventory(),
                    
                    // Trainer-Attacken
                    attacks: collectAttacks(),
                    
                    // Prüfungsnoten
                    grades: collectGrades(),
                    
                    // Typ-Meisterschaften
                    typeMasteries: collectTypeMasteries(),
                    favoriteType: getFavoriteType()
                };
                
                return characterData;
            } catch (error) {
                console.error("Fehler beim Sammeln der Charakterdaten:", error);
                return null;
            }
        }
        
        // Hilfsfunktion: Text der ausgewählten Option eines Select-Elements abrufen
        function getSelectedOptionText(selectId) {
            const select = document.getElementById(selectId);
            if (!select) return '';
            
            const selectedIndex = select.selectedIndex;
            if (selectedIndex === -1) return '';
            
            return select.options[selectedIndex].text;
        }
        
        // Hilfsfunktion: Beschreibung aus dem Tooltip-Container abrufen
        function getDescriptionFromTooltip(elementId) {
            const tooltipContainer = document.getElementById('tooltip-container');
            if (!tooltipContainer) return '';
            
            const tooltipElement = tooltipContainer.querySelector(`[data-for="${elementId}"]`);
            if (!tooltipElement) return '';
            
            const descElement = tooltipElement.querySelector('p');
            if (!descElement) return '';
            
            return descElement.textContent;
        }
        
        // Hilfsfunktion: Anzahl der aktiven Wunden zählen
        function countActiveWounds() {
            const activeWounds = document.querySelectorAll('.wound-circle.active, .wound-skull.active');
            return activeWounds.length;
        }
        
        // Hilfsfunktion: Charakterbild abrufen
        function getCharacterImage() {
            // Prüfen, ob getCharacterImage als Funktion existiert
            if (typeof window.getCharacterImage === 'function') {
                return window.getCharacterImage();
            }
            
            // Sonst das Bild-Element direkt abrufen
            const img = document.getElementById('character-image');
            if (img && img.src && img.style.display !== 'none') {
                return img.src;
            }
            
            return null;
        }
        
        // Hilfsfunktion: Fertigkeiten sammeln
        function collectSkills() {
            const skills = [];
            const attributeColumns = document.querySelectorAll('.attribute-column');
            
            attributeColumns.forEach((column, index) => {
                const attributeElement = column.querySelector('h3');
                const attributeName = attributeElement ? attributeElement.textContent.split(' ')[0] : '';
                
                const skillItems = column.querySelectorAll('.attribute-item');
                skillItems.forEach(item => {
                    const skillName = item.textContent.split(/\s+\d+/)[0].trim();
                    const inputElement = item.querySelector('input');
                    const value = inputElement ? inputElement.value : '0';
                    
                    // Prüfen, ob ein Klassenbonus vorhanden ist
                    const bonusElement = item.querySelector('.fertigkeit-bonus, .second-class-bonus');
                    const bonus = bonusElement ? bonusElement.textContent.match(/\+(\d+)/)[1] : null;
                    
                    skills.push({
                        name: skillName,
                        value: value,
                        attribute: attributeName,
                        bonus: bonus
                    });
                });
            });
            
            return skills;
        }
        
        // Hilfsfunktion: Inventar sammeln
        function collectInventory() {
            const inventory = [];
            const itemSlots = document.querySelectorAll('.item-slot');
            
            itemSlots.forEach(slot => {
                // Wenn es ein ausgewähltes Item gibt
                const nameElement = slot.querySelector('.custom-select-button') || slot.querySelector('.item-name-container');
                if (!nameElement) return;
                
                const name = nameElement.textContent.trim();
                if (name === '-- Item auswählen --' || !name) return;
                
                const descriptionElement = slot.querySelector('.item-description');
                const amountElement = slot.querySelector('.item-amount');
                
                inventory.push({
                    name: name,
                    description: descriptionElement ? descriptionElement.value : '',
                    amount: amountElement ? amountElement.value : '1'
                });
            });
            
            return inventory;
        }
        
        // Hilfsfunktion: Trainer-Attacken sammeln
        function collectAttacks() {
            const attacks = [];
            const attackenSections = document.querySelectorAll('.attacken-section');
            
            attackenSections.forEach(section => {
                const attackText = section.querySelector('.attacken-text');
                if (!attackText) return;
                
                const content = attackText.innerHTML;
                const attackElements = content.split(/<br>|<br\/>|<br \/>/);
                
                let currentAttack = {};
                
                attackElements.forEach(element => {
                    // Den HTML-Code bereinigen
                    const text = element.replace(/<[^>]*>/g, ' ').trim();
                    if (!text) return;
                    
                    // Suche nach Attackennamen und Typ
                    if (text.includes('Typ')) {
                        const nameMatch = text.match(/^(.*?)(?=\.\s*<span|$)/);
                        const typeMatch = text.match(/Typ\s+(\w+)/);
                        const damageMatch = text.match(/Schaden:\s+([^\.]+)/);
                        
                        if (nameMatch) {
                            // Neue Attacke beginnen
                            if (currentAttack.name) {
                                attacks.push(currentAttack);
                            }
                            
                            currentAttack = {
                                name: nameMatch[1].trim(),
                                type: typeMatch ? typeMatch[1] : '',
                                damage: damageMatch ? damageMatch[1] : '',
                                description: ''
                            };
                        } else if (currentAttack.name) {
                            // Beschreibung zur aktuellen Attacke hinzufügen
                            currentAttack.description += (currentAttack.description ? ' ' : '') + text;
                        }
                    } else if (currentAttack.name) {
                        // Beschreibung zur aktuellen Attacke hinzufügen
                        currentAttack.description += (currentAttack.description ? ' ' : '') + text;
                    }
                });
                
                // Letzte Attacke hinzufügen
                if (currentAttack.name) {
                    attacks.push(currentAttack);
                }
            });
            
            return attacks;
        }
        
        // Hilfsfunktion: Prüfungsnoten sammeln
        function collectGrades() {
            const grades = [];
            const gradeTable = document.querySelector('.grade-table');
            
            if (!gradeTable) return [];
            
            const rows = gradeTable.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const subject = row.querySelector('td:first-child')?.textContent.trim();
                const gradeInput = row.querySelector('.grade-display');
                
                if (subject && gradeInput) {
                    grades.push({
                        name: subject,
                        value: gradeInput.value
                    });
                }
            });
            
            return grades;
        }
        
        // Hilfsfunktion: Typ-Meisterschaften sammeln
        function collectTypeMasteries() {
            const masteries = [];
            const typeCards = document.querySelectorAll('.type-card');
            const favoriteTypeId = document.getElementById('favorite-type')?.value;
            
            typeCards.forEach(card => {
                const typeId = card.dataset.typeId;
                const typeName = card.querySelector('span:nth-child(2)')?.textContent.trim();
                const typeIcon = card.querySelector('span:first-child')?.textContent.trim();
                const valueInput = card.querySelector('.type-mastery-value');
                
                if (typeName && valueInput) {
                    masteries.push({
                        id: typeId,
                        name: typeName,
                        icon: typeIcon || '',
                        value: valueInput.value,
                        isFavorite: typeId === favoriteTypeId
                    });
                }
            });
            
            return masteries;
        }
        
        // Hilfsfunktion: Lieblingstyp abrufen
        function getFavoriteType() {
            const favoriteTypeSelect = document.getElementById('favorite-type');
            if (!favoriteTypeSelect) return '';
            
            const selectedIndex = favoriteTypeSelect.selectedIndex;
            if (selectedIndex === -1) return '';
            
            return favoriteTypeSelect.options[selectedIndex].text;
        }
    }
});

// Füge jsPDF und html2canvas Skripte dynamisch hinzu, wenn sie nicht vorhanden sind
function ensureRequiredScriptsLoaded() {
    return new Promise((resolve) => {
        if (typeof jspdf !== 'undefined' && typeof html2canvas !== 'undefined') {
            resolve();
            return;
        }

        const scripts = [];
        if (typeof jspdf === 'undefined') {
            const jsPdfScript = document.createElement('script');
            jsPdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            scripts.push(jsPdfScript);
        }

        if (typeof html2canvas === 'undefined') {
            const html2canvasScript = document.createElement('script');
            html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            scripts.push(html2canvasScript);
        }

        if (scripts.length === 0) {
            resolve();
            return;
        }

        let loadedCount = 0;
        scripts.forEach(script => {
            script.onload = () => {
                loadedCount++;
                if (loadedCount === scripts.length) {
                    resolve();
                }
            };
            document.head.appendChild(script);
        });
    });
}