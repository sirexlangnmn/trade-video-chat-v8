let adjectives = [
    "adventurous",
    "affectionate",
    "agreeable",
    "ambitious",
    "bright",
    "charming",
    "compassionate",
    "considerate",
    "courageous",
    "courteous",
    "diligent",
    "enthusiastic",
    "generous",
    "happy",
    "helpful",
    "inventive",
    "likable",
    "loyal",
    "passionate",
    "reliable",
    "resourceful",
    "sensible",
    "sincere",
    "sympathetic",
    "trustworthy",
    "witty",
    "adorable",
    "attractive",
    "beautiful",
    "colorful",
    "cute",
    "elegant",
    "fit",
    "gorgeous",
    "sleek",
    "amazing",
    "awesome",
    "excellent",
    "fabulous",
    "fantastic",
    "incredible",
    "outstanding",
    "splendid",
    "super",
    "wonderful",
    "new",
    "happy",
    "shiny",
    "clean",
    "nice",
    "cool",
    "hot",
    "cold",
    "warm",
    "slow",
    "fast",
    "red",
    "white",
    "blue",
    "green",
    "basic",
    "strong",
    "cute",
    "nice",
    "huge",
    "rare",
    "lucky",
    "tall",
    "great",
    "long",
    "single",
    "rich",
    "fresh",
    "brave",
    "calm",
    "smart",
];

let nouns = [
    "labyrinth",
    "ineffable",
    "incendiary",
    "ephemeral",
    "cynosure",
    "propinquity",
    "infatuation",
    "incandescent",
    "eudaemonia",
    "raconteur",
    "petrichor",
    "sumptuous",
    "angst",
    "aesthete",
    "nadir",
    "miraculous",
    "lassitude",
    "gossamer",
    "bungalow",
    "scintilla",
    "aurora",
    "inure",
    "mellifluous",
    "euphoria",
    "serendipity",
    "cherish",
    "demure",
    "elixir",
    "eternity",
    "felicity",
    "languor",
    "love",
    "solitude",
    "epiphany",
    "quintessential",
    "plethora",
    "nemesis",
    "lithe",
    "tranquility",
    "elegance",
    "renaissance",
    "eloquence",
    "sequoia",
    "peace",
    "lullaby",
    "paradox",
    "pristine",
    "effervescent",
    "opulence",
    "ethereal",
    "sanguine",
    "panacea",
    "bodacious",
    "axiom",
    "silhouette",
    "surreptitious",
    "ingenue",
    "dulcet",
    "tryst",
    "ebullience",
    "dog",
    "wrench",
    "apple",
    "pear",
    "ghost",
    "cat",
    "wolf",
    "squid",
    "goat",
    "snail",
    "hat",
    "sock",
    "plum",
    "bear",
    "snake",
    "turtle",
    "horse",
    "spoon",
    "fork",
    "spider",
    "tree",
    "chair",
    "table",
    "couch",
    "towel",
    "panda",
    "bread",
    "grape",
    "cake",
    "brick",
    "rat",
    "mouse",
    "bird",
    "oven",
    "phone",
    "photo",
    "frog",
    "bear",
    "camel",
    "sheep",
    "shark",
    "tiger",
    "zebra",
    "duck",
    "eagle",
    "fish",
    "kitten",
    "lobster",
    "owl",
    "puppt",
    "rabbit",
    "fox",
    "whale",
    "beaver",
    "lizard",
    "parrot",
    "sloth",
    "swan",
];

function getUuid() {
    var uuid;

    $.ajax({
        url: '/uuid',
        contentType: 'application/json',
        success: function (response) {
            uuid = response.uuid;
        },
        async: false //
    });

    return uuid;
}


function getRandomNumber(length) {
    let result = "";
    let characters = "0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

let adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
let noun = nouns[Math.floor(Math.random() * nouns.length)];
let num = getRandomNumber(5);
noun = noun.charAt(0).toUpperCase() + noun.substring(1);
adjective = adjective.charAt(0).toUpperCase() + adjective.substring(1);
document.getElementById("roomName").value = "";


/*-----------------------------
    Typing Effect 
------------------------------*/
let i = 0;
let txt = "call_id=" + getUuid() + "/room_id=" + num + "/section_id=" + adjective + noun;
let speed = 50;

typeWriter();

function typeWriter() {
    if (i < txt.length) {
        document.getElementById("roomName").value += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}
