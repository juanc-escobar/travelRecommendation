async function loadData(query = '') {
    const response = await fetch('./travel_recommendation_api.json'); 
    const data = await response.json();

    const filteredData = query ? filterData(data, query) : data;
    displayData(filteredData);
}

function filterData(data, query) {
    query = query.toLowerCase();
    const filteredData = {
        countries: [],
        temples: [],
        beaches: []
    };

    const categoryKeywords = {
        countries: ["country", "countries"],
        temples: ["temple", "temples"],
        beaches: ["beach", "beaches"]
    };

    let isCategoryMatch = false;

    Object.keys(categoryKeywords).forEach(category => {
        if (categoryKeywords[category].includes(query)) {
            filteredData[category] = data[category];
            isCategoryMatch = true;
        }
    });

    if (!isCategoryMatch) {
        data['countries'].forEach(country => {
            if (country.name.toLowerCase().includes(query)) {
                filteredData.countries.push(country); 
            } else {
                const matchingCities = country.cities.filter(city => 
                    city.name.toLowerCase().includes(query)
                );
                if (matchingCities.length > 0) {
                    filteredData.countries.push({ ...country, cities: matchingCities });
                }
            }
        });

        filteredData['temples'] = data['temples'].filter(temple => 
            temple.name.toLowerCase().includes(query)
        );
        filteredData['beaches'] = data['beaches'].filter(beach => 
            beach.name.toLowerCase().includes(query)
        );
    }

    return filteredData;
}

function displayData(data) {
    const container = document.getElementById('data-container');
    container.innerHTML = '';

    data['countries'].forEach(country => {
        country.cities.forEach(city => {
            const card = createCard(city);
            container.appendChild(card);
        });
    });

    data['temples'].forEach(temple => {
        const card = createCard(temple);
        container.appendChild(card);
    });

    data['beaches'].forEach(beach => {
        const card = createCard(beach);
        container.appendChild(card);
    });
}

document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    loadData(query);
});

document.getElementById('clear-button').addEventListener('click', () => {
    document.getElementById('data-container').innerHTML = '';
    document.getElementById('search-input').value = '';
});

function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';

    const image = document.createElement('img');
    image.src = item.imageUrl;
    image.alt = `Image of ${item.name}`;

    const name = document.createElement('h3');
    name.textContent = item.name;

    const description = document.createElement('p');
    description.textContent = item.description;

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(description);

    return card;
}
