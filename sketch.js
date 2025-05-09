let inputBox;
let tarotButtons = [];
let tarotResults = [];
let tarotPositions = [];
let questionDisplay;
let cardContainers = [];

function setup() {
  noCanvas();

  createElement('h1', 'Daily Tarot').addClass('bounce');

  inputBox = createInput('');
  inputBox.attribute('placeholder', 'Ask your question here...');
  inputBox.addClass('tarot-input');

  questionDisplay = createElement('h2', 'YOUR QUESTION:').addClass('question bounce');

  const resultsContainer = createDiv().addClass('results');

  for (let i = 0; i < 3; i++) {
    let container = createDiv().addClass('card-container').parent(resultsContainer);

    let title = createElement('h3', `Card ${i + 1}`).addClass('card-title').parent(container);
    let img = createImg('tpic/placeholder.jpg', 'Card image')
      .addClass('card-img')
      .parent(container);
    let text = createP('Waiting...').addClass('card-text').parent(container);

    cardContainers.push({ title, img, text });

    const btn = createButton(`Draw Card ${i + 1}`);
    btn.mousePressed(() => getTarotReading(i));
    btn.addClass('tarot-button');
    tarotButtons.push(btn);

    tarotResults.push(null);
    tarotPositions.push("upright");
  }
}

async function getTarotReading(index) {
  questionDisplay.html("YOUR QUESTION: " + inputBox.value());

  try {
    const response = await fetch("https://tarotapi.dev/api/v1/cards/random?n=1");
    const data = await response.json();
    const card = data.cards[0];

    const isUpright = Math.random() < 0.5;
    tarotPositions[index] = isUpright ? "UPRIGHT" : "REVERSED";

    const text = isUpright
      ? `${card.name} — ${card.meaning_up}`
      : `${card.name} — ${card.meaning_rev}`;

    let cardName = card.name.toLowerCase().replace(/\s+/g, '_');
    let imagePath = `tpic/${cardName}.jpg`;

    cardContainers[index].title.html(`Card ${index + 1} (${tarotPositions[index]})`);
    cardContainers[index].img.attribute('src', imagePath);
    cardContainers[index].text.html(text);
  } catch (err) {
    cardContainers[index].text.html('Error loading card.');
    console.error(err);
  }
}