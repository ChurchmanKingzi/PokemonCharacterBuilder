// itemService.js
const itemService = {
    getAllItems: function() {
        return [
            {
                id: '10-traenke',
                name: '10 Tränke',
                beschreibung: 'Heilen je 20 KP ODER 20% max KP.',
                anzahl: 10
            },
            {
                id: '5-supertraenke',
                name: '5 Supertränke',
                beschreibung: 'Heilen je 50 KP ODER 50% max KP.',
                anzahl: 5
            },
            {
                id: '10-gegengifte',
                name: '10 Gegengifte',
                beschreibung: 'Heilen Vergiftung.',
                anzahl: 10
            },
            {
                id: '10-paraheiler',
                name: '10 Paraheiler',
                beschreibung: 'Heilen Paralyse.',
                anzahl: 10
            },
            {
                id: '10-eisheiler',
                name: '10 Eisheiler',
                beschreibung: 'Heilen Erfrierung.',
                anzahl: 1
            },
            {
                id: '10-feuer-heiler',
                name: '10 Feuer-Heiler',
                beschreibung: 'Heilen Verbrennung.',
                anzahl: 10
            },
            {
                id: '5-hyperheiler',
                name: '5 Hyperheiler',
                beschreibung: 'Heilen alle Statuseffekte.',
                anzahl: 5
            },
            {
                id: 'pokefloete',
                name: 'Pokeflöte',
                beschreibung: 'Kann mit Musizieren gespielt werden, um alle schlafenden Ziele in Hörweite aufzuwecken. Hat einen wunderschönen Klang.',
                anzahl: 1
            },
            {
                id: '3-beleber',
                name: '3 Beleber',
                beschreibung: 'Weckt ein bewusstloses Pokemon auf und entfernt eine seiner Wunden. Das Pokemon erhält 50% seiner maximalen KP zurück (aufgerundet).',
                anzahl: 3
            },
            {
                id: '10-sinelbeeren',
                name: '10 Sinelbeeren',
                beschreibung: 'Heilen 10 KP ODER 10% max KP. Können einem Pokemon zum Tragen gegeben werden, damit es sie im Kampf als zusätzliche Aktion isst und sich so heilt.',
                anzahl: 10
            },
            {
                id: '3-tsitrubeeren',
                name: '3 Tsitrubeeren',
                beschreibung: 'Heilen 50% der KP eines Pokemon (aufgerundet). Kann einem Pokemon zum Tragen gegeben werden, damit es sie im Kampf als zusätzliche Aktion isst und sich so heilt.',
                anzahl: 3
            },
            {
                id: '8-status-beeren',
                name: '8 Status-Beeren',
                beschreibung: 'Wähle eine beliebige Kombination aus folgenden: Amrenabeeren (heilen Paralyse), Pirsifbeeren (heilen Vergiftung), Fragiabeeren (heilen Verbrennung), Persimbeeren (heilen Verwirrung), Wilbirbeeren (heilen Erfrierung). Sie können einem Pokemon zum Tragen gegeben werden, damit es sie im Kampf als zusätzliche Aktion isst und sie den Zustand sofort heilt.',
                anzahl: 8
            },
            {
                id: '2-prunusbeeren',
                name: '2 Prunusbeeren',
                beschreibung: 'Heilen jede Statusveränderung. Können einem Pokemon zum Tragen gegeben werden, damit es sie im Kampf als zusätzliche Aktion isst und sich so heilt.',
                anzahl: 2
            },
            {
                id: '2-lydzibeeren',
                name: '2 Lydzibeeren',
                beschreibung: 'Kann einem Pokemon zum Tragen gegeben werden, damit es sie im Kampf als zusätzliche Aktion isst und so für den Rest des Kampfes seinen ANG-Wert verdoppelt.',
                anzahl: 2
            },
            {
                id: '2-tahaybeeren',
                name: '2 Tahaybeeren',
                beschreibung: 'Kann einem Pokemon zum Tragen gegeben werden, damit es sie im Kampf als zusätzliche Aktion isst und so für den Rest des Kampfes seinen SPEZ ANG-Wert verdoppelt.',
                anzahl: 2
            },
            {
                id: '2-linganbeeren',
                name: '2 Linganbeeren',
                beschreibung: 'Kann einem Pokemon zum Tragen gegeben werden, damit es sie im Kampf als zusätzliche Aktion isst und so für den Rest des Kampfes seinen VERT-Wert verdoppelt.',
                anzahl: 2
            },
            {
                id: '2-aprikobeeren',
                name: '2 Aprikobeeren',
                beschreibung: 'Kann einem Pokemon zum Tragen gegeben werden, damit es sie im Kampf als zusätzliche Aktion isst und so für den Rest des Kampfes seinen SPEZ VERT-Wert verdoppelt.',
                anzahl: 2
            },
            {
                id: '2-salkabeeren',
                name: '2 Salkabeeren',
                beschreibung: 'Kann einem Pokemon zum Tragen gegeben werden, damit es sie im Kampf als zusätzliche Aktion isst und so für den Rest des Kampfes seine Initiative verdoppelt.',
                anzahl: 2
            },
            {
                id: 'beerenkultivator',
                name: 'Beerenkultivator',
                beschreibung: 'Ein Glaskasten, in dem Beeren angebaut werden können. Hat Platz für bis zu 2 Beeren zur Zeit, die innerhalb von 2 Tagen wachsen und dann jeweils 1W4 Beeren abwerfen.',
                anzahl: 1
            },
            {
                id: '5-tagesrationen',
                name: '5 Tagesrationen',
                beschreibung: 'Genug zu essen, um einen ganzen Tag gut genährt auszukommen. Extrem haltbar und gut verpackt, übersteht mühelos Stürze aus großer Höhe, Untertauschen in Wasser usw.',
                anzahl: 5
            },
            {
                id: '20-mal-pokemonfutter',
                name: '20 mal Pokemon-Futter',
                beschreibung: 'Kleine Tütchen mit hochkonzentriertem Pokemon-Futter. Trockenfutter. Ein Tütchen macht ein Pokemon (egal, wie groß es ist) für einen Tag satt und ist sehr lecker und bekömmlich für es, aber komplett ungenießbar für Menschen. Das Futter hält sich Jahre, die Tütchen sind aber relativ leicht zu beschädigen!',
                anzahl: 20
            },
            {
                id: 'angelkoeder',
                name: 'Angelköder',
                beschreibung: 'Eine kleine Box voller aromatischer Köder. Diese sind nicht nötig, um zu angeln, ohne sie kann es aber leicht sein, dass selbst bei einer erfolgreichen Probe kein Pokemon am Haken hängt. Gewähren +1 automatischen Erfolg auf Angeln-Proben.',
                anzahl: 100
            },
            {
                id: 'baerenfalle',
                name: 'Bärenfalle',
                beschreibung: 'Eine schwere Eisenfalle, die mächtig wehtut, wenn man reintritt. Halbiert die aktuellen KP des Ziels (abgerundet) und fügt garantiert immer mindestens eine Wunde zu. Hält das Ziel außerdem an Ort und Stelle fest und tut gewaltig weh. Die Bärenfalle zu entfernen, erfordert eine Probe auf Stärke. Der Einsatz von Bärenfallen in der Pokemon-Welt ist sehr verpönt und in manchen Gegenden straightup illegal.',
                anzahl: 1
            },
            {
                id: 'elektroschocker',
                name: 'Elektroschocker',
                beschreibung: 'Ein starker Taser. Das Ziel muss eine Widerstand-Probe mit Schwierigkeit 2 bestehen oder wird paralysiert. Der Taser hat 3 Ladungen, bevor er aufgeladen werden muss. Jede Ladung ist ein Einsatz, aber du kannst auch Ladungen ausgeben, um den Taser stärker einzustellen. Pro zusätzlich ausgegebener Ladung wird die Widerstand-Probe um 1 schwerer. Kommt außerdem mit einem Ladekabel und kann normal an jeder Steckdose aufgeladen werden. 10 Minuten Ladezeit pro Charge.',
                anzahl: 1
            },
            {
                id: 'flaregun',
                name: 'Flaregun',
                beschreibung: 'GENA + Schießen. Kommt mit 5 Flares. Kann Signale abschießen oder auf ein Ziel geschossen werden, um es zu verbrennen.',
                anzahl: 5
            },
            {
                id: 'pfeil-und-bogen',
                name: 'Pfeil und Bogen',
                beschreibung: 'GENA + Schießen. Erlaubt es dir, folgende Attacke auszuführen: BOGENSCHUSS. Typ Flug, 5W6 Schaden. Bis zu 40 Meter Reichweite, ab 20 Metern Schwierigkeit +1. 10 Pfeile, die recycled werden können.',
                anzahl: 10
            },
            {
                id: 'pokemon-sichere-kleidung',
                name: 'Pokemon-Sichere Kleidung',
                beschreibung: 'Extrem widerstandsfähige Klamotten. Werden damit beworben, jedem Pokemon-Angriff widerstehen zu können. Das ist offensichtlich Unsinn. Aber du nimmst nur halben Schaden von speziellen Attacken, da die Kleidung dich tatsächlich gut abschirmt. Physischer Schaden ist nicht betroffen. Wenn die Kleidung zu viel mitmacht, kann sie auch kaputt gehen!',
                anzahl: 10
            },
            {
                id: 'camping-set',
                name: 'Camping-Set',
                beschreibung: 'Ein kleines Zelt (bequem für 2 Personen, mit viel Kuscheln maximal 4), ein einzelner Schlafsack, ein Topfset usw.',
                anzahl: 1
            },
            {
                id: 'rucksack',
                name: 'Erweiterter Rucksack',
                beschreibung: 'Ein erweiterter Rucksack mit zusätzlichen Fächern für mehr Stauraum. Extrem stabil und wetterfest. Beliebiges cooles Design.',
                anzahl: 1
            },
            {
                id: 'coole-sonnenbrille',
                name: 'Coole Sonnenbrille',
                beschreibung: 'Sieht extrem cool aus. Du erhältst 2 Bonus-Würfel bei Proben auf folgende Fertigkeiten, solange du sie trägst: Betören, Einschüchtern, Überreden',
                anzahl: 1
            },
            {
                id: 'dietrichset',
                name: 'Dietrichset',
                beschreibung: 'Das nötige Werkzeug, um Schließtechnik ordentlich auszuführen. Ohne dieses Werkzeug werden Proben je nach Schloss und Umständen um bis zu 4 Stufen erschwert oder sogar komplett unmöglich.',
                anzahl: 1
            },
            {
                id: 'erste-hilfe-kasten',
                name: 'Erste-Hilfe-Kasten',
                beschreibung: 'Enthält Verband, Schere, Skalpell, Desinfektionsmittel usw. Nötig, um Wunden auch nur notdürftig zu versorgen! Kann außerdem (mittels Erste Hilfe) genutzt werden, um die KP eines Ziels binnen einer Stunde um 50% ihres Maximums (aufgerundet) zu heilen. Proben auf Erste Hilfe OHNE dieses Item können ein Ziel höchstens wecken, aber keine KP wiederherstellen.',
                anzahl: 1
            },
            {
                id: 'ewigstein',
                name: 'Ewigstein',
                beschreibung: 'Solange ein Pokemon diesen Stein hält, kann es sich nicht entwickeln. Kontakt mit dem Stein bricht auch eine sich gerade vollziehende Entwicklung ab.',
                anzahl: 1
            },
            {
                id: 'feuerzeug',
                name: 'Feuerzeug',
                beschreibung: 'Macht Feuer. Ist noch voll, wird also lange halten.',
                anzahl: 1
            },
            {
                id: '5-flaschen-honig',
                name: '5 Flaschen Honig',
                beschreibung: 'Der Honig kann genutzt werden, um Pokemon anzulocken. Die Flaschen, nachdem sie geleert sind, können z.B. mit Kuhmuh-Milch gefüllt werden.',
                anzahl: 5
            },
            {
                id: 'giftpfiolen',
                name: '5 Giftphiolen',
                beschreibung: 'Destilliertes Arbok-Gift in kleinen Fläschchen. Belegt Ziele mit dem Schwer-Vergiftet-Status (wie Toxin). Das Gift wirkt sofort, wenn es konsumiert wird, und langsam über eine Stunde hinweg, wenn es über die Haut aufgenommen wird. Ein Fläschchen hat genau eine Dosis für ein Ziel. Die Fläschchen selbst halten 20 Milliliter Flüssigkeit. Um dem Gift zu widerstehen, sind zunächst 4 Erfolge auf Widerstand nötig. Nach jeder Runde verringert sich die Schwierigkeit um 1, auf ein Minimum von 1.',
                anzahl: 1
            },
            {
                id: 'kescher',
                name: 'Kescher',
                beschreibung: 'Kann genutzt werden, um im Wasser oder Wald Pokemon einzufangen und mitzunehmen, ohne sie in einen Pokeball zu tun. Fasst Pokemon von bis zu einem Meter Größe.',
                anzahl: 1
            },
            {
                id: 'kraehenfuesse',
                name: 'Krähenfüße',
                beschreibung: 'Eisenspitzen, die auf dem Boden ausgestreut werden können, um Verfolger aufzuhalten oder eine Falle zu stellen. Hat denselben Effekt wie die Attacks Stachler.',
                anzahl: 1
            },
            {
                id: 'nachtsichtgeraet',
                name: 'Nachtsichtgerät',
                beschreibung: 'Erlaubt es, eingeschränkt in der Dunkelheit zu sehen. Erfordert Licht (Mond, Sterne...) und gewährt eine Sicht wie in der Dämmerung.',
                anzahl: 1
            },
            {
                id: 'poke-phone',
                name: 'Poke-Phone',
                beschreibung: 'Ein modernstes Smartphone, in dem du die Nummern von anderen Trainern speichern, dich unterhalten und Rematches planen kannst. Wie willst du sonst von Joeys Rattfratz hören? Hat außerdem Internet. Alle Funktionen eines modernen Smartphones.',
                anzahl: 1
            },
            {
                id: '5-rauchbomben',
                name: '5 Rauchbomben',
                beschreibung: 'Rauchbomben, die auf den ersten Blick aussehen wie Pokebälle. Wenn sie (nach einem Wurf) auf dem Boden aufschlagen, platzen sie auf und entlassen dicken, lilanen Qualm, der es unmöglich macht, in den Qualm oder aus dem Qualm zu sehen. Der Qualm verzieht sich nach etwa einer Minute. GENA-Proben in, aus oder durch den Qualm haben ihre Schwierigkeit um 4 erhöht.',
                anzahl: 5
            },
            {
                id: 'sattel',
                name: 'Sattel',
                beschreibung: 'Ein zusammenfaltbarer Sattel, der speziell für eine bestimmte Spezies Pokemon hergestellt wurde und es erlaubt, auf diesen zu reiten. Es ist zwar auch möglich, ohne Sattel auf Pokemon zu reiten, das erschwert die Reiten-Probe aber je nach Spezies um bis zu 3.',
                anzahl: 1
            },
            {
                id: '10-schutze',
                name: '10 Schutze',
                beschreibung: 'Hüllt Personen in eine Wolke aus unangenehmem Geruch, die wilde Pokemon für bis zu eine Stunde abhält. Wirkt nur auf eher schwache Pokemon; stärkere finden den Geruch zwar unangenehm, lassen sich davon aber nicht verjagen. Kann auch direkt in das Gesicht eines Pokemon gesprüht werden, um es in die Flucht zu schlagen. Für starke Pokemon ist wahlweise eine Probe auf Computernutzung oder Einschüchtern nötig, um sie in die Flucht zu schlagen.',
                anzahl: 10
            },
            {
                id: 'seil',
                name: 'Seil',
                beschreibung: 'Ein 200 Meter langes, reißfestes Seil. Kann auch von vorn herein in mehrere kleinere unterteilt sein. Hält bis zu 300 Kilo.',
                anzahl: 1
            },
            {
                id: 'taschenlampe',
                name: 'Taschenlampe',
                beschreibung: 'Macht Licht. Die Batterien halten etwa 8 Stunden, bevor sie ausgewechselt werden müssen. Wasserdicht!',
                anzahl: 1
            },
            {
                id: 'ueberreste',
                name: 'Überreste',
                beschreibung: 'Unappetitliche, aber extrem energiereiche Nahrung. Wird sie von einem Pokemon konsumiert, regeneriert dieses für eine Stunde alle 10 Sekunden (jede Kampfrunde) 10% seiner max KP.',
                anzahl: 1
            },
            {
                id: 'verkleidung',
                name: 'Verkleidung',
                beschreibung: 'Eine Polizeiuniform, ein Arztkittel oder etwas in der Art. Wähle ein „Kostüm“. Beachte, dass das Ausgeben als Polizist oder sonstiger Beamter natürlich ein Verbrechen ist. Beinhaltet auch eine gefälschte Marke oder einen gefälschten Ausweis, aber so schlecht gefälscht, dass Experten die Fälschung auf den ersten Blick erkennen. Beinhaltet außerdem ein kleines Makeup-Köfferchen und eine Perücke.',
                anzahl: 1
            },
            {
                id: 'wasserfilter',
                name: 'Wasserfilter',
                beschreibung: 'Erlaubt es, Fluss- oder Seewasser zu filtern und sicher trinkbar zu machen.',
                anzahl: 1
            },
            {
                id: 'wetterschutz',
                name: 'Wetterschutz',
                beschreibung: 'Ein großer, flexibler, aber gleichzeitig sehr robuster Regenmantel. Schützt vor Regel, aber auch Schnee, Hagel und sogar Sandsturm. Hält außerdem selbst in einem Blizzard relativ warm. Ist flexibel genug, um einem Pokemon von bis zu 3 Metern Größe umgelegt zu werden und macht dieses immun gegen Wettereffekte.',
                anzahl: 1
            }
        ];
    }
};
