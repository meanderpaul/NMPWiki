export function cleanDescription(description = '') {
  if (!description) return '';
  const separatorIndex = description.search(/-{4,}/);
  if (separatorIndex !== -1) {
    return description.substring(0, separatorIndex).trim();
  }
  return description.trim();
}

export function extractEpisodeNumber(title = '') {
  const epMatch = title.match(/\b(?:ep(?:isode)?\.?\s*|#[\s]*)(\d+)\b/i);
  if (epMatch) return epMatch[1];
  const leading = title.match(/^(\d+)\b/);
  return leading ? leading[1] : null;
}

export function extractGuestName(description = '', title = '') {
  const descriptionGuestMatch = description.match(/guest[s]?[:\s]+(.+?)(?:\.|,|;|\n|$)/i);
  if (descriptionGuestMatch?.[1]) {
    return descriptionGuestMatch[1].trim();
  }

  const titleMatch = title.match(/\bwith\s+(.+?)(?:\s+NMP|\s+#?\d|$)/i);
  if (titleMatch?.[1]) {
    return titleMatch[1]
      .split(/\s+(?:and|&|with)\s+/i)
      .map((part) => part.trim())
      .filter(Boolean)
      .join(', ');
  }

  return 'N/A';
}

export function groupEpisodesByYear(episodes = []) {
  return episodes.reduce((acc, episode) => {
    const year = new Date(episode.snippet?.publishedAt).getFullYear();
    if (!Number.isFinite(year)) return acc;
    if (!acc[year]) acc[year] = [];
    acc[year].push(episode);
    return acc;
  }, {});
}
