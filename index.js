const fs = require("fs");
let sherlock,pride_and_prejudice,war_and_peace;
function init() {
    sherlock = fs.readFileSync('./texts/sherlock.txt', 'utf-8');
    sherlock = sherlock.replace(/\[(.*?)\]/gm, "").replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ")
    sherlock = sherlock.split(((BY_WORD)?(" "):""));
    sherlock=sherlock.filter((el)=>el!=="")

    pride_and_prejudice = fs.readFileSync('./texts/pride_and_prejudice.txt', 'utf-8');
    pride_and_prejudice = pride_and_prejudice.replace(/\[(.*?)\]/gm, "").replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ")
    pride_and_prejudice = pride_and_prejudice.split(((BY_WORD)?(" "):""));
    pride_and_prejudice=pride_and_prejudice.filter((el)=>el!=="")

    moby_dick = fs.readFileSync('./texts/moby_dick.txt', 'utf-8');
    moby_dick = moby_dick.replace(/\[(.*?)\]/gm, "").replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ")
    moby_dick = moby_dick.split(((BY_WORD)?(" "):""));
    moby_dick=moby_dick.filter((el)=>el!=="")

    war_and_peace = fs.readFileSync('./texts/war_and_peace.txt', 'utf-8');
    war_and_peace = war_and_peace.replace(/\[(.*?)\]/gm, "").replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ")
    war_and_peace = war_and_peace.split(((BY_WORD)?(" "):""));
    war_and_peace=war_and_peace.filter((el)=>el!=="")
}

const stats = new Map()

function learn(data,N) {
    for (let i = 0; i < data.length-N; i++) {
        let sequence=""
        const next_word=data[i+N].toLowerCase()
        for(let n=0;n<N;n++){
            sequence+=data[i+n].toLowerCase()+((BY_WORD)?(" "):"")
        }
        if(BY_WORD){
            sequence=sequence.trim()
        }

        if (!stats.get(sequence)) {
            stats.set(sequence, new Map())
        }
        const current_word_frequency = stats.get(sequence).get(next_word)
        if (current_word_frequency) {
            stats.get(sequence).set(next_word, current_word_frequency + 1)
        } else {
            stats.get(sequence).set(next_word, 1)
        }
    }
    console.log(`Sequences: ${stats.size}`)
}



class WeightedRandom {
    constructor(data) {
        this.data = data
        this.total_weight_sum = 0
        this.cumulative_weight_sum = []
        this.init()
    }
    init() {
        for (let [value, weight] of this.data) {
            this.total_weight_sum += weight
            this.cumulative_weight_sum.push([this.total_weight_sum, value])
        }
    }
    binary_search(arr, value) {
        var low = 0;
        var high = arr.length - 1;
        var mid;
        while (low <= high) {
            mid = Math.floor((low + high) / 2);
            if (arr[mid][0] === value) {
                return mid+1
            } else if (arr[mid][0] < value) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return low;
    }

    sample() {
        let random = Math.random() * this.total_weight_sum
        const index = this.binary_search(this.cumulative_weight_sum, random)
        return this.cumulative_weight_sum[index][1]
    }
}

function getRandomKey(collection) {
    let keys = Array.from(collection.keys());
    return keys[Math.floor(Math.random() * keys.length)];
}

function generate(n) {
    const random_beginning=getRandomKey(stats)
    console.log(random_beginning)
    let sentence = random_beginning
    let n_gram = random_beginning.split(((BY_WORD)?(" "):""))
    console.log(stats.get(random_beginning))
    for (let i = 0; i < n; i++) {
        const n_gram_stats = stats.get(n_gram.join(((BY_WORD)?(" "):"")))
        if (!n_gram_stats) {
            break
        }
        const dist = new WeightedRandom(n_gram_stats)
        const new_word = dist.sample()
        sentence += (((BY_WORD)?(" "):"") + new_word)
        n_gram.shift()
        n_gram.push(new_word)
    }
    console.log(sentence)
}

const BY_WORD=true;
init()
learn(sherlock,3)
learn(pride_and_prejudice,3)
learn(moby_dick,3)
learn(war_and_peace,3)

generate(40)