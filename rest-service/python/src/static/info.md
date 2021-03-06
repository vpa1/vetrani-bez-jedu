# O aplikaci

Aplikace má za úkol přiblížit obyvatelům Ostravy informaci o zdrojích znečišťování na území města. Část zdrojů kromě zdraví škodlivých znečisťujících látek emituje i látky obtěžující zápachem. Domníváme se, že je vhodné, aby občan, který je obtěžován zápachem mohl odhadnout co je jeho zdrojem, případně se podle očekávaných směrů větru zařídit (např. neotevírat okno). Aplikace zobrazuje pouze očekávaný směr větru na pozicích zdrojů, nejedná se o výstup rozptylového modelu.

Zatím jsou v aplikaci uvedeny bodové zdroje, emitující benzo(a)pyren a benzen, přičemž jejich příspěvek v obydlené oblasti je větší, než hodnota zákonného imisního limitu (červená barva) a zdroje, jejichž příspěvek je ve vztahu k překročenému imisnímu limitu významný (oranžová barva). V této verzi aplikace zatím nejsou uvedeny zdroje znečišťování prachovými částicemi. Dále jsou zde uvedeny významné zdroje obtěžování zápachem (např. Biocel Paskov), ty jsou barevně odlišeny hnědou barvou.

V aplikaci jsou rovněž zobrazeny stanice státní imisní monitorovací sítě a u nich naměřené koncentrace polétavého prachu ve frakci PM<sub>10</sub>. Jedná se o nevalidovaná data a jsou poskytována zcela bez záruky.

Motivací ke vzniku aplikace byla situace v centrálním obvodu Moravská Ostrava a Přívoz, kdy jsou v oblasti a přilehlém okolí zdroje znečišťování, které mají přímý vliv na kvalitu života ve čtvrti. Zdroj, který přímo podnítil vznik aplikace je Koksovna Svoboda firmy OKK Koksovny, a. s. Jedná se o koksovnu, obklopenou zástavbou, stojící na lokalitě od r. 1907. Do kilometru od závodu je několik mateřských škol a školek. Závod obtěžuje své okolí zápachem i škodlivými emisemi. Imisní příspěvek závodu pro benzo(a)pyren v jeho blízkém okolí je [dle imisního modelování](https://labgis.vsb.cz/test2/Project/Ostrava) vyšší, než zákonný imisní limit. 

Podobná situace bude v městském obvodu Radvanice a Bartovice, kde se nachází koksovna Liberty Ostrava (3 baterie). Na měřící stanici v Radvanicích jsou pravidelně měřeny nejvyšší koncentrace benzo(a)pyrenu v ČR. Vysoké koncentrace jsou zde měřeny i v létě, což ukazuje na průmyslový původ znečištění. 

Aplikace je zveřejněna jako svobodný software na [<i class="fab fa-github"></i> githubu](https://github.com/vpa1/vetrani-bez-jedu/).

# O datech

K zobrazování dat předpovědí směru větru používáme data z předpovědního modelu ICON Německé meteorologické služby (DWD). Tyto data jsou poskytována v režimu tzv. otevřených dat. Staniční data o aktuálním směru větru nemáme k dispozici, protože ČHMÚ je ve formě otevřených dat neposkytuje. K zobrazování je použito API mapy.cz. Výseče zobrazující směr větru u zdrojů ukazují přibližný směr a jejich šířka zahrnuje předpokládanou nejistotu modelu. Rozsah výseče (dosah) je stanoven kvalifikovaným odhadem.

Data jsou poskytována bez záruky, vzhledem k tomu, že se jedná o modelová data, při určitých povětrnostních situacích (bouřka, ...) dochází k rozporu těchto data se skutečností, což je třeba brát na vědomí.

Okamžitá nevalidovaná data o naměřeních koncentracích frakce polétavého prachu PM<sub>10</sub> jsou získávána jako otevřená strojově čitelná data z [informačního systému kvality ovzduší](http://portal.chmi.cz/files/portal/docs/uoco/web_generator/actual_hour_data_CZ.html), provozovaného [Českým Hydrometeorologickým ústavem](http://portal.chmi.cz/). 

# Kontakt

Provozovatelem aplikace je Krajský expertní tým životního prostředí při [krajském sdružení Pirátské strany v Moravskoslezském kraji](https://moravskoslezsky.pirati.cz). Autorem kódu a odborným garantem je Václav Parchaňský, politickým garantem je místostarosta obvodu Moravská Ostrava a Přívoz [Rostislav Řeha](https://ostrava.pirati.cz/lide/rostislav-reha/). Podněty a připomínky prosím zasílejte na mail [vetrani@chemici.eu](mailto:vetrani@chemici.eu). Podněty a připomínky je rovněž možné psát do příslušného tématu [pirátského fóra](https://forum.pirati.cz/viewtopic.php?p=651186&sid=c64f7f54a13e4c7fc0fc84c6a1e7094c#p651186).