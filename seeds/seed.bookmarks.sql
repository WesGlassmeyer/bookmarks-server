INSERT INTO bookmarks (title, url, description, rating)
VALUES
('Thinkful', 'https://www.thinkful.com/', 'Online learning built to get you a high-paying job in tech.', '5'),
('Github', 'https://www.github.com/', 'GitHub is built for collaboration.', '4'),
('CodeSandbox', 'https://www.codesandbox.com/', 'Play with code.', '3')

--$ psql -U dunder_mifflin -d bookmarks -f ./seeds/seed.bookmarks.sql