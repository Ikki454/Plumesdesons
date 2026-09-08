// --- Source de contenu -------------------------------------------------
// Une fois le projet Sanity créé (voir studio/ et CLAUDE.md), remplacez la
// valeur ci-dessous par votre Project ID (sanity.io/manage → votre projet).
// Tant qu'elle vaut "REMPLACER_PAR_VOTRE_PROJECT_ID", le site continue de
// lire data.json comme avant — rien ne casse en attendant la migration.
const SANITY_PROJECT_ID = "REMPLACER_PAR_VOTRE_PROJECT_ID";
const SANITY_DATASET = "production";

async function loadData() {
    let creations = [];
    let events = [];
    let loadedFromSanity = false;

    if (SANITY_PROJECT_ID && SANITY_PROJECT_ID !== "REMPLACER_PAR_VOTRE_PROJECT_ID") {
        try {
            const result = await fetchFromSanity();
            creations = result.creations || [];
            events = result.events || [];
            loadedFromSanity = true;
        } catch (err) {
            console.error("Impossible de charger le contenu depuis Sanity, retour sur data.json :", err);
        }
    }

    if (!loadedFromSanity) {
        const response = await fetch('data.json');
        const data = await response.json();
        creations = data.creations.map((c) => ({...c, imageAlt: c.image_alt}));
        events = data.events.map((e) => ({...e, jourMois: e.jour_mois}));
    }

    generateCreations(creations);
    generateFuturEvents(events);
}

async function fetchFromSanity() {
    const query = `{
        "creations": *[_type == "creation"] | order(order asc){
            title, description, "image": image.asset->url, imageAlt, annee, type, link
        },
        "events": *[_type == "event"] | order(order asc){
            title, description, jourMois, lieu, heure, link
        }
    }`;
    const url = `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Réponse Sanity ${response.status}`);
    }
    const json = await response.json();
    return json.result;
}

function generateCreations(creations) {
    for (let i=0; i < creations.length; i++) {
        const article = creations[i];

        const creationGrid = document.querySelector(".grid_container");

        const linkElement = document.createElement("a");
        linkElement.href = article.link;

        const cellElement = document.createElement("div");
        cellElement.classList.add("grid_cell");

        const imageElement = document.createElement("img");
        imageElement.src = article.image;
        imageElement.alt = article.imageAlt;

        const articleElement = document.createElement("div");
        articleElement.classList.add("grid_cell_text");

        const article1 = document.createElement("div");
        const titleElement = document.createElement("h3");
        titleElement.innerText = article.title;

        const article2 = document.createElement("div");
        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = article.description;

        const article3 = document.createElement("div");
        article3.classList.add("grid_cell_date_type");

        const dateElement = document.createElement("p");
        dateElement.innerText = article.annee;

        const article4 = document.createElement("div");
        const typeElement = document.createElement("p");
        typeElement.innerText = article.type;

        creationGrid.appendChild(linkElement);
        linkElement.appendChild(cellElement);

        cellElement.appendChild(imageElement);
        cellElement.appendChild(articleElement);

        articleElement.appendChild(article1);
        articleElement.appendChild(article2);
        articleElement.appendChild(article3);

        article1.appendChild(titleElement);
        article2.appendChild(descriptionElement);
        article3.appendChild(dateElement);
        article3.appendChild(article4);
        article4.appendChild(typeElement);
    }
}

function generateFuturEvents(events) {
    if (events.length > 0) {
        for (let i=0; i < events.length; i++) {
            const event = events[i];

            const futurEventsSection = document.querySelector(".future_events_container");

            const eventElement = document.createElement("div");
            eventElement.classList.add("future_events");
            eventElement.classList.add("event" + (i+1));

            const articleElement = document.createElement("div");

            const linkElement = document.createElement("a");
            linkElement.href = event.link;

            const btnElement = document.createElement("button");
            btnElement.innerText = "voir details";

            const titleElement = document.createElement("h3");
            titleElement.innerText = event.title;

            const descriptionElement = document.createElement("p");
            descriptionElement.innerText = event.description;

            const article1 = document.createElement("div");
            article1.classList.add("f_e_info");

            const dateElement1 = document.createElement("p");
            dateElement1.innerText = event.jourMois;

            const dateElement2 = document.createElement("p");
            dateElement2.innerText = event.lieu;

            const dateElement3 = document.createElement("p");
            dateElement3.innerText = event.heure;

            futurEventsSection.appendChild(eventElement);

            eventElement.appendChild(articleElement);
            eventElement.appendChild(linkElement);

            linkElement.appendChild(btnElement);

            articleElement.appendChild(titleElement);
            articleElement.appendChild(descriptionElement);
            articleElement.appendChild(article1);

            article1.appendChild(dateElement1);
            article1.appendChild(dateElement2);
            article1.appendChild(dateElement3);
        }
    } else {
        const futurEventsSection = document.querySelector(".future_events_container");

        const articleElement = document.createElement("div");

        const noEventText = document.createElement("p");
        noEventText.innerText = "Aucune représentation à venir pour le moment.";

        futurEventsSection.appendChild(articleElement);
        articleElement.appendChild(noEventText);
    }
}

loadData();
