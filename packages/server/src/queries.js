// 50 Shades Grey
// 50 Shades of Free
// 50 Shades Darker
// Joker
// Black Christmas
// Godzilla
// Robocop
// Sex Tape
// Sausage Party
// Avengers: End Game
// X-Men
// Men in Black
// Black Panther
// Jumanji
// Jojo Rabbit
// Knives Out
// Midway
// 1917
// Us
// Ad Astra
// Parasite
// The Irishman
// Crazy Rich Asians

const movieData = [];

async function convert(ids) {
    for (const id of ids) {
        const d = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=ced0cb1`);
        const data = await d.json();
        const validObj = {
            classification: data.Rated,
            director: data.Director,
            duration: parseInt(data.Runtime),
            genre: data.Genre.toLowerCase()
                .split(",")
                .map((g) => g.trim()),
            id: "",
            name: data.Title,
            plot: data.Plot,
            poster: data.Poster,
            rating: 5 * parseFloat(`0.${data.Metascore}`),
        };
        movieData.push(validObj);
    }
    console.log(movieData);
}

const movies = [
    "tt3263904",
    "tt7286456",
    "tt10481868",
    "tt0831387",
    "tt1234721",
    "tt1956620",
    "tt1700841",
    "tt4154796",
    "tt2283336",
    "tt1825683",
    "tt7975244",
    "tt2584384",
    "tt8946378",
    "tt6924650",
    "tt8579674",
    "tt6857112",
    "tt2935510",
    "tt6751668",
    "tt1302006",
    "tt3104988",
];

convert(movies);

const data1 = [
    {
        classification: "PG-13",
        director: "Clint Eastwood",
        duration: 96,
        genre: ["biography", "drama"],
        id: "",
        name: "Sully",
        plot:
            'The story of Chesley "Sully" Sullenberger (Tom Hanks), an American pilot who became a hero after landing his damaged plane on the Hudson River in order to save the flight\'s passengers and crew.',
        poster:
            "https://m.media-amazon.com/images/M/MV5BY2NmZDAwM2QtZmFiMS00OTJlLTgxMTItZDMyZmVhYjE1MDY3XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
        rating: 3.7,
    },
    {
        classification: "R",
        director: "Todd Phillips",
        duration: 122,
        genre: ["crime", "drama", "thriller"],
        id: "",
        name: "Joker",
        plot:
            "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: the Joker.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
        rating: 2.9499999999999997,
    },
    {
        classification: "PG-13",
        director: "Sophia Takal",
        duration: 92,
        genre: ["horror", "mystery", "thriller"],
        id: "",
        name: "Black Christmas",
        plot:
            "A group of female students are stalked by a stranger during their Christmas break. That is until the young sorority pledges discover that the killer is part of an underground college conspiracy.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BMzczYzk4NWUtY2I0NC00OWEzLTgxYzAtOGM3NGU1ZjZlOGQxXkEyXkFqcGdeQXVyMDA4NzMyOA@@._V1_SX300.jpg",
        rating: 2.45,
    },
    {
        classification: "PG-13",
        director: "Gareth Edwards",
        duration: 123,
        genre: ["action", "adventure", "sci-fi", "thriller"],
        id: "",
        name: "Godzilla",
        plot:
            "The world is beset by the appearance of monstrous creatures, but one of them may be the only one who can save humanity.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BN2E4ZDgxN2YtZjExMS00MWE5LTg3NjQtNTkxMzJhOTA3MDQ4XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
        rating: 3.1,
    },
    {
        classification: "PG-13",
        director: "José Padilha",
        duration: 117,
        genre: ["action", "crime", "sci-fi", "thriller"],
        id: "",
        name: "RoboCop",
        plot:
            "In 2028 Detroit, when Alex Murphy, a loving husband, father and good cop, is critically injured in the line of duty, the multinational conglomerate OmniCorp sees their chance for a part-man, part-robot police officer.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BMjAyOTUzMTcxN15BMl5BanBnXkFtZTgwMjkyOTc1MDE@._V1_SX300.jpg",
        rating: 2.6,
    },
    {
        classification: "R",
        director: "Jake Kasdan",
        duration: 94,
        genre: ["comedy", "romance"],
        id: "",
        name: "Sex Tape",
        plot:
            "A married couple wake up to discover that the sex tape they made the evening before has gone missing, leading to a frantic search for its whereabouts.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BNDYzMzg5OTA0Ml5BMl5BanBnXkFtZTgwNjQzNzExMjE@._V1_SX300.jpg",
        rating: 1.7999999999999998,
    },
    {
        classification: "R",
        director: "Greg Tiernan, Conrad Vernon",
        duration: 89,
        genre: ["animation", "adventure", "comedy", "fantasy"],
        id: "",
        name: "Sausage Party",
        plot: "A sausage strives to discover the truth about his existence.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BMjkxOTk1MzY4MF5BMl5BanBnXkFtZTgwODQzOTU5ODE@._V1_SX300.jpg",
        rating: 3.3000000000000003,
    },
    {
        classification: "PG-13",
        director: "Anthony Russo, Joe Russo",
        duration: 181,
        genre: ["action", "adventure", "drama", "sci-fi"],
        id: "",
        name: "Avengers: Endgame",
        plot:
            "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg",
        rating: 3.9000000000000004,
    },
    {
        classification: "PG-13",
        director: "F. Gary Gray",
        duration: 114,
        genre: ["action", "adventure", "comedy", "sci-fi"],
        id: "",
        name: "Men in Black: International",
        plot:
            "The Men in Black have always protected the Earth from the scum of the universe. In this new adventure, they tackle their biggest threat to date: a mole in the Men in Black organization.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BMDZkODI2ZGItYTY5Yi00MTA4LWExY2ItM2ZmNjczYjM0NDg1XkEyXkFqcGdeQXVyMzY0MTE3NzU@._V1_SX300.jpg",
        rating: 1.9,
    },
    {
        classification: "PG-13",
        director: "Ryan Coogler",
        duration: 134,
        genre: ["action", "adventure", "sci-fi"],
        id: "",
        name: "Black Panther",
        plot:
            "T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future and must confront a challenger from his country's past.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BMTg1MTY2MjYzNV5BMl5BanBnXkFtZTgwMTc4NTMwNDI@._V1_SX300.jpg",
        rating: 4.4,
    },
    {
        classification: "PG-13",
        director: "Jake Kasdan",
        duration: 123,
        genre: ["action", "adventure", "comedy", "fantasy"],
        id: "",
        name: "Jumanji: The Next Level",
        plot:
            "In Jumanji: The Next Level, the gang is back but the game has changed. As they return to rescue one of their own, the players will have to brave parts unknown from arid deserts to snowy mountains, to escape the world's most dangerous game.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BOTVjMmFiMDUtOWQ4My00YzhmLWE3MzEtODM1NDFjMWEwZTRkXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
        rating: 2.9,
    },
    {
        classification: "PG-13",
        director: "Taika Waititi",
        duration: 108,
        genre: ["comedy", "drama", "war"],
        id: "",
        name: "Jojo Rabbit",
        plot:
            "A young boy in Hitler's army finds out his mother is hiding a Jewish girl in their home.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BZjU0Yzk2MzEtMjAzYy00MzY0LTg2YmItM2RkNzdkY2ZhN2JkXkEyXkFqcGdeQXVyNDg4NjY5OTQ@._V1_SX300.jpg",
        rating: 2.9,
    },
    {
        classification: "PG-13",
        director: "Rian Johnson",
        duration: 130,
        genre: ["comedy", "crime", "drama", "mystery", "thriller"],
        id: "",
        name: "Knives Out",
        plot:
            "A detective investigates the death of a patriarch of an eccentric, combative family.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BMGUwZjliMTAtNzAxZi00MWNiLWE2NzgtZGUxMGQxZjhhNDRiXkEyXkFqcGdeQXVyNjU1NzU3MzE@._V1_SX300.jpg",
        rating: 4.1,
    },
    {
        classification: "PG-13",
        director: "Roland Emmerich",
        duration: 138,
        genre: ["action", "adventure", "drama", "history", "war"],
        id: "",
        name: "Midway",
        plot:
            "The story of the Battle of Midway, told by the leaders and the sailors who fought it.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BYzA5Y2Q2YjktZDYwMi00NTdmLThlMjctMmY5NDgwOWRhZDUxXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
        rating: 2.3499999999999996,
    },
    {
        classification: "R",
        director: "Sam Mendes",
        duration: 119,
        genre: ["drama", "war"],
        id: "",
        name: "1917",
        plot:
            "April 6th, 1917. As a regiment assembles to wage war deep in enemy territory, two soldiers are assigned to race against time and deliver a message that will stop 1,600 men from walking straight into a deadly trap.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BOTdmNTFjNDEtNzg0My00ZjkxLTg1ZDAtZTdkMDc2ZmFiNWQ1XkEyXkFqcGdeQXVyNTAzNzgwNTg@._V1_SX300.jpg",
        rating: 3.9000000000000004,
    },
    {
        classification: "R",
        director: "Jordan Peele",
        duration: 116,
        genre: ["horror", "mystery", "thriller"],
        id: "",
        name: "Us",
        plot:
            "A family's serene beach vacation turns to chaos when their doppelgängers appear and begin to terrorize them.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BZTliNWJhM2YtNDc1MC00YTk1LWE2MGYtZmE4M2Y5ODdlNzQzXkEyXkFqcGdeQXVyMzY0MTE3NzU@._V1_SX300.jpg",
        rating: 4.050000000000001,
    },
    {
        classification: "PG-13",
        director: "James Gray",
        duration: 123,
        genre: ["adventure", "drama", "mystery", "sci-fi", "thriller"],
        id: "",
        name: "Ad Astra",
        plot:
            "Astronaut Roy McBride undertakes a mission across an unforgiving solar system to uncover the truth about his missing father and his doomed expedition that now, 30 years later, threatens the universe.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BZTllZTdlOGEtZTBmMi00MGQ5LWFjN2MtOGEyZTliNGY1MzFiXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
        rating: 4,
    },
    {
        classification: "R",
        director: "Bong Joon Ho",
        duration: 132,
        genre: ["comedy", "drama", "thriller"],
        id: "",
        name: "Parasite",
        plot:
            "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
        rating: 4.8,
    },
    {
        classification: "R",
        director: "Martin Scorsese",
        duration: 209,
        genre: ["biography", "crime", "drama"],
        id: "",
        name: "The Irishman",
        plot:
            "An old man recalls his time painting houses for his friend, Jimmy Hoffa, through the 1950-70s.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BMGUyM2ZiZmUtMWY0OC00NTQ4LThkOGUtNjY2NjkzMDJiMWMwXkEyXkFqcGdeQXVyMzY0MTE3NzU@._V1_SX300.jpg",
        rating: 4.699999999999999,
    },
    {
        classification: "PG-13",
        director: "Jon M. Chu",
        duration: 120,
        genre: ["comedy", "drama", "romance"],
        id: "",
        name: "Crazy Rich Asians",
        plot:
            "This contemporary romantic comedy, based on a global bestseller, follows native New Yorker Rachel Chu to Singapore to meet her boyfriend's family.",
        poster:
            "https://m.media-amazon.com/images/M/MV5BMTYxNDMyOTAxN15BMl5BanBnXkFtZTgwMDg1ODYzNTM@._V1_SX300.jpg",
        rating: 3.7,
    },
];
