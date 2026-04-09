import { useState, useCallback } from "react";

const SUBJECTS = [
  "English Reading",
  "Welsh Reading",
  "[Eng] Proc Numeracy",
  "[Wel] Proc Numeracy",
  "[Eng] Num Reasoning",
  "[Wel] Num Reasoning",
];

const TYPES = ["Standard", "Modified", "Braille"];

const BAND_MAP = {
  Y2: "LP", Y3: "LP",
  Y4: "UP", Y5: "UP", Y6: "UP",
  Y7: "SE", Y8: "SE", Y9: "SE",
};
const BANDS = ["LP", "UP", "SE"];

const BAND_LABELS = { LP: "Lower Primary (2–3)", UP: "Upper Primary (4–6)", SE: "Secondary (7–9)" };

const LEARNER_DATA = `Paul,Abrams,1
Charlotte,Ainsley,1
Courtney,Alberts,1
Portia,Atkins,1
Isaac,Barnes,1
Emma-Jane,Barnwell,1
James,Bolton,1
Matthew,Burrowes,1
Jack,Carlston,1
Kimberley,Cedric-Smith,1
Azi,Chidiadi,1
Felicity,Clark,1
Eira,Conwen,1
Joshua,Dennis,1
Roxanne,Fitzroy,1
Bradley,Flint,1
Elspeth,Gray,1
Elliott,Harris,1
Beatrice,Holden,1
Bridget,Hollins,1
Meghan,Howard,1
Aziza,Hussein,1
Andrei,Ion,1
Alejandro,Jakub,1
Elizabet,Kabacinski,1
George,Kieves,1
Zechariah,Kingsley,1
Arfon,Kyffin,1
Arwyn,Kyffin,1
Joshua,Leighton,1
Zeke,MacIntosh,1
Astrid,Martin,1
Peter,Mascott,1
Una,McClaughlin,1
Walter,Millers,1
Jessica,Milton,1
Ivy,Nilsons,1
Henry,Norrison,1
Benjamin,Pineton,1
Hagan,Qamar,1
Amanda,Reed,1
Alice,Rigley,1
Aika,Riku,1
Leona,Ronan,1
Amiaz,Sauzo,1
Holly,Sedgewick,1
Piers,Selbourne,1
Nina,Seymour,1
Marku,Sonin,1
Chloe,Stuart,1
Dhamesh,Sutantu,1
James,Taylor,1
Paul,Travers,1
Justin,Wesley-Jones,1
Michael,White,1
Micah,Wilder,1
Josephine,Wright,1
Jessica,Abbott,2
Shaquib,Abhra,2
Charlotte,Ackton,2
Michael,Alala,2
Chantal,Benson,2
Nadeem,Bhati,2
Magda,Bordet,2
Delphine,Burrows,2
Elliott,Cedric-Smith,2
Rosie,Cleeves,2
Joseph,Clinton,2
Ryan,Coopers,2
Beatrice,Cooper-Smith,2
Sadie,Coulter,2
Emma,Coulton,2
Sophie,Danes,2
Bryn,Daniels,2
James,Daniels,2
Millicent,Delanve,2
Paul,Ellis,2
Michael,Falmer,2
Jack,Fitzgerald,2
Christi,Gavil,2
Kiran,Hari,2
Rhys,Harris,2
Joseph,Hawes,2
Travis,Jones,2
Amara,Kaur,2
Amir,Kaur,2
Safia,Kaurs,2
Louis,Keeter,2
Fearne,Kender,2
Mariam,Khans,2
Nia,Lanes,2
Jian,Lin,2
Marika,Ludovak,2
Karina,Ludwika,2
Lidia,Ludwika,2
Araminta,Martin,2
Austin,McCann,2
Jennifer,McCarthy,2
Simon,Merkle,2
Adam,Micheals,2
Iris,Morgans,2
Roza,Nowak,2
Tiffany,Patterson,2
Nicholas,Reeve,2
Matthew,Roberts,2
Bradley,Rossiter,2
Madeline,Simones,2
Aafia,Singh,2
Aneeta,Singh,2
Alexandra,Sloane,2
Bethanie,Smythye,2
Theo,White,2
Paige,Whitemore,2
Emily,Wilsons,2
Dequan,Zheng,2
Sadie,Adams,3
Tatyana,Alyona,3
Richard,Andrews,3
Piers,Bartram,3
Eloise,Bennet,3
Tomaz,Bronislaw,3
Madison,Brooks,3
Harriette,Clarke,3
William,Clint,3
Jake,Cummins,3
Megan,Davey,3
Adam,Davies,3
Emma,Denton,3
Robert,Donnelly,3
Josef,Elliott,3
Finley,Erikson,3
Amber,Flemming,3
Richard,Foster,3
Saffron,Francis,3
Clarissa,Gilbey,3
Edgar,Gorev,3
Magdalene,Haddon,3
Satvinder,Hassan,3
Brooke,Hellerton,3
Mark,Hewitt,3
Isra,Inderjit,3
Tessa,Jackson,3
Omar,Jagitt,3
Aiden,Jarvis,3
Chrystin,Jones,3
Daniel,Jones,3
Ralf,Kevins,3
Sadia,Khan,3
Esme,Kovakz,3
Kimberley,Lewes,3
Daquan,Lok,3
Ching,Lowes,3
Arianna,Mantori,3
Scott,Masters,3
Matthew,Nelson,3
Kayne,Peters,3
Summer,Randell,3
Mira,Ritika,3
Luke,Roff,3
Heston,Ross,3
Lian,Sachi,3
Abigail,Saunders,3
Kaye,Sawyer,3
Jennifer,Smith,3
Gregory,Stuarts,3
Esita,Talak,3
Pheobe,Turner,3
Itul,Udank,3
Sienna,Vindgrodaw,3
Otis,Wade,3
Michael,Watson,3
Arielle,Wayne,3
Hugh,Wilson,3
Kasia,Wojciechii,3
Nancy,Adams,4
Candis,Alala,4
Olivia,Barden,4
Vincent,Bateman,4
Aini,Bhati,4
Claudiu,Boian,4
Ingrid,Brown,4
Konrad,Broz,4
Matthew,Cairns,4
Michael,Canzano,4
Eleanor,Carlton,4
Thomas,Carter,4
Julia,Chaban,4
Jaden,Chava,4
Sila,Chava,4
Tamsin,Colman,4
Andrew,Cooper,4
Lily,Dennis,4
Jake,Ellery,4
Monica,Ewy,4
Dominik,Frank,4
Imhan,Ghio,4
Faye,Gillot,4
Anastasya,Gorev,4
Tamara,Gregory,4
Mark,Hewitt,4
Padm,Jaffri,4
Nina,Jagoda,4
Pippa,Johnson,4
Eliza,Kalinski,4
Ralph,Kirk,4
Robert,Leeming,4
Anthony,Lescott,4
Saffron,Leyton,4
Aafia,Mainey,4
Arielle,Matthews,4
Harvey,McGregor,4
Paul,Morgan,4
Oliver,Murphy,4
Aaban,Musa,4
Walter,Newman,4
Exia,Nuo,4
Mollly,Parker,4
Wanda,Pellas,4
Kush,Rasheed,4
Stefania,Rodica,4
Benjamin,Rosenfield,4
Emilee,Ryan,4
Madalina,Sanda,4
James,Sandwell,4
Jayde,Summers,4
Sabina,Suresh,4
Isak,Townsend,4
Luke,Travers,4
Amit,Valin,4
Beatrice,Welch,4
William,Whitehead,4
Zachary,Williamson,4
Richard,Akeman,5
Steven,Akeman,5
Sofia,Alamilla,5
Karolina,Balik,5
Valeriya,Banin,5
Chloe,Banks,5
Molly,Barrick,5
Miss Lettie,Browne,5
William,Cain,5
Ryan,Carter,5
Luca,Castagno,5
Evia,Caster,5
Viktor,Cichy,5
Emma,Clarke,5
Tamson,Davies,5
Connie,Dawes,5
Elena,DeFeo,5
Hubert,Domain,5
Monty,Downham,5
David,Edwards,5
Michael,Elliott,5
Sophie,Elliott,5
Ryan,Flint,5
Izabela,Frano,5
Sebastian,Gaida,5
Lily,Green,5
George,Harvey,5
Oscar,Henson,5
Jasmir,Hossein,5
Pawel,Jonak,5
Ayra,Kalil,5
Henry,Kienan,5
Jack,Lewis,5
Cheng,Lok,5
Mei,Lowes,5
Philip,Mason,5
Paige,Masters,5
Lily Mary,McKenzie,5
Pheobe,Miles,5
Paul,Miller,5
Babul,Mostafa,5
Aadi,Nabendu,5
Yazen,Odeh,5
Kostas,Paradis,5
Aysha,Parveen,5
Lucy,Preston,5
Adam,Pryor,5
Daania,Rashed,5
Lewis,Rayner,5
Mark,Regan,5
Matrona,Ricci,5
Bharavi,Shakoor,5
Elsa,Stanton,5
Megan,Taylor,5
Samiya,Thompson-Smith,5
Ariel,Whelan,5
Enisa,Zafar,5
Layla,Zafar,5
Luca,Zanni,5
Blanka,Zilinskwi,5
Abjit,Abhra,6
Alisha,Abhra,6
Stan,Ackton,6
Josef,Andrews,6
Eve,Bailey,6
Cyla,Balinski,6
Fil,Balinski,6
Iwa,Balinski,6
Hugo,Bennison,6
Justin,Benson,6
Jack,Berkley,6
Winston,Burrows,6
Billy,Carlson,6
William,Clapson,6
Jonny,Constantinou,6
Max,Cory,6
Katherine,Davies,6
Nadia,Del Sonno,6
Pasquale,DiCalvi,6
Sara,DiMichele,6
Danesh,Ebi,6
Cheng,Enlai,6
Alin,Fane,6
Bryda,Felek,6
Biagio,Ferdinandez,6
Megan,Flanagan,6
Biji,Gowda,6
Lara,Gray,6
Giv,Hassan,6
Jack,Henderson,6
Luli,Hjwang,6
Gadin,Hussain,6
Carlie,Lane,6
Megan,Lewis-Jones,6
Klara,Ludmitas,6
Dawid,Machowski,6
William,Matthews,6
Ethan,Mattson,6
Joshua,McKenzie,6
Harvey,Miller,6
Grace,Millson,6
Lexi,Mitch,6
Salil,Negi,6
Nita,Niyati,6
Henry,Parker,6
Bethany,Parr,6
Marcus,Philips,6
Emma,Phillips,6
Dragoslav,Plavsic,6
Izzie,Selby,6
Aanni,Shari,6
Jessica,Simpson,6
Faraz,Singh,6
Erin,Smith,6
Thomas,Stevens,6
Alice,Wade,6
Kimberley,Watts,6
Amie,Whitemore,6
Eloise,Williams,6
Tamwar,Abdullah,7
Abegunde,Adeyemi,7
Bathany,Allen,7
Elsie,Allen,7
Louie,Allen,7
Sophia,Alsop,7
Mia,Andersen,7
Sara,Anderson,7
Ewan,Andrews,7
Noor,Bagri,7
Nicolas,Barker,7
Anthony,Barrett,7
Harvey,Beynon,7
Dominik,Booth,7
Hazel,Bryne,7
Shay,Bryne,7
Anabelle,Burns,7
Finn,Burton,7
Madeline,Byrne,7
Emelia,Carr,7
Oliver Olly,Carrick,7
Daniel,Carter,7
Michael,Cassidy,7
Lucie,Cedric-Smith,7
Romano,Celestena,7
Kashi,Chabra,7
Amber,Chapman,7
Alicia,Ciprio,7
Gabriel,Clarke,7
Matthew,Clarke,7
Samuel,Cole,7
Darcy,Cooke,7
Tilly,Danes,7
Kit,Davis,7
Maxwell,Day,7
Papia,Dewan,7
Bethany,Dexter,7
Ayam,Dhanial,7
Silvana,DiMonaco,7
Eithne,Duffy,7
Scarlett,Erickson,7
Chelsey,Evans,7
Kasia,Ewas,7
Lethabo,Fara,7
Huma,Farooqi,7
Caitlin,Fisher,7
Jenson,Fisher,7
Poppy,Fleming,7
Aelwyn,Flint,7
Ethan,Franklin,7
Erica,George,7
Niesha,Ghulam,7
Ellie,Grant,7
Eve,Griffiths,7
Alexia,Hamilton,7
Aurelia,Hamnet,7
Keira,Harris,7
John,Hope,7
Milo,Houghton,7
Ewan,Howard,7
Caihong,Huang,7
Tyler,Hudson,7
Layla,Hunter,7
Ahunna,Ibeh,7
Anastasiya,Ivan,7
Ela,Izolda,7
Daniel,Jefferson,7
Lauren,Jeffries,7
Frans,Jensen,7
Elis,Johnson,7
Reece,Johnson,7
Raya,Jones,7
Joshua,Kaur,7
Michael,Kelly,7
James,Kidson,7
Lola,Lawrence,7
Amara,Lawson,7
Hannah,Lewis,7
Joshua,Lowe,7
Seumas,MacKay,7
Matija,Markovic,7
Olivia,Marsden,7
Heston,Martin,7
Isobel,Matthews,7
Kristian,Maverick,7
Ciara,McCarthy,7
Teddie,McDonald,7
James,McGill,7
Joseph,McGormick,7
Luke,McKewan,7
Sarda,Mensah,7
Olivia,Mills,7
Harry,Mitchell,7
Laura,Mitchell,7
Alessandro,Moligno,7
Gabriella,Morgan,7
Kate,Morris,7
Jane,Mortimer,7
Tariq,Muneer,7
Safia,Nadu,7
Sana,Nambiar,7
Emily,Newman,7
Isak,Odlegly,7
Kanye,Okoro,7
Ryan,Osborne,7
Jackson,Parker,7
Matis,Pellas,7
Emily,Peterson,7
Sandor,Piotrowski,7
Eva,Potts,7
Lukas,Powell,7
Elliw,Poyner,7
Galel,Rahim,7
Jayden,Ramnarine,7
Yasmin,Rees,7
Bradley,Reid,7
Brayden,Reid,7
Katie,Reid,7
Rosie,Reid,7
Tier,Reid,7
Antonio,Ricci,7
Cooper,Richards,7
Lauren,Richards,7
Harry,Richardson,7
Amelia,Riley,7
Mabel,Robertson,7
Gracie-Mae,Ross,7
Kazmer,Rufin,7
Tapu,Sarwar,7
Liliana,Scott,7
Jitinder,Shah,7
Theo,Sharp,7
Jon,Short,7
David,Simmonds,7
Evie,Simons,7
Peter,Slater,7
Alice,Stone,7
Myrick,Sulwyn,7
Elspeth,Sutharlan,7
George,Tate,7
Oliver,Thompson,7
Renee,Thompson,7
Redeem,Tinubu,7
Kazia,Tóth,7
Perode,Treasure,7
Gracie,Turner,7
Marcos,Udo,7
Nicoll,Urgellés,7
Polino,Vadim,7
James,Walker,7
Lucy,Ward,7
Noah,Ward,7
Lekan,Washington,7
Amy,Westings,7
Kim,Wexler,7
Bobby,White,7
Dottie,White,7
Nikolai,Wojciech,7
Hironori,Yamamoto,7
Deon,Abimbola,8
Ethan,Adams,8
Maryam,Ahmed,8
Rebecca,Akeman,8
Eva,Allen,8
Fieda,Altenburg,8
Aleena,Anwar,8
Irene,Arkell,8
Sonya,Astoni,8
William Trevor,Astwick,8
Malakai,Bailey,8
Fiona,Baker,8
Rachel,Barnes,8
Anthony,Barrett,8
Joseph,Bassett,8
Bryn,Beddow,8
Alexander,Bell,8
Malik,Benson,8
Zachary,Benson,8
Claus,Bernhagen,8
Claire,Berry,8
Alfie,Booth,8
Adrijana,Brankovic,8
Eriberto,Brocato,8
Fiona,Brooks,8
Theo,Butler,8
Tilly,Candy,8
Giovanna,Capaldi,8
Som,Chandra,8
Susie,Ching,8
Anabel,Clarke,8
Frederick,Clover,8
Stephen,Colins,8
Maegan,Coughlan,8
Georgia,Cunningham,8
Leon,Curtis,8
Ben,Davies,8
Noah,Davies,8
Freddie,Dixon,8
Imber,Dorota,8
Polly,Doyle,8
Carl,Edmunds,8
Jaliyah,Edness,8
Amelia,Edwards,8
Holly,Ellersham,8
Reuben,Elliott,8
Charlotte,English,8
Oliver,Evans,8
Abigail,Eyres,8
Owen,Faulkner,8
Marco,Ferrari,8
Harry,Firth,8
Monty,Flowers,8
Willow,Fox,8
Scott,Garcia,8
Freya,Gibbons,8
Genene,Goudey,8
Imogen,Graham,8
Kenrich,Guilliams,8
Connor,Haddon,8
Matthew,Hall,8
Daniel,Harrison,8
Michael,Harrison,8
Barsha,Hasan,8
Samama,Hashmi,8
Sarah,Hudson,8
Jacasta,Huntley-Brown,8
Fahima,Hussain,8
Sapele,Ibrahim,8
Nathaniel,Jack,8
Carl,Jackson,8
Adam,Jennings,8
Albie,Johnson,8
Charlie,Jones,8
Robin,Jones,8
Tariq,Karim,8
Arthur,Kelly,8
Afham,Khan,8
Jahed,Khan,8
Sunjeeta,Khan,8
Ayasha,Khouri,8
Scarlett,King,8
Megan,Knight,8
Marjeta,Kudron,8
Freya,Lee,8
Jordan,Lucas,8
Philip,Lucas,8
Amber,MacDonald,8
Jade,Marandom,8
Jelena,Marowicz,8
Hal,Marshall,8
Hannah,Masterton,8
Elena,Mastropiero,8
Kiara,Mathis,8
Jack,McCormick,8
Andrew,Mead,8
Gan,Miao,8
Erin,Miskelly,8
Nicolas,Molita,8
Toral,Molla,8
Nevaeh,Morgan,8
Gabriel,Morris,8
Eleanor,Murray,8
Jakeem,Naser,8
Alekszio,Naszwisko,8
Brianna,Nenge,8
Benjamin,Nicholls,8
Elizabeth,Nott,8
Mila,Nuggent,8
Chibundo,Okafor,8
Obioma,Okereke,8
Makoto,Okubo,8
Fernanda,Oliveira,8
Mabon,Pendry,8
Aiden,Phillips,8
Jake,Poole,8
Rafi,Rahman,8
Swati,Ramanathan,8
Edward,Reece,8
Xavier,Rimone,8
Andrew,Robbins,8
Massimo,Roberto,8
Amelia,Robinson,8
Valentina,Romano,8
Strom,Sedlak,8
Tyler,Shelton,8
Christian,Simons,8
Amira,Singh,8
Inderjit,Singh,8
Aria,Smith,8
Cheryl,Smyth,8
Jonathan,Smyth,8
Rhianna,Smyth,8
Alesha,Stevens,8
Holly,Stevens,8
Harper,Stone,8
Antonio,Tanzari,8
Serena,Tanzari,8
Kiara,Terrell,8
Francis,Upton,8
Shaima,Verma,8
Arlo,Walker,8
Ellie,Warren,8
Mark,Webster,8
Kameron,Weddle,8
Aurora,White,8
Courtney,Whiting,8
Neilan,Wholley,8
Reggie,Williams,8
Sabrina,Wilson,8
Mia,Wood,8
Florence,Wright,8
Lily,Yarlett,8
Liam,Yates,8
Matilda,Young,8
Adan,Yusaf,8
Anastasia,Zazwisko,8
Luca,Zazwisko,8
Saskia,Zebed,8
Aemilia,Zinsmeister,8
Laura,Adams,9
Sabrina Susan,Alsop,9
Tarak,Amnar,9
Maya Hollie,Andrews,9
Wyatt Matty,Andrews,9
Finlay,Aston,9
Gwenneth Martha,Astwick,9
Skyla,Avolon,9
Steve,Bond,9
Ellis,Broden,9
Fletcher,Brompton,9
Samuel Matthew,Cadilia,9
Zara Tracey,Cameron,9
Zach Norbert,Carlsen,9
Hannah,Carter,9
Martin,Churchill,9
Emily,Coldman,9
Harry,Cookson,9
Edward Robert,Cooper,9
Robin,Coppler,9
Isabella,Cosenza,9
Caleb Jeremy,Coulson,9
Francesca Louise,Dakota,9
Lorenzo,Defeo,9
Tommy,Dennis,9
Harley Evie,Dicristo,9
Stephanie,Dixon,9
Susy Anne,Dolittle,9
Joshua,Drummond,9
Imogen,Edwards,9
Louise Jane,Eli,9
Ayman Eke,Elmasri,9
Kristina Lou,Folkner,9
Adam,Francis,9
Eric David,Friend,9
Oliver Robert,Giles,9
Kate,Godwin,9
Josie Jade,Greenberg,9
Isla Elizabeth,Harris,9
Elizabeth,Harvey,9
Saliha,Hasan,9
Farookh,Hassan,9
Tate Albert,Hennessy,9
David,Hill,9
Fridrik,Horvat,9
Hazel,Ingleby,9
Mason,Ives,9
Kofi,Jabari,9
Chloe Miya,Jackson,9
Isabella Ruthy,Jackson,9
Tristan Stewart,Jacob,9
Heather Marie,Jarvis,9
Dylan Alfie,Jenkins,9
Elvis Damon,Jerome,9
Hayley Janie,Johnson,9
Lola,Kaur,9
Max William,Kennedy,9
Eesha,Khan,9
Tariq,Khoker,9
Sara,Kiernan,9
Kiera,Knightley,9
Eleanor Jane,Lacy,9
Tyler Alex,Leonard,9
Barsha,Majeeb,9
Mason Eric,Malice,9
Muhammed,Marwani,9
Francesco Alfredo,Mascolo,9
Lacey,Middleton,9
Carla Jane,Mitchell,9
Cassie Jessica,Mitchell,9
Harry,Mitchem,9
Alison Dee,Montana,9
Paul,Morgan,9
Ryan Terrence,Morgan,9
Julia Jean,Morris,9
Tianna Vanessa,Morrise,9
Sienna,Mufigno,9
Oscar Nathan,Nesbitt,9
Callum Daniel,Nguyen,9
Elizabeth,Nott,9
Daisy,Novak,9
Mesaki,Objuwiz,9
Daniel Jackson,O'Connor,9
Lucy,O'Connor,9
Marc Albert,O'Connor,9
Afia,Ohakim,9
Zain,Okoye,9
Issa,Onwuatuegwu,9
Kalifa,Onwuatuegwu,9
David Robert,Osman,9
Zhivka,Ostark,9
Cody Alex,Palmer,9
Sophia Jane,Palmer,9
Lucia,Panizzi,9
Poppy Emma,Park,9
Elijah,Patel,9
Joshua Adam,Pearce,9
Freya Adele,Quick,9
Lawrence David,Quinn,9
Grace Jade,Quirke,9
Aleksandar,Radic,9
Sajib,Rahman,9
Lauren,Ralph,9
Mohammed,Rashid,9
Florence Nancy,Reece,9
Jude Jacob,Rees,9
Clara Roberta,Ricci,9
Stephen,Richards,9
Sara,Roberts,9
Esme Jessie,Roche,9
Jackson David,Roche,9
Gary,Rodgers,9
Carly Jade,Rogers,9
Sofia Valeria,Romero,9
Henry Augusta,Rose,9
Ian,Rostron,9
Selina,Rowe-Jones,9
Hermione Lily,Ryan,9
Toby Alex,Saunders,9
Ruby Ruth,Scott,9
Kenny Benjamin,Shearwood,9
Rosario Yolanda,Silva,9
Latanya,Singh,9
George Aaric,Smiles,9
Tabitha Jane,Smith,9
Vincent Josef,Smythye,9
Alexia,Sordillio,9
Jamie Timmy,Sparrow,9
Jessie Amy,Stava,9
Maud Adelaide,Stephens,9
Luke Ridley,Stephenson,9
Peter Martin,Stock,9
Alex Lee,Stone,9
Jasmine,Tamnar,9
Kiyoshi,Tanaka,9
Vincent,Taylor,9
Iris Jasmine,Teal,9
Sulien William,Thomas,9
Jessica,Thomson,9
Tyra,Thomson,9
Leo,Thwaite,9
Riley,Trafford,9
Andrew,Trueman,9
Stacey,Turner,9
Alice,Ulyatt,9
Chloe Eva,Umbridge,9
Alicia,Varney,9
Michelle,Vincent,9
Jina,Wang,9
Mark,Welwyn-Smith,9
Megan,Westwood,9
Ella Leigh,White,9
James,Wilkes,9
Zachary,Williams,9
Olivia,Windsor,9
Janet Dina,Wong,9
Rosie Shaniqua,Wright,9
Hazeema,Yazdani,9
Dastageer,Zimri,9`;

const LEARNERS = LEARNER_DATA.trim().split("\n").map(line => {
  const parts = line.split(",");
  const year = parts[parts.length - 1].trim();
  const forename = parts[0].trim();
  const surname = parts.slice(1, -1).join(",").trim();
  return { name: `${forename} ${surname}`, year };
});


function classifySubject(subject, yearGroup) {
  const s = (subject || "").trim().toLowerCase();
  const yg = (yearGroup || "").trim().toUpperCase();
  const isWelsh = /welsh|cymraeg/i.test(yg) || /wel/i.test(s) || /cymr/i.test(s);

  if (/reading|darllen/i.test(s)) return isWelsh ? "Welsh Reading" : "English Reading";
  if (/proc|gweithdrefnol/i.test(s)) return isWelsh ? "[Wel] Proc Numeracy" : "[Eng] Proc Numeracy";
  if (/reason|rhesymu/i.test(s)) return isWelsh ? "[Wel] Num Reasoning" : "[Eng] Num Reasoning";
  if (/numer/i.test(s) && /proc/i.test(s)) return isWelsh ? "[Wel] Proc Numeracy" : "[Eng] Proc Numeracy";
  if (/numer/i.test(s) && /reason/i.test(s)) return isWelsh ? "[Wel] Num Reasoning" : "[Eng] Num Reasoning";
  return subject;
}

function classifyType(type) {
  const t = (type || "").trim().toLowerCase();
  if (/braille/i.test(t)) return "Braille";
  if (/modif/i.test(t)) return "Modified";
  return "Standard";
}

function getBand(yearGroup) {
  const yg = (yearGroup || "").trim().toUpperCase().replace(/\s/g, "").replace("YEAR", "Y");
  return BAND_MAP[yg] || null;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function runSelection(forms, totalPicks = 32) {
  const grouped = {};
  for (const subj of SUBJECTS) grouped[subj] = [];
  for (const f of forms) {
    if (grouped[f.subject]) grouped[f.subject].push(f);
  }

  const subjectCounts = {};
  for (const s of SUBJECTS) subjectCounts[s] = grouped[s].length;

  // Determine quotas
  const sorted = SUBJECTS.map(s => ({ s, c: subjectCounts[s] })).sort((a, b) => a.c - b.c);
  const base = Math.floor(totalPicks / 6);
  let remainder = totalPicks - base * 6;
  const quota = {};
  for (const { s } of sorted) quota[s] = base;
  for (let i = sorted.length - 1; i >= 0 && remainder > 0; i--) {
    quota[sorted[i].s]++;
    remainder--;
  }

  const typeCounts = { Standard: 0, Modified: 0, Braille: 0 };
  const bandCounts = { LP: 0, UP: 0, SE: 0 };
  const selected = [];

  for (const subj of shuffle(SUBJECTS)) {
    const pool = [...grouped[subj]];
    const combos = {};
    for (const f of pool) {
      const key = `${f.type}|${f.band}`;
      if (!combos[key]) combos[key] = [];
      combos[key].push(f);
    }

    let picks = quota[subj];
    const usedIds = new Set();

    for (let p = 0; p < picks; p++) {
      const available = Object.entries(combos)
        .filter(([, arr]) => arr.some(f => !usedIds.has(f.id)))
        .map(([key]) => key);

      if (available.length === 0) break;

      const totalSoFar = selected.length + 1;
      const idealType = totalSoFar / 3;
      const idealBand = totalSoFar / 3;

      const scored = shuffle(available).map(key => {
        const [type, band] = key.split("|");
        const typeGap = idealType - typeCounts[type];
        const bandGap = idealBand - bandCounts[band];
        return { key, score: typeGap + bandGap };
      });

      scored.sort((a, b) => b.score - a.score);
      const top = scored.slice(0, Math.min(3, scored.length));
      const chosen = top[Math.floor(Math.random() * top.length)];

      const candidates = combos[chosen.key].filter(f => !usedIds.has(f.id));
      const pick = candidates[Math.floor(Math.random() * candidates.length)];

      usedIds.add(pick.id);
      selected.push(pick);
      typeCounts[pick.type]++;
      bandCounts[pick.band]++;
    }
  }

  return { selected, typeCounts, bandCounts };
}

const SAMPLE_CSV = `Subject,Type,Year Group,Form
English Reading,Standard,Y2,ER-S-Y2-001
English Reading,Modified,Y3,ER-M-Y3-002
English Reading,Braille,Y5,ER-B-Y5-003
Welsh Reading,Standard,Y4,WR-S-Y4-001
[Eng] Num Reasoning,Standard,Y7,ENR-S-Y7-F1
[Eng] Num Reasoning,Standard,Y7,ENR-S-Y7-F2`;

export default function AssessmentSelector() {
  const [rawData, setRawData] = useState("");
  const [forms, setForms] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [colMap, setColMap] = useState({ subject: "", type: "", yearGroup: "", form: "" });
  const [headers, setHeaders] = useState([]);
  const [step, setStep] = useState("input"); // input | map | results
  const [totalPicks, setTotalPicks] = useState(32);

  const parseCSV = useCallback((text) => {
    const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) { setError("Need at least a header row and one data row."); return; }

    const sep = lines[0].includes("\t") ? "\t" : ",";
    const hdrs = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, ""));
    setHeaders(hdrs);

    // Auto-map columns
    const auto = { subject: "", type: "", yearGroup: "", form: "" };
    for (const h of hdrs) {
      const hl = h.toLowerCase();
      if (/subject|area|discipline/i.test(hl) && !auto.subject) auto.subject = h;
      else if (/type|format|access/i.test(hl) && !auto.type) auto.type = h;
      else if (/year|yr|group|band/i.test(hl) && !auto.yearGroup) auto.yearGroup = h;
      else if (/form|name|id|title|test/i.test(hl) && !auto.form) auto.form = h;
    }
    setColMap(auto);

    const rows = lines.slice(1).map((line, i) => {
      const vals = line.split(sep).map(v => v.trim().replace(/^"|"$/g, ""));
      const row = {};
      hdrs.forEach((h, j) => row[h] = vals[j] || "");
      row._idx = i;
      return row;
    });

    setForms(rows);
    setError("");
    setStep("map");
  }, []);

  const applyMapping = useCallback(() => {
    if (!colMap.subject || !colMap.type || !colMap.yearGroup) {
      setError("Map at least Subject, Type, and Year Group columns.");
      return;
    }
    const mapped = forms.map((r, i) => ({
      id: i,
      rawSubject: r[colMap.subject],
      subject: classifySubject(r[colMap.subject], r[colMap.yearGroup]),
      type: classifyType(r[colMap.type]),
      band: getBand(r[colMap.yearGroup]),
      yearGroup: r[colMap.yearGroup],
      formName: colMap.form ? r[colMap.form] : `Form-${i + 1}`,
      raw: r,
    })).filter(f => f.band && SUBJECTS.includes(f.subject));

    if (mapped.length === 0) {
      setError("No valid forms found after mapping. Check your column assignments.");
      return;
    }
    setForms(mapped);
    setError("");
    setStep("results");
    const res = runSelection(mapped, totalPicks);
    setResult(res);
  }, [forms, colMap, totalPicks]);

  const rerun = useCallback(() => {
    if (forms.length) {
      const res = runSelection(forms, totalPicks);
      setResult(res);
    }
  }, [forms, totalPicks]);

  const exportCSV = useCallback(() => {
    if (!result) return;
    const hdr = "Form,Subject,Type,Year Group,Band";
    const rows = result.selected.map(f =>
      `"${f.formName}","${f.subject}","${f.type}","${f.yearGroup}","${f.band}"`
    );
    const blob = new Blob([hdr + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "selected_assessments.csv"; a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  const exportScheduler = useCallback(() => {
    if (!result) return;

    // Build a shuffled pool per year, drawn down as rows are assigned
    const poolByYear = {};
    for (const l of LEARNERS) {
      if (!poolByYear[l.year]) poolByYear[l.year] = [];
      poolByYear[l.year].push(l.name);
    }
    for (const yr of Object.keys(poolByYear)) poolByYear[yr] = shuffle(poolByYear[yr]);
    const usedByYear = {};

    const rows = result.selected.map(f => {
      const yr = (f.yearGroup || "").replace(/\D/g, "");
      let learnerName = "Unknown Learner";
      if (poolByYear[yr] && poolByYear[yr].length > 0) {
        if (!usedByYear[yr]) usedByYear[yr] = 0;
        const idx = usedByYear[yr] % poolByYear[yr].length;
        learnerName = poolByYear[yr][idx];
        usedByYear[yr]++;
      }

      let lang = "";
      let aType = "";
      const isReasoning = f.subject.includes("Reasoning");
      const isProc = f.subject.includes("Proc");
      const isWelsh = f.subject.startsWith("[Wel]") || f.subject === "Welsh Reading";

      if (f.subject === "English Reading" || f.subject === "Welsh Reading") {
        aType = f.subject;
        lang = "";
      } else if (isProc) {
        aType = "Numeracy (Procedural)";
        lang = isWelsh ? "Welsh" : "English";
      } else if (isReasoning) {
        aType = "Numeracy (Reasoning)";
        lang = isWelsh ? "Welsh" : "English";
      }

      if (f.type === "Modified") {
        aType += isReasoning ? " - MLP user" : " \u2013 MLP user";
      } else if (f.type === "Braille") {
        aType += isReasoning ? " - Braille user" : " \u2013 Braille user";
      }

      return `${aType},${lang},${yr},${learnerName}`;
    });
    const hdr = "Assessment Type,Language,Year Group,Learner Name";
    const blob = new Blob([hdr + "\n" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "scheduler_import.csv"; a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  const reset = () => { setStep("input"); setForms([]); setResult(null); setError(""); setRawData(""); };

  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
      background: "var(--bg, #0a0a0f)",
      color: "var(--text, #d4d4d8)",
      minHeight: "100vh",
      padding: "2rem",
      boxSizing: "border-box",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet" />

      <style>{`
        :root {
          --bg: #0a0a0f;
          --surface: #141419;
          --surface2: #1c1c24;
          --border: #2a2a35;
          --text: #d4d4d8;
          --muted: #71717a;
          --accent: #22d3ee;
          --accent2: #a78bfa;
          --accent3: #34d399;
          --warn: #fbbf24;
        }
        @media (prefers-color-scheme: light) {
          :root {
            --bg: #f4f4f5;
            --surface: #ffffff;
            --surface2: #e4e4e7;
            --border: #d4d4d8;
            --text: #18181b;
            --muted: #71717a;
            --accent: #0891b2;
            --accent2: #7c3aed;
            --accent3: #059669;
          }
        }
        * { box-sizing: border-box; }
        textarea, select, input, button { font-family: inherit; }
        textarea {
          width: 100%; min-height: 180px; padding: 1rem;
          background: var(--surface); color: var(--text);
          border: 1px solid var(--border); border-radius: 8px;
          font-size: 13px; resize: vertical; line-height: 1.6;
        }
        textarea:focus { outline: none; border-color: var(--accent); }
        select {
          padding: 6px 10px; background: var(--surface); color: var(--text);
          border: 1px solid var(--border); border-radius: 6px; font-size: 13px;
        }
        input[type="number"] {
          width: 70px; padding: 6px 10px; background: var(--surface);
          color: var(--text); border: 1px solid var(--border);
          border-radius: 6px; font-size: 13px; text-align: center;
        }
        .btn {
          padding: 10px 20px; border: none; border-radius: 6px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-primary { background: var(--accent); color: #000; }
        .btn-primary:hover { filter: brightness(1.15); }
        .btn-ghost {
          background: transparent; color: var(--accent);
          border: 1px solid var(--accent);
        }
        .btn-ghost:hover { background: var(--accent); color: #000; }
        .pill {
          display: inline-block; padding: 3px 10px; border-radius: 99px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
        }
        .grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .stat-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; padding: 14px; text-align: center;
        }
        .stat-card .val { font-size: 28px; font-weight: 700; }
        .stat-card .lbl { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { text-align: left; padding: 8px 10px; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
        td { padding: 8px 10px; border-bottom: 1px solid var(--border); }
        tr:hover td { background: var(--surface2); }
        .err { color: #ef4444; font-size: 13px; margin-top: 8px; }
        .section { margin-bottom: 2rem; }
        h1 { font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; font-weight: 700; margin: 0 0 0.25rem; }
        h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 600; margin: 0 0 1rem; color: var(--accent); }
        .subtitle { color: var(--muted); font-size: 13px; margin-bottom: 2rem; }
      `}</style>

      <h1>Assessment Selector</h1>
      <p className="subtitle">Balanced greedy selection across Subject × Type × Year Band</p>

      {step === "input" && (
        <div className="section">
          <h2>01 — Paste Assessment Data</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
            Paste CSV or tab-separated data with headers. Needs columns for Subject, Type, and Year Group at minimum.
          </p>
          <textarea
            value={rawData}
            onChange={e => setRawData(e.target.value)}
            placeholder={`Subject\tType\tYear Group\tForm Name\nEnglish Reading\tStandard\tY2\tER-S-Y2-001\n...`}
          />
          <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn btn-primary" onClick={() => parseCSV(rawData)} disabled={!rawData.trim()}>
              Parse Data →
            </button>
            <span style={{ color: "var(--muted)", fontSize: 12 }}>or</span>
            <button className="btn btn-ghost" onClick={() => { setRawData(SAMPLE_CSV); }}>
              Load Sample
            </button>
          </div>
          {error && <p className="err">{error}</p>}
        </div>
      )}

      {step === "map" && (
        <div className="section">
          <h2>02 — Map Columns</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
            Found <strong style={{ color: "var(--accent)" }}>{forms.length}</strong> rows and <strong style={{ color: "var(--accent)" }}>{headers.length}</strong> columns. Assign columns below.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", maxWidth: 500 }}>
            {[
              ["subject", "Subject *"],
              ["type", "Type *"],
              ["yearGroup", "Year Group *"],
              ["form", "Form Name"],
            ].map(([key, label]) => (
              <div key={key}>
                <label style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>
                <select value={colMap[key]} onChange={e => setColMap(p => ({ ...p, [key]: e.target.value }))} style={{ display: "block", width: "100%", marginTop: 4 }}>
                  <option value="">— select —</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "center" }}>
            <label style={{ fontSize: 12, color: "var(--muted)" }}>Total picks:</label>
            <input type="number" value={totalPicks} min={1} max={forms.length} onChange={e => setTotalPicks(Math.max(1, parseInt(e.target.value) || 1))} />
            <button className="btn btn-primary" onClick={applyMapping}>Run Selection →</button>
            <button className="btn btn-ghost" onClick={reset}>← Back</button>
          </div>
          {error && <p className="err">{error}</p>}
        </div>
      )}

      {step === "results" && result && (
        <div>
          <h2>03 — Results</h2>

          <div className="section">
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <button className="btn btn-primary" onClick={rerun}>↻ Re-roll</button>
              <button className="btn btn-ghost" onClick={exportCSV}>↓ Export CSV</button>
              <button className="btn btn-ghost" onClick={exportScheduler}>↓ Export Scheduler CSV</button>
              <button className="btn btn-ghost" onClick={reset}>← Start Over</button>
            </div>

            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
              Selected <strong style={{ color: "var(--accent)" }}>{result.selected.length}</strong> from {forms.length} eligible forms.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div>
                <p style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Type Distribution</p>
                <div className="grid3">
                  {TYPES.map(t => (
                    <div key={t} className="stat-card">
                      <div className="val" style={{ color: t === "Standard" ? "var(--accent)" : t === "Modified" ? "var(--accent2)" : "var(--accent3)" }}>{result.typeCounts[t]}</div>
                      <div className="lbl">{t}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Band Distribution</p>
                <div className="grid3">
                  {BANDS.map(b => (
                    <div key={b} className="stat-card">
                      <div className="val" style={{ color: b === "LP" ? "var(--accent)" : b === "UP" ? "var(--accent2)" : "var(--accent3)" }}>{result.bandCounts[b]}</div>
                      <div className="lbl">{BAND_LABELS[b]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 24 }}>
              {SUBJECTS.map(s => {
                const count = result.selected.filter(f => f.subject === s).length;
                return (
                  <div key={s} className="stat-card">
                    <div className="val" style={{ fontSize: 22, color: "var(--text)" }}>{count}</div>
                    <div className="lbl" style={{ fontSize: 10 }}>{s}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="section" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Form</th>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Year</th>
                  <th>Band</th>
                </tr>
              </thead>
              <tbody>
                {result.selected.map((f, i) => (
                  <tr key={f.id}>
                    <td style={{ color: "var(--muted)" }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{f.formName}</td>
                    <td>{f.subject}</td>
                    <td>
                      <span className="pill" style={{
                        background: f.type === "Standard" ? "rgba(34,211,238,0.15)" : f.type === "Modified" ? "rgba(167,139,250,0.15)" : "rgba(52,211,153,0.15)",
                        color: f.type === "Standard" ? "var(--accent)" : f.type === "Modified" ? "var(--accent2)" : "var(--accent3)",
                      }}>{f.type}</span>
                    </td>
                    <td>{f.yearGroup}</td>
                    <td>
                      <span className="pill" style={{
                        background: "var(--surface2)", color: "var(--text)",
                      }}>{f.band}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
