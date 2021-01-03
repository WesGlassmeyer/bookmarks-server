function makeBookmarksArray() {
  return [
    {
      id: 1,
      title: "Thinkful",
      url: "https://www.thinkful.com/",
      description:
        "Online learning built to get you a high-paying job in tech.",
      rating: "5",
    },
    {
      id: 2,
      title: "Github",
      url: "https://www.github.com/",
      description: "GitHub is built for collaboration.",
      rating: "4",
    },
    {
      id: 3,
      title: "CodeSandbox",
      url: "https://www.codesandbox.com/",
      description: "Play with code.",
      rating: "3",
    },
  ];
}

function makeMaliciousBookmark() {
  const maliciousBookmark = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    url: "https://www.hackers.com",
    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    rating: 1,
  };
  const expectedBookmark = {
    ...maliciousBookmark,
    title:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousBookmark,
    expectedBookmark,
  };
}

module.exports = {
  makeBookmarksArray,
  makeMaliciousBookmark,
};
