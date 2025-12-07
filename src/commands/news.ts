export const createNews = () : string[] => {
  const news : string[] = [];
  const SPACE = "&nbsp;";

  news.push("<br>");
  news.push("<span class='command'>📰 Today's Tech & Science Headlines</span>");
  news.push("<br>");
  
  // Placeholder content - will be replaced by fetched RSS data
  news.push("<span style='color: #70FDFF;'>🔧 Development</span>");
  news.push("Loading latest development news...");
  news.push("<br>");
  
  news.push("<span style='color: #70FDFF;'>💻 Tech</span>");
  news.push("Loading latest tech news...");
  news.push("<br>");
  
  news.push("<span style='color: #70FDFF;'>🔬 Science</span>");
  news.push("Loading latest science news...");
  news.push("<br>");
  
  news.push("<span style='color: #70FDFF;'>🤖 AI</span>");
  news.push("Loading latest AI news...");
  news.push("<br>");
  
  news.push("<span style='color: #70FDFF;'>🎨 Design</span>");
  news.push("Loading latest design news...");
  news.push("<br>");
  
  return news;
}

export const NEWS = createNews();
