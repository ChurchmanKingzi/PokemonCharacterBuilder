// fertigkeitService.js - Service für Fertigkeitsbeschreibungen

const fertigkeitService = {
    getBeschreibung: function(fertigkeitName) {
        // Normalisiere den Namen für den Vergleich (entferne Leerzeichen, Umlaute, etc.)
        const normalisierterName = this.normalisiereName(fertigkeitName);
        // Suche nach der Fertigkeit in den Beschreibungen
        console.log(normalisierterName);
        if (this.beschreibungen[normalisierterName]) {
            return this.beschreibungen[normalisierterName];
        }
        
        // Fallback, wenn keine Beschreibung gefunden wurde
        return "Keine Beschreibung verfügbar.";
    },
    
    normalisiereName: function(name) {
        // Entferne Leerzeichen, ersetze Umlaute, wandle in Kleinbuchstaben um
        return name.toLowerCase()
            .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss')
            .replace(/\s+/g, '')
            .replace(/\//g, '')
            .replace(/\(/g, '').replace(/\)/g, '');
    },
    
    // Alle Fertigkeitsbeschreibungen
    beschreibungen: {
        // KÖ - Körper Fertigkeiten
        'akrobatik': 'Fertigkeiten in allen Arten von Bewegung, wie Springen, Rollen, Balancieren. Wird als Standin für Geschicklichkeit benutzt. Erhöht deine BW um 3 pro Punkt.',
        'angeln': 'Fähigkeit, Items und Wasser-Pokémon mit einer Angel zu fangen. Je höher, desto seltener die Pokémon, die du angeln kannst.',
        'ausweichen': 'Fähigkeit, körperlichen Angriffen auszuweichen. Wird zu deinem PA-Wert hinzuaddiert.',
        'handwerk': 'Praktische Fertigkeiten wie Reparieren, Bauen und Herstellen von Gegenständen.',
        'horchen': 'Fähigkeit, leise oder weit entfernte Geräusche zu hören und deren Quelle zu identifizieren.',
        'kampfsport': 'Training in waffenlosem Kampf. Wird auf GENA-Proben ohne Waffe draufaddiert.',
        'klettern': 'Fähigkeit, an Wänden, Bäumen und anderen vertikalen Flächen hochzuklettern.',
        'musizieren': 'Fähigkeit, Instrumente zu spielen, Musik zu machen und zu singen. Kann bestimmte Pokémon anlocken oder beruhigen.',
        'nahkampf': 'Fertigkeit im Umgang mit Nahkampfwaffen wie Stöcken, Messern oder Schwertern. Wird bei Angriffen mit solchen Waffen auf GENA addiert.',
        'reiten': 'Fähigkeit, auf Pokémon zu reiten und sie zu lenken. Für die meisten Spezies wird ein Sattel benötigt oder die Probe wird erschwert.',
        'schiessen': 'Fertigkeit im Umgang mit Fernkampfwaffen wie Bögen, Schleudern oder Pistolen. Wird beim Umgang mit solchen Waffen auf GENA addiert.',
        'schleichenverstecken': 'Fähigkeit, sich lautlos zu bewegen und sich effektiv zu verstecken.',
        'schliesstechnik': 'Fähigkeit, Schlösser zu öffnen, sowohl mit Werkzeug als auch (wenn das Schloss simpel genug ist) mit Improvisation.',
        'schwimmen': 'Fähigkeit, sich im Wasser fortzubewegen und längere Zeit über Wasser zu halten. Beinhaltet auch tauchen.',
        'sinnesscharfe': 'Allgemeine Schärfe aller Sinne. Wichtig für das Bemerken von versteckten Dingen oder Gefahren.',
        'springen': 'Fähigkeit, weit oder hoch zu springen. Nützlich, um Hindernisse zu überwinden.',
        'starke': 'Körperliche Kraft. Bestimmt, wie viel du tragen kannst und kann für Manöver wie das Aufbrechen von Türen oder das Sprengen von Fesseln genutzt werden.',
        'stehlen': 'Fähigkeit, unbemerkt Gegenstände an sich zu nehmen oder Taschendiebstahl zu begehen.',
        'tanzen': 'Fähigkeit, rhythmisch zu tanzen. Kann bei bestimmten sozialen Situationen oder für Pokémon-Performances nützlich sein.',
        'werfen': 'Präzision und Kraft beim Werfen von Gegenständen, einschließlich Pokébällen. Um ein entferntes oder sich bewegendes Pokemon zu fangen, ist vor der Fangen-Probe eine Werfen-Probe nötig. Kann im Kampf auf GENA addiert werden, um z.B. Messer zu werfen.',
        'widerstand': 'Resistenz gegen Erschöpfung, Gift, Alkohol und andere körperliche Beeinträchtigungen. Hierauf wird gewürfelt, um Paralyse zu widerstehen, sich von Gift zu erholen usw.',
        
        // WI - Weisheit Fertigkeiten
        'archaologie': 'Wissen über alte Zivilisationen, Ruinen und Artefakte.',
        'computernutzung': 'Fähigkeit, mit Computern, technischen Geräten und digitalen Systemen umzugehen. Schließt unter anderem Online-Recherche ein.',
        'erstehilfe': 'Medizinische Grundkenntnisse zur Behandlung von Verletzungen und Krankheiten. Wird gewürfelt, um KP anderer zu heilen und Wunden notzuversorgen.',
        'fahrzeugelenken': 'Fähigkeit, verschiedene Fahrzeuge wie Fahrräder, Autos oder Boote zu steuern.',
        'forensik': 'Wissen über die wissenschaftliche Untersuchung von Beweisen und Spuren.',
        'gefahreninstinkt': 'Intuition für bevorstehende Gefahren. Ermöglicht es dir, auf drohende Gefahren zu reagieren, bevor sie eintreten.',
        'geschichte': 'Wissen über historische Ereignisse, Persönlichkeiten und Entwicklungen. Schließt auch Wissen um moderne wichtige Persönlichkeiten wie Arenaleiter mit ein.',
        'kryptografie': 'Fähigkeit, Codes und verschlüsselte Nachrichten zu erstellen und zu knacken. Kann zum Hacken genutzt werden.',
        'medizin': 'Tiefgreifendes medizinisches Wissen zur Diagnose und Behandlung von schweren Verletzungen und Krankheiten. Mit dem nötigen Equipment und genug Zeit können hiermit Wunden entfernt werden.',
        'meteorologie': 'Wissen über Wetter, Klimamuster und Wettervorhersage. Erlaubt es, das Wetter des nächsten Tages vorherzusehen.',
        'mineralogie': 'Wissen über Mineralien, Gesteine und geologische Formationen.',
        'naturwissenschaften': 'Allgemeines Wissen in den Bereichen Physik, Chemie und Biologie.',
        'okkultismus': 'Wissen über das Übernatürliche, Geister, Legenden und mystische Phänomene.',
        'orientierung': 'Fähigkeit, die eigene Position zu bestimmen und den Weg zu finden, mit oder ohne Karte oder Kompass.',
        'recherchebucher': 'Fähigkeit, Informationen in Büchern, Archiven und anderen schriftlichen Quellen zu finden.',
        'reparieren': 'Fähigkeit, beschädigte Gegenstände, Maschinen oder Geräte zu reparieren. Beinhaltet explizit komplexe Mechaniken wie Motoren.',
        'umgangmitpokemon': 'Fähigkeit, mit Pokémon zu kommunizieren, sie zu beruhigen und ihr Vertrauen zu gewinnen.',
        'wildnislebensurvival': 'Fähigkeit, in der Wildnis zu überleben, Nahrung zu finden, Unterkünfte zu bauen und die Natur zu nutzen. Schließt Wissen über essbare Pflanzen, Techniken zum Feuermachen, das Bauen von Unterständen und mehr ein.',
        'wissenuberpokemon': 'Theoretisches Wissen über Pokémon-Arten, ihre Fähigkeiten, Verhaltensweisen und Lebensräume.',
        
        // CH - Charisma Fertigkeiten
        'anfuhren': 'Fähigkeit, andere zu führen, zu motivieren und zu inspirieren. Ansprachen, die in erfolgreichen Anführen-Proben gipfeln, können verbündeten Zielen zusätzliche Würfel für Proben gewähren oder helfen, das Vertrauen von Leuten zu gewinnen oder sie dazu zu bringen, etwas Gefährliches oder Dummes zu tun.',
        'auftreten': 'Fähigkeit, vor Publikum aufzutreten, sei es durch Reden, Schauspiel oder andere Darbietungen. Hierauf kannst du auch würfeln, um einen guten ersten Eindruck zu machen.',
        'beeindrucken': 'Fähigkeit, andere durch Leistung, Erscheinung oder Verhalten zu beeindrucken.',
        'beruhigen': 'Fähigkeit, aufgeregte oder aggressive Personen oder Pokémon zu beruhigen.',
        'betoren': 'Fähigkeit, andere durch Charme und Attraktivität zu manipulieren oder abzulenken. Kann soweit gehen, jemanden dauerhaft in dich verliebt zu machen. Erfordert, dass das Ziel grundsätzlich an deinem Geschlecht interessiert ist.',
        'einschuchtern': 'Fähigkeit, andere durch Drohungen, Einschüchterung oder imposantes Auftreten zu beeinflussen und mehr oder weniger dazu zu zwingen, etwas zu tun.',
        'etikette': 'Wissen über soziale Normen, Umgangsformen und angemessenes Verhalten in verschiedenen Situationen.',
        'feilschen': 'Fähigkeit, bei Handelsgeschäften bessere Preise zu verhandeln.',
        'gaslighten': 'Fähigkeit, andere dazu zu bringen, ihre eigene Wahrnehmung oder ihr Urteilsvermögen anzuzweifeln.',
        'lippenlesen': 'Fähigkeit, Gespräche zu verstehen, indem man die Lippenbewegungen beobachtet.',
        'lugen': 'Fähigkeit, überzeugend zu lügen und Täuschungen aufrechtzuerhalten.',
        'psychologie': 'Wissen über Verhalten, Gedanken und Emotionen von Mensch und Pokemon. Kann genutzt werden, um Lügen zu erkennen und Intentionen zu erahnen.',
        'schauspielern': 'Fähigkeit, verschiedene Persönlichkeiten und Emotionen überzeugend darzustellen.',
        'stimmennachahmen': 'Fähigkeit, die Stimmen anderer Personen oder Pokémon zu imitieren.',
        'uberreden': 'Fähigkeit, andere so lange zu belabern, bis man sie kurzfristig zu etwas zu überredet hat, was sie normalerweise nicht tun würden.',
        'uberzeugen': 'Fähigkeit, andere durch logische Argumente und Charisma von einem Standpunkt zu überzeugen.',
        
        // GL - Glück Fertigkeiten
        'fangen': 'Fähigkeit, Pokémon erfolgreich mit Pokébällen zu fangen. Erhöht die Erfolgsrate beim Fangen.',
        'spielen': 'Fähigkeit in Glücksspielen und Gesellschaftsspielen. Verbessert deine Gewinnchancen. Außerdem die Fähigkeit, besonders viel Spaß beim Spielen mit deinen Pokemon zu haben und ihnen so näherzukommen.',
        'suchen': 'Fähigkeit, verborgene Gegenstände oder Hinweise zu finden. Je höher, desto wertvoller die gefundenen Items.'
    }
};
