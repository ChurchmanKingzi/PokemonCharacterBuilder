// pruefungsnoten.js - Implementierung der Prüfungsnoten-Sektion

document.addEventListener('DOMContentLoaded', function() {
    // Liste aller Schulfächer
    const schoolSubjects = [
        { id: 'kaempfen', name: 'Kämpfen (praktisch)' },
        { id: 'attacken-theorie', name: 'Attacken-Theorie' },
        { id: 'komplexe-strategien', name: 'Komplexe Strategien, Multi-Kämpfe und Items' },
        { id: 'trainingsmethoden', name: 'Trainingsmethoden' },
        { id: 'pokemon-pflege', name: 'Pokemon-Pflege, Umgang und Zucht' },
        { id: 'pokemon-biologie', name: 'Pokemon-Biologie und -Anatomie' },
        { id: 'mathe', name: 'Mathematik, Wahrscheinlichkeiten und Stats' },
        { id: 'naturwissenschaften', name: 'Naturwissenschaften' },
        { id: 'botanik', name: 'Botanik, Beeren und Aprikokos' },
        { id: 'survival', name: 'Survival' },
        { id: 'gesellschaft', name: 'Gesellschaft, Rechte und Pflichten' },
        { id: 'georaphie', name: 'Geographie, Habitate und Regionskunde' },
        { id: 'kunst-musik-koordination', name: 'Kunst/Musik/Koordination (Wahl)' },
        { id: 'koerperliche-ertuechtigung', name: 'Körperliche Ertüchtigung' }
    ];

    // Konstanten
    const TOTAL_GRADE_POINTS = 30;
    const DEFAULT_GRADE = 5;
    const MIN_GRADE = 1;
    const MAX_GRADE = 5;
    const MAX_FAILING_SUBJECTS = 2;
    
    // Farbcodes für verschiedene Noten
    const GRADE_COLORS = {
        1: { bg: '#e8f5e9', text: '#2e7d32', row: '#f5fff5' }, // Grün
        2: { bg: '#f0f9e8', text: '#558b2f', row: '#f9fff0' }, // Grün-Gelb
        3: { bg: '#fffde7', text: '#f9a825', row: '#fffffa' }, // Gelb
        4: { bg: '#fff3e0', text: '#ef6c00', row: '#fff9f5' }, // Orange
        5: { bg: '#ffebee', text: '#c62828', row: '#fff5f5' }  // Rot
    };

    // DOM-Element für den Container der Seite
    const container = document.querySelector('.container');
    
    // Erstelle die Prüfungsnoten-Sektion
    createGradesSection();
    
    // Funktion zum Erstellen der Prüfungsnoten-Sektion
    function createGradesSection() {
        // Hauptsektion erstellen
        const gradesSection = document.createElement('div');
        gradesSection.className = 'grades-section';
        gradesSection.style.marginTop = '40px';
        gradesSection.style.borderTop = '1px solid #eee';
        gradesSection.style.paddingTop = '20px';
        gradesSection.style.marginBottom = '40px';  // Abstand zum Seitenende
        
        // Überschrift
        const heading = document.createElement('h2');
        heading.textContent = 'Prüfungsnoten';
        heading.style.marginBottom = '10px';
        
        // Infotext
        const infoText = document.createElement('p');
        infoText.innerHTML = 'Verteile <strong>' + TOTAL_GRADE_POINTS + ' Punkte</strong>, um deine Noten zu verbessern. Standard ist Note 5, je mehr Punkte du ausgibst, desto besser wird die Note.<br>Beispiel: 3 Punkte in einem Fach verbessern die Note 5 auf 2.';
        infoText.style.marginBottom = '10px';
        infoText.style.fontSize = '14px';
        infoText.style.color = '#666';
        
        // Anzeige der verfügbaren Punkte
        const pointsDisplay = document.createElement('div');
        pointsDisplay.className = 'available-grade-points';
        pointsDisplay.id = 'available-grade-points';
        pointsDisplay.style.padding = '8px 15px';
        pointsDisplay.style.backgroundColor = '#f0f0f0';
        pointsDisplay.style.borderRadius = '5px';
        pointsDisplay.style.marginBottom = '15px';
        pointsDisplay.style.fontWeight = 'bold';
        
        // Fehlermeldung für zu viele durchgefallene Fächer
        const errorMessage = document.createElement('div');
        errorMessage.className = 'grade-error-message';
        errorMessage.id = 'grade-error-message';
        errorMessage.style.padding = '8px 15px';
        errorMessage.style.backgroundColor = '#ffebee';
        errorMessage.style.color = '#c62828';
        errorMessage.style.borderRadius = '5px';
        errorMessage.style.marginBottom = '20px';
        errorMessage.style.fontWeight = 'bold';
        errorMessage.style.display = 'none';
        errorMessage.textContent = 'Achtung: Du darfst in maximal ' + MAX_FAILING_SUBJECTS + ' Fächern durchfallen (Note 5)!';
        
        // Tabelle für die Fächer und Noten
        const gradeTable = document.createElement('table');
        gradeTable.className = 'grade-table';
        gradeTable.style.width = '100%';
        gradeTable.style.borderCollapse = 'collapse';
        
        // Tabellenkopf
        const tableHead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        // Spaltenüberschriften
        const subjectHeader = document.createElement('th');
        subjectHeader.textContent = 'Schulfach';
        subjectHeader.style.textAlign = 'left';
        subjectHeader.style.padding = '8px';
        subjectHeader.style.borderBottom = '2px solid #ddd';
        
        const gradeHeader = document.createElement('th');
        gradeHeader.textContent = 'Note (1-5)';
        gradeHeader.style.width = '120px';
        gradeHeader.style.textAlign = 'center';
        gradeHeader.style.padding = '8px';
        gradeHeader.style.borderBottom = '2px solid #ddd';
        
        const pointsHeader = document.createElement('th');
        pointsHeader.textContent = 'Ausgegebene Punkte';
        pointsHeader.style.width = '180px';
        pointsHeader.style.textAlign = 'center';
        pointsHeader.style.padding = '8px';
        pointsHeader.style.borderBottom = '2px solid #ddd';
        
        headerRow.appendChild(subjectHeader);
        headerRow.appendChild(gradeHeader);
        headerRow.appendChild(pointsHeader);
        tableHead.appendChild(headerRow);
        gradeTable.appendChild(tableHead);
        
        // Tabellenkörper
        const tableBody = document.createElement('tbody');
        
        // Zeilen für jedes Fach erstellen
        schoolSubjects.forEach(subject => {
            const row = createSubjectRow(subject);
            tableBody.appendChild(row);
        });
        
        gradeTable.appendChild(tableBody);
        
        // DOM-Struktur zusammensetzen
        gradesSection.appendChild(heading);
        gradesSection.appendChild(infoText);
        gradesSection.appendChild(pointsDisplay);
        gradesSection.appendChild(errorMessage);
        gradesSection.appendChild(gradeTable);
        
        // Füge die Sektion am Ende des Containers ein
        container.appendChild(gradesSection);
        
        // Initialisiere die Anzeige der verfügbaren Punkte und die Fehlermeldung
        updateAvailablePointsDisplay();
        
        // Alle Fächer initial auf Rot setzen
        document.querySelectorAll('.grade-display').forEach(display => {
            const subjectId = display.id.replace('grade-', '');
            updateGradeDisplay(subjectId, DEFAULT_GRADE);
        });
        
        checkFailingSubjects();
    }
    
    // Funktion zum Erstellen einer Fach-Zeile
    function createSubjectRow(subject) {
        const row = document.createElement('tr');
        row.id = `subject-row-${subject.id}`;
        row.style.borderBottom = '1px solid #eee';
        
        // Initial auf Rot setzen
        row.style.backgroundColor = GRADE_COLORS[DEFAULT_GRADE].row;
        
        // Fachname-Zelle
        const subjectCell = document.createElement('td');
        subjectCell.textContent = subject.name;
        subjectCell.style.padding = '12px 8px';
        
        // Note-Zelle
        const gradeCell = document.createElement('td');
        gradeCell.style.padding = '8px';
        gradeCell.style.textAlign = 'center';
        
        // Note-Input (nicht direkt editierbar)
        const gradeDisplay = document.createElement('input');
        gradeDisplay.type = 'text';
        gradeDisplay.id = `grade-${subject.id}`;
        gradeDisplay.className = 'grade-display';
        gradeDisplay.value = DEFAULT_GRADE;
        gradeDisplay.readOnly = true;
        gradeDisplay.style.width = '40px';
        gradeDisplay.style.padding = '5px';
        gradeDisplay.style.textAlign = 'center';
        gradeDisplay.style.border = '1px solid #ddd';
        gradeDisplay.style.borderRadius = '4px';
        
        // Initial auf Rot setzen
        gradeDisplay.style.backgroundColor = GRADE_COLORS[DEFAULT_GRADE].bg;
        gradeDisplay.style.color = GRADE_COLORS[DEFAULT_GRADE].text;
        gradeDisplay.style.fontWeight = 'bold';
        
        gradeCell.appendChild(gradeDisplay);
        
        // Punkte-Zelle
        const pointsCell = document.createElement('td');
        pointsCell.style.padding = '8px';
        pointsCell.style.textAlign = 'center';
        
        // Punkte-Steuerung-Container
        const pointsControlContainer = document.createElement('div');
        pointsControlContainer.style.display = 'flex';
        pointsControlContainer.style.alignItems = 'center';
        pointsControlContainer.style.justifyContent = 'center';
        pointsControlContainer.style.gap = '8px';
        
        // Minus-Button
        const minusButton = document.createElement('button');
        minusButton.textContent = '-';
        minusButton.className = 'grade-point-button';
        minusButton.style.width = '30px';
        minusButton.style.height = '30px';
        minusButton.style.fontSize = '18px';
        minusButton.style.border = '1px solid #ddd';
        minusButton.style.borderRadius = '4px';
        minusButton.style.backgroundColor = '#f0f0f0';
        minusButton.style.cursor = 'pointer';
        
        // Punkte-Anzeige
        const pointsInput = document.createElement('input');
        pointsInput.type = 'text';
        pointsInput.id = `points-${subject.id}`;
        pointsInput.className = 'grade-points-input';
        pointsInput.value = '0';
        pointsInput.readOnly = true;
        pointsInput.style.width = '40px';
        pointsInput.style.padding = '5px';
        pointsInput.style.textAlign = 'center';
        pointsInput.style.border = '1px solid #ddd';
        pointsInput.style.borderRadius = '4px';
        
        // Plus-Button
        const plusButton = document.createElement('button');
        plusButton.textContent = '+';
        plusButton.className = 'grade-point-button';
        plusButton.style.width = '30px';
        plusButton.style.height = '30px';
        plusButton.style.fontSize = '18px';
        plusButton.style.border = '1px solid #ddd';
        plusButton.style.borderRadius = '4px';
        plusButton.style.backgroundColor = '#f0f0f0';
        plusButton.style.cursor = 'pointer';
        
        // Event-Listeners für die Buttons
        minusButton.addEventListener('click', function() {
            decreasePoints(subject.id);
        });
        
        plusButton.addEventListener('click', function() {
            increasePoints(subject.id);
        });
        
        // DOM-Struktur für die Punkte-Steuerung zusammensetzen
        pointsControlContainer.appendChild(minusButton);
        pointsControlContainer.appendChild(pointsInput);
        pointsControlContainer.appendChild(plusButton);
        
        pointsCell.appendChild(pointsControlContainer);
        
        // Zeile zusammensetzen
        row.appendChild(subjectCell);
        row.appendChild(gradeCell);
        row.appendChild(pointsCell);
        
        return row;
    }
    
    // Funktionen zur Steuerung der Punkte und Noten
    
    // Funktion zum Erhöhen der Punkte für ein Fach
    function increasePoints(subjectId) {
        const pointsInput = document.getElementById(`points-${subjectId}`);
        const gradeDisplay = document.getElementById(`grade-${subjectId}`);
        
        const currentPoints = parseInt(pointsInput.value) || 0;
        const currentGrade = parseInt(gradeDisplay.value) || DEFAULT_GRADE;
        
        // Überprüfen, ob noch Punkte verfügbar sind und ob die Note bereits auf Minimum ist
        if (getAvailablePoints() > 0 && currentGrade > MIN_GRADE) {
            // Punkte erhöhen
            const newPoints = currentPoints + 1;
            pointsInput.value = newPoints;
            
            // Note aktualisieren (reduzieren)
            const newGrade = Math.max(MIN_GRADE, DEFAULT_GRADE - newPoints);
            gradeDisplay.value = newGrade;
            
            // UI-Updates
            updateGradeDisplay(subjectId, newGrade);
            updateAvailablePointsDisplay();
            checkFailingSubjects();
        }
    }
    
    // Funktion zum Verringern der Punkte für ein Fach
    function decreasePoints(subjectId) {
        const pointsInput = document.getElementById(`points-${subjectId}`);
        const gradeDisplay = document.getElementById(`grade-${subjectId}`);
        
        const currentPoints = parseInt(pointsInput.value) || 0;
        
        // Überprüfen, ob Punkte verringert werden können
        if (currentPoints > 0) {
            // Punkte verringern
            const newPoints = currentPoints - 1;
            pointsInput.value = newPoints;
            
            // Note aktualisieren (erhöhen)
            const newGrade = Math.min(MAX_GRADE, DEFAULT_GRADE - newPoints);
            gradeDisplay.value = newGrade;
            
            // UI-Updates
            updateGradeDisplay(subjectId, newGrade);
            updateAvailablePointsDisplay();
            checkFailingSubjects();
        }
    }
    
    // Funktion zur Berechnung der verfügbaren Punkte
    function getAvailablePoints() {
        let usedPoints = 0;
        
        document.querySelectorAll('.grade-points-input').forEach(input => {
            usedPoints += parseInt(input.value) || 0;
        });
        
        return TOTAL_GRADE_POINTS - usedPoints;
    }
    
    // Funktion zum Aktualisieren der verfügbaren Punkte-Anzeige
    function updateAvailablePointsDisplay() {
        const availablePoints = getAvailablePoints();
        const pointsDisplay = document.getElementById('available-grade-points');
        
        pointsDisplay.textContent = `${availablePoints} von ${TOTAL_GRADE_POINTS} Punkten verfügbar`;
        
        // Visuelle Hinweise basierend auf verfügbaren Punkten
        if (availablePoints === 0) {
            pointsDisplay.style.backgroundColor = '#e6f7e6';
            pointsDisplay.style.color = '#2e7d32';
        } else {
            pointsDisplay.style.backgroundColor = '#f0f0f0';
            pointsDisplay.style.color = '#444';
        }
        
        // Plus-Buttons deaktivieren, wenn keine Punkte mehr verfügbar sind
        const plusButtons = document.querySelectorAll('.grade-point-button:nth-child(3)');
        plusButtons.forEach(button => {
            if (availablePoints === 0) {
                button.disabled = true;
                button.style.opacity = '0.5';
                button.style.cursor = 'not-allowed';
            } else {
                button.disabled = false;
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
            }
        });
        
        // Minus-Buttons für alle Fächer mit 0 Punkten deaktivieren
        document.querySelectorAll('.grade-points-input').forEach(input => {
            const currentPoints = parseInt(input.value) || 0;
            const minusButton = input.previousElementSibling;
            
            if (currentPoints === 0) {
                minusButton.disabled = true;
                minusButton.style.opacity = '0.5';
                minusButton.style.cursor = 'not-allowed';
            } else {
                minusButton.disabled = false;
                minusButton.style.opacity = '1';
                minusButton.style.cursor = 'pointer';
            }
        });
    }
    
    // Funktion zum Aktualisieren der Note-Anzeige mit entsprechender Farbcodierung
    function updateGradeDisplay(subjectId, grade) {
        const gradeDisplay = document.getElementById(`grade-${subjectId}`);
        const row = document.getElementById(`subject-row-${subjectId}`);
        
        // Farbcodes für die Note anwenden
        if (GRADE_COLORS[grade]) {
            const colors = GRADE_COLORS[grade];
            gradeDisplay.style.backgroundColor = colors.bg;
            gradeDisplay.style.color = colors.text;
            gradeDisplay.style.fontWeight = 'bold';
            row.style.backgroundColor = colors.row;
        } else {
            // Fallback für unerwartete Noten
            gradeDisplay.style.backgroundColor = '#f5f5f5';
            gradeDisplay.style.color = '#000';
            gradeDisplay.style.fontWeight = 'normal';
            row.style.backgroundColor = '';
        }
    }
    
    // Funktion zum Überprüfen der durchgefallenen Fächer
    function checkFailingSubjects() {
        let failingCount = 0;
        
        document.querySelectorAll('.grade-display').forEach(display => {
            if (parseInt(display.value) === 5) {
                failingCount++;
            }
        });
        
        const errorMessage = document.getElementById('grade-error-message');
        
        if (failingCount > MAX_FAILING_SUBJECTS) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = `Achtung: Du hast in ${failingCount} Fächern die Note 5. Erlaubt sind maximal ${MAX_FAILING_SUBJECTS}!`;
        } else {
            errorMessage.style.display = 'none';
        }
    }
});