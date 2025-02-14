const truncateDescription = (content, wordLimit = 20) => {
  if (!content) return "";
  const words = content.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return content;
};

export default truncateDescription;
