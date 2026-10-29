const normalize = (text) => text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

// Scores one word against one destination. 0 means "no match".
function scoreWord(word, title, titleWords, keywords, other) {
  if (title.startsWith(word)) return 10;
  if (titleWords.some((t) => t.startsWith(word))) return 8;
  if (keywords.some((k) => k === word || k.startsWith(word))) return 7;
  if (title.includes(word)) return 5;
  if (keywords.some((k) => k.includes(word))) return 4;
  if (other.includes(word)) return 2;
  return 0;
}

// Every typed word must match; higher scores sort first, ties keep the data order.
export function searchDestinations(list, query) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return list;

  const scored = [];
  list.forEach((item, index) => {
    const title = normalize(item.title);
    const titleWords = title.split(/\s+/);
    const keywords = item.keywords.map(normalize);
    const other = normalize(`${item.description} ${item.category}`);

    let total = 0;
    for (const word of words) {
      const score = scoreWord(word, title, titleWords, keywords, other);
      if (score === 0) return;
      total += score;
    }
    scored.push({ item, index, total });
  });

  return scored.sort((a, b) => b.total - a.total || a.index - b.index).map((r) => r.item);
}
