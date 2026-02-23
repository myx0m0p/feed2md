# feed2md Samples

This file shows concrete `input -> output` examples for the built-in templates and a custom template file.

## 1) RSS input -> short template output (default)

### Input (`rss.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Example RSS Feed</title>
    <link>https://example.com</link>
    <description>Example RSS description.</description>
    <item>
      <title>Article 1</title>
      <link>https://example.com/article-1</link>
      <pubDate>Mon, 10 Feb 2025 10:00:00 GMT</pubDate>
      <description>First article summary.</description>
    </item>
  </channel>
</rss>
```

### Command

```bash
feed2md https://example.com/rss.xml
```

### Output

```md
# Example RSS Feed

Source: https://example.com

## Articles

- Article 1 - (https://example.com/article-1)
  - Published: Mon, 10 Feb 2025 10:00:00 GMT
  - Summary: First article summary\.
```

## 2) RSS input -> full template output

### Command

```bash
feed2md https://example.com/rss.xml --template full
```

### Output

```md
# Example RSS Feed

Source: https://example.com

Description: Example RSS description\.

## Articles

- Article 1 - (https://example.com/article-1)
  - Published: Mon, 10 Feb 2025 10:00:00 GMT
  - Summary: First article summary\.
```

## 3) Atom input -> full template output

### Input (`atom.xml`)

```xml
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
  <title>Example Atom Feed</title>
  <subtitle>Small Atom example.</subtitle>
  <link href="https://example.org" rel="alternate"/>
  <link href="https://example.org/feed.xml" rel="self" type="application/atom+xml"/>
  <updated>2025-02-10T10:00:00Z</updated>
  <id>https://example.org/feed.xml</id>
  <entry>
    <title>Atom Entry 1</title>
    <link href="https://example.org/entry-1" rel="alternate"/>
    <id>tag:example.org,2025:/entry-1</id>
    <author><name>Jane Doe</name></author>
    <updated>2025-02-10T10:00:00Z</updated>
    <summary>Atom summary 1.</summary>
  </entry>
</feed>
```

### Command

```bash
feed2md https://example.com/atom.xml --template full
```

### Output

```md
# Example Atom Feed

Source: https://example.org

Description: Small Atom example\.
Language: en
Updated: 2025\-02\-10T10:00:00Z
ID: https://example\.org/feed\.xml
Links: self, application/atom+xml: https://example.org/feed.xml

## Articles

- Atom Entry 1 - (https://example.org/entry-1)
  - Updated: 2025\-02\-10T10:00:00Z
  - ID: tag:example\.org,2025:/entry\-1
  - Author: Jane Doe
  - Summary: Atom summary 1\.
```

## 4) Custom template file example

### Template file (`templates/basic.eta`)

```eta
Feed: <%= it.feed.title %>
Items: <%= it.items.length %>
First: <%= it.items[0].header %>
```

### Command

```bash
feed2md https://example.com/rss.xml --template-file ./templates/basic.eta
```

### Output

```txt
Feed: Example RSS Feed
Items: 1
First: Article 1 - (https://example.com/article-1)
```
