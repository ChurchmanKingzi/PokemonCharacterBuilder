// nachteilService.js
const nachteilService = {
    getAllNachteile: function() {
        return [
            {
                id: 'absolut ehrlich',
                name: 'Absolut Ehrlich',
                beschreibung: 'Du kannst niemals lügen, egal, was passiert. Es ist dir physisch unmöglich.'
            },
            {
                id: 'alpträume',
                name: 'Alpträume',
                beschreibung: 'Du wirst nachts ständig von Alpträumen geplagt. Egal, wie lange du schläfst, du regenerierst dabei maximal 50% deiner maximalen KP (statt alle).'
            },
            {
                id: 'angst-vor-pokemon',
                name: 'Angst vor Pokemon',
                beschreibung: 'Du hast panische Angst vor Pokemon, die irgendwie gefährlich wirken, zu dem Punkt, dass du selbst nie sowas wie ein Ursaring besitzen könntest und niemals im selben Zelt wie ein Nidoking schlafen würdest. Deine eigenen Pokemon sind dabei explizit nicht ausgenommen, pass also genau auf, was du fängst...'
            },
            {
                id: 'arm',
                name: 'Arm',
                beschreibung: 'Du besitzt nicht viel. Wähle KEINE Gegenstände aus der Item-Auswahl.'
            },
            {
                id: 'gejagt',
                name: 'Gejagt',
                beschreibung: 'Du hast irgendjemanden in deinem Leben richtig wütend gemacht oder anderweitig seine Aufmerksamkeit in der schlechtestmöglichen Weise auf dich gezogen. Diese Person oder Organisation (die du dir im Rahmen deiner Backstory ausdenkst) wird euch, aber dich im Besonderen, verfolgen und euch immer wieder begegnen. Sie ist explizit extrem gefährlich, mit Pokemon, die ihr im direkten Kampf kaum besiegen könnt, und stellt eine lebensbedrohliche Gefahr für dich und jeden, der dazwischenspringt, dar!'
            },
            {
                id: 'glasknochen',
                name: 'Glasknochen',
                beschreibung: 'Dein Körper ist extrem labil. Immer, wenn du Schaden nimmst, der eigentlich keine Wunde verursachen würde, musst du entweder auf KÖ oder GL würfeln (deine Wahl). Erzielst du nicht mindestens einen Erfolg, erleidest du eine Wunde. Solange du bewusstlos bist, entfällt die Probe und du nimmst immer eine Wunde.'
            },
            {
                id: 'halluzinationen',
                name: 'Halluzinationen',
                beschreibung: 'Du siehst, hörst und … erlebst manchmal Dinge, die nur du so wahrnimmst. Der Spielleiter wird dir wie selbstverständlich falsche Informationen geben und dich nicht vorwarnen, ob und seit wann du Dinge falsch wahrnimmst.'
            },
            {
                id: 'langschlaefer',
                name: 'Langschläfer',
                beschreibung: '(Kann nicht mit Frühaufsteher kombiniert werden) Du brauchst ganz besonders viel Schlaf. Wenn man dich nicht mindestens 12 Stunden am Stück schlafen lässt, bist du zu nichts zu gebrauchen; ständig im Halbschlaf, mies gelaunt, die KP nur teilweise geheilt usw. Solange du müde bist, haben alle Proben für dich eine nach Ermessen des Spielleiters erhöhte Schwierigkeit.'
            },
            {
                id: 'pazifist',
                name: 'Pazifist',
                beschreibung: 'Du hasst es, anderen Schaden zuzufügen, und würdest das (im Normalfall) niemals tun. Du kannst deinen Pokemon den Einsatz offensiver Attacken (auch solche, die keinen direkten Schaden zufüügen, etwa Giftpuder oder Irrlicht) nur befehlen, wenn das Ziel dich aktiv bedroht oder du bereits Schaden durch es genommen hast. Wenn du oder eines deiner Pokemon jemandem Schaden zufügt, musst du eine Widerstand-Probe bestehen oder verfällst in Schockstarre. Natürlich ist es dir auch zuwider, wenn deine Verbündeten andere angreifen; Notwehr ist aber okay.'
            },
            {
                id: 'pechvbogel',
                name: 'Pechvogel',
                beschreibung: 'Wenn du bei einer Probe patzt, zählt der Patzer als eine Stufe schlimmer (z.B. eine Eins → 2 Einsen).'
            },
            {
                id: 'phobie',
                name: 'Phobie',
                beschreibung: 'Wähle eine sehr gewöhnliche Phobie (Höhe, Feuer, Dunkelheit...). Du hast diese Phobie in einem extremen Ausmaß und kannst Proben nicht einmal versuchen, solange du mit der Phobie konfrontiert bist.'
            },
            {
                id: 'schuechtern',
                name: 'Schüchtern',
                beschreibung: 'Du kannst absolut nicht mit Menschen umgehen. Solange du mehr als eine Person in der Nähe hast, die du nicht bereits gut kennst, bist du ein nervliches Wrack. Außerdem sind alle Proben auf folgende Fertigkeiten für dich um 2 Stufen erschwert: Anführen, Betören, Einschüchtern, Lügen, Schauspielern, Überreden, Überzeugen'
            },
            {
                id: 'stur',
                name: 'Stur',
                beschreibung: 'Du kannst es einfach nicht akzeptieren, etwas nicht zu schaffen. Wenn du eine Probe nicht schaffst, aber auch nicht patzt, musst du sie solange weiter versuchen, bis du sie schaffst oder dabei patzt (allerdings wird die Probe weiterhin bei jedem Versuch schwerer).'
            },
            {
                id: 'unterdrückte persönlichkeit',
                name: 'Unterdrückte Persönlichkeit',
                beschreibung: 'Tief in deinem Unterbewusstsein lebt ein zweites Du, das in jeder Hinsicht dein Gegenteil ist. Bist du vorsichtig, ist es risikofreudig. Bist du freundlich, ist es ein Arschloch. Und so weiter. Immer, wenn deine KP unter die Hälfte ihres Maximums fallen, kommt deine andere Persönlichkeit zum Vorschein und bleibt solange aktiv, bis du über 50% deiner max KP geheilt bist und dich nicht in einer Stresssituation (etwa im Kampf) befindest. Beide Persönlichkeiten haben VERSCHIEDENE GEDÄCHTNISSE und wissen beide nicht, wie man den Persönlichkeitswechsel triggern kann.'
            },
            {
                id: 'verflucht',
                name: 'Verflucht',
                beschreibung: 'Ein Geist-Pokemon hat dir in jungen Jahren einen üblen Fluch verpasst. Deine Glücks-Tokens regenerieren sich niemals.'
            },
            {
                id: 'vorsichtig',
                name: 'Vorsichtig',
                beschreibung: 'Du bist übervorsichtig. Wenn eine Probe nicht auf Anhieb klappt, kannst du sie nicht forcieren.'
            }
        ];
    }
};
