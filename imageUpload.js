// Funktionalität für den Bild-Upload

document.addEventListener('DOMContentLoaded', function() {
    // DOM-Elemente referenzieren
    const imageUpload = document.getElementById('image-upload');
    const characterImage = document.getElementById('character-image');
    const removeImageBtn = document.getElementById('remove-image');
    const uploadLabel = document.querySelector('.upload-label');
    const imageInstructions = document.querySelector('.image-instructions');
    const imageContainer = document.querySelector('.image-container');
    
    // Event-Listener für den Datei-Upload
    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        // Prüfen, ob eine Datei ausgewählt wurde
        if (!file) return;
        
        // Prüfen, ob es sich um ein Bild handelt
        if (!file.type.match('image.*')) {
            alert('Bitte wähle eine Bilddatei aus (JPG, PNG, GIF, etc.).');
            return;
        }
        
        // Prüfen der Dateigröße (max. 5 MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Die Bilddatei ist zu groß. Bitte wähle ein Bild unter 5 MB.');
            return;
        }
        
        // FileReader erstellen, um die Datei zu lesen
        const reader = new FileReader();
        
        // Wenn das Bild geladen ist, es im <img>-Element anzeigen
        reader.onload = function(e) {
            characterImage.src = e.target.result;
            characterImage.style.display = 'block';
            
            // Andere Elemente ausblenden und Container-Stil anpassen
            uploadLabel.style.display = 'none';
            imageInstructions.style.display = 'none';
            removeImageBtn.style.display = 'none';
            imageContainer.classList.add('image-only-mode');
            
            // Bild im localStorage speichern für Persistenz
            saveImageToLocalStorage(e.target.result);
        };
        
        // Datei als Data-URL lesen
        reader.readAsDataURL(file);
    });
    
    // Doppelklick auf das Bild ermöglicht das Ersetzen des Bildes
    characterImage.addEventListener('dblclick', function() {
        imageUpload.click();
    });
    
    // Tastendruck-Event für das Bild zum Löschen
    characterImage.addEventListener('keydown', function(e) {
        // Entf-Taste (46) oder Backspace (8)
        if (e.keyCode === 46 || e.keyCode === 8) {
            removeImage();
        }
    });
    
    // Fokussierbar machen für Tastaturbedienung
    characterImage.tabIndex = 0;
    
    // Klick auf das Entfernen-Element löscht das Bild
    removeImageBtn.addEventListener('click', removeImage);
    
    // Funktion zum Entfernen des Bildes
    function removeImage() {
        characterImage.src = '';
        characterImage.style.display = 'none';
        
        // Andere Elemente wieder anzeigen
        uploadLabel.style.display = 'inline-block';
        imageInstructions.style.display = 'block';
        imageContainer.classList.remove('image-only-mode');
        
        // Aus dem localStorage entfernen
        localStorage.removeItem('characterImage');
        
        // Datei-Input zurücksetzen
        imageUpload.value = '';
    }
    
    // Bild aus dem LocalStorage laden, falls vorhanden
    loadImageFromLocalStorage();
    
    // Funktion zum Speichern des Bildes im LocalStorage
    function saveImageToLocalStorage(dataUrl) {
        try {
            localStorage.setItem('characterImage', dataUrl);
        } catch (e) {
            console.warn('Bild konnte nicht im LocalStorage gespeichert werden. Möglicherweise ist es zu groß.', e);
        }
    }
    
    // Funktion zum Laden des Bildes aus dem LocalStorage
    function loadImageFromLocalStorage() {
        const savedImage = localStorage.getItem('characterImage');
        if (savedImage) {
            characterImage.src = savedImage;
            characterImage.style.display = 'block';
            
            // Andere Elemente ausblenden bei vorhandenem Bild
            uploadLabel.style.display = 'none';
            imageInstructions.style.display = 'none';
            removeImageBtn.style.display = 'none'; 
            imageContainer.classList.add('image-only-mode');
        }
    }
    
    // PDF-Export anpassen, um das Bild einzubeziehen
    window.getCharacterImage = function() {
        return characterImage.src && characterImage.style.display !== 'none' ? characterImage.src : null;
    };

    // Der Funktion zum Entfernen des Bildes global zugänglich machen
    window.removeCharacterImage = function() {
        const characterImage = document.getElementById('character-image');
        const imageUpload = document.getElementById('image-upload');
        const uploadLabel = document.querySelector('.upload-label');
        const imageInstructions = document.querySelector('.image-instructions');
        const imageContainer = document.querySelector('.image-container');
        
        characterImage.src = '';
        characterImage.style.display = 'none';
        
        // Andere Elemente wieder anzeigen
        uploadLabel.style.display = 'inline-block';
        imageInstructions.style.display = 'block';
        imageContainer.classList.remove('image-only-mode');
        
        // Aus dem localStorage entfernen
        localStorage.removeItem('characterImage');
        
        // Datei-Input zurücksetzen
        imageUpload.value = '';
    };
});