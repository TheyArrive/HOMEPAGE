var sites = {
    "Chan": {
        "4/g/ Technology": "https://boards.4channel.org/g/",
        "4/mu/ Music": "https://boards.4channel.org/mu/",
        "4/tv/ Television & Film": "https://boards.4channel.org/tv/",
        "4/pol/ Politcally Incorrect": "https://boards.4chan.org/pol/"
    },
    "Social": {
        "YouTube": "https://www.youtube.com/",
        "Twitter": "https://twitter.com/",
        "Twitch": "https://twitch.tv/"
    },
    "E-Mail": {
        "GMail": "https://mail.google.com/mail/u/0/"
    },
    "Games": {
        "CS:GO": "steam://run/730",
        "Osu!": "https://osu.ppy.sh",
        "Ripple": "https://ripple.moe/"
    }
};

var search = {
    "default": "https://duckduckgo.com/",
    "g": "https://google.com/search",
    "r": "https://reddit.com/search"
};

var pivotmatch = 0;
var totallinks = 0;
var prevregexp = "";

function matchLinks(regex = prevregexp) {
    totallinks = 0;
    pivotmatch = regex == prevregexp ? pivotmatch : 0;
    prevregexp = regex;
    pivotbuffer = pivotmatch;
    p = document.getElementById("links");

    while (p.firstChild) {
        p.removeChild(p.firstChild);
    }

    if (regex.charAt(1) == ' ' && search.hasOwnProperty(regex.charAt(0))) {
        document.getElementById("action").action = search[regex.charAt(0)];
        document.getElementById("action").children[0].name = "q";

    } else {
        match = new RegExp(regex ? regex : ".", "i");
        gmatches = false;

        for (i = 0; i < Object.keys(sites).length; i++) {
            matches = false;
            sn = Object.keys(sites)[i];
            section = document.createElement("div");
            section.id = sn;
            section.innerHTML = sn;
            section.className = "section";
            inner = document.createElement("div");

            for (l = 0; l < Object.keys(sites[sn]).length; l++) {
                ln = Object.keys(sites[sn])[l];

                if (match.test(ln)) {
                    link = document.createElement("a");
                    link.href = sites[sn][ln];
                    link.innerHTML = ln;

                    if (!pivotbuffer++ && regex != "") {
                        link.className = "selected";
                        document.getElementById("action").action = sites[sn][ln];
                        document.getElementById("action").children[0].removeAttribute("name");
                    }

                    inner.appendChild(link);
                    matches = true;
                    gmatches = true;
                    totallinks++;
                }
            }

            section.appendChild(inner);
            matches ? p.appendChild(section) : false;
        }

        if (!gmatches || regex == "") {
            document.getElementById("action").action = search["default"];
            document.getElementById("action").children[0].name = "q";
        }
    }

    document.getElementById("main").style.height = document.getElementById("main").children[0].offsetHeight + "px";
}

document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 38:
            pivotmatch = pivotmatch >= 0 ? 0 : pivotmatch + 1;
            matchLinks();
            break;

        case 40:
            pivotmatch = pivotmatch <= -totallinks + 1 ? -totallinks + 1 : pivotmatch - 1;
            matchLinks();
            break;

        default:
            break;
    }

    document.getElementById("action").children[0].focus();
}

document.getElementById("action").children[0].onkeypress = function(e) {
    if (e.key == "ArrowDown" || e.key == "ArrowUp") {
        return false;
    }
}

function displayClock() {
    now = new Date();
    clock = (now.getHours() < 10 ? "0" + now.getHours() : now.getHours()) + ":" +
        (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()) + ":" +
        (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds());
    document.getElementById("clock").innerHTML = clock;
}

window.onload = matchLinks();
document.getElementById("action").onsubmit = function() {
    svalue = this.children[0].value;
    if (svalue.charAt(1) == ' ' && search.hasOwnProperty(svalue.charAt(0))) {
        this.children[0].value = svalue.substring(2);
    }
    return true;
}

displayClock();
setInterval(displayClock, 1000);